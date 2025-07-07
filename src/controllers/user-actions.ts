import { Request, Response, RequestHandler } from 'express';
import User from '../mongo/models/user';
import jwt from 'jsonwebtoken'

interface JwtPayload {
    userId: string
    role: 'admin' | 'user'
}

export const getUserById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId
        if (!userId) {
            res.json({ message: 'Неверный параметр' })
            return
        }
        
        const user = await User.findById(userId).select('-password')
        if (!user) {
            res.status(404).json({ message: 'Пользователь не найден' })
            return
        }

        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Не авторизован' })
            return
        }

        const token = authHeader.split(' ')[1]
        let decoded: JwtPayload

        try {
            decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload
        } catch (e) {
            res.status(401).json({ message: 'Неверный токен' })
            return
        }
        const decodedUserId = decoded.userId
        const decodedRole = decoded.role
        if (decodedUserId !== userId && decodedRole !== 'admin') {
            res.status(403).json({ message: 'Доступ запрещён' })
            return
        }

        const decodedUser=await User.findById(decodedUserId)
        const UserBanned=!decodedUser?.isActive
        if(UserBanned){
            res.status(403).json({ message: 'Доступ запрещён: Вы забанены' })
            return
        }

        res.json(user)
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Ошибка сервера' })
    }
}

export const getAllUsers:RequestHandler=async(req:Request,res:Response)=>{
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Не авторизован' })
            return
        }
        const token = authHeader.split(' ')[1]
        let decoded: JwtPayload

        try {
            decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload
        } catch (e) {
            res.status(401).json({ message: 'Неверный токен' })
            return
        }
        const decodedRole=decoded.role
        if(decodedRole!=='admin'){
            res.status(403).json({ message: 'Доступ запрещён' })
            return
        }
        const users=await User.find().select('-password')
        res.json(users)
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Ошибка сервера' })
    }
}


export const banUser:RequestHandler=async(req:Request,res:Response)=>{
    try {
        const userId = req.params.userId
        if (!userId) {
            res.json({ message: 'Неверный параметр' })
            return
        }

        const user = await User.findById(userId).select('-password')
        if (!user) {
            res.status(404).json({ message: 'Пользователь не найден' })
            return
        }

        if(user.role==='admin'){
            res.status(403).json({message:'Нельзя блокировать админов'})
            return
        }
        
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Не авторизован' })
            return
        }
        
        const token = authHeader.split(' ')[1]
        let decoded: JwtPayload
        
        try {
            decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload
        } catch (e) {
            res.status(401).json({ message: 'Неверный токен' })
            return
        }
        const decodedUserId = decoded.userId
        const decodedRole = decoded.role
        if (decodedUserId !== userId && decodedRole !== 'admin') {
            res.status(403).json({ message: 'Доступ запрещён' })
            return
        }

        await User.findByIdAndUpdate(userId,{isActive:false}) //Типо бан
        res.json({ message: 'Пользователь заблокирован'})
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Ошибка сервера' })
    }
}