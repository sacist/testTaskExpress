import { Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import User from '../mongo/models/user';
import jwt from 'jsonwebtoken'

export const register: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { fullName, birthDate, email, password, role } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(409).json({ message: 'Пользователь с таким email уже зарегестрирован' })
            return
        }
        if (!fullName || !birthDate || !email || !password || !role) {
            res.status(400).json({ message: 'Все поля обязательны: fullName, birthDate, email, password, role' })
            return
        }
        if (role !== 'admin' && role !== 'user') {
            res.status(400).json({ message: 'Неправильная роль' })
            return
        }

        const hashedPwd = await bcrypt.hash(password, 10)

        const user = new User({
            fullName,
            birthDate,
            email,
            password: hashedPwd,
            role
        })

        await user.save()

        const refreshToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_KEY as string,
            { expiresIn:'7200h' }
        )

        res.json({ message: 'Успешная регистрация',refreshToken })
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Ошибка сервера' })
    }
}

export const login: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({ message: 'Все поля обязательны: email, password' })
            return
        }

        const user = await User.findOne({ email })
        if (!user) {
            res.status(401).json({ message: 'Пользователь не найден' })
            return
        }

        const doesPwdMatch = await bcrypt.compare(password, user.password)
        if (!doesPwdMatch) {
            res.status(401).json({ message: 'Неверный пароль' })
            return
        }

        // Нужно было бы сделать middleware на проверку jwt токенов и автоматическую отправку access токена чтобы защитить маршрут
        // Но пока просто сообщение

        const refreshToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_KEY as string,
            { expiresIn:'7200h' }
        )
        
        res.json({ message: 'Успешный логин',refreshToken})

    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Ошибка сервера'})
    }
}