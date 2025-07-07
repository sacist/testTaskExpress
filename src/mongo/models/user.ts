import mongoose, { Schema, Document } from "mongoose";

type Role = 'admin' | 'user'

export interface IUser extends Document {
    fullName: string
    birthDate: Date
    email: string
    password: string
    role: Role
    isActive: boolean
}

const userSchema: Schema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    isActive: { 
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    birthDate: {
        type: Date
    }
},
{timestamps:true}
)

export default mongoose.model<IUser>('User', userSchema)