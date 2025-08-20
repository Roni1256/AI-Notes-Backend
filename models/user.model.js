import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String
    },
    githubId: {
        type: String
    },
    isGoogleAccount: {
        type: Boolean,
        default: false
    },
    isGithubAccount: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const VerificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
})

const User = mongoose.model('User', userSchema)
export const VerificationCode = mongoose.model('VerificationCode', VerificationSchema)

export default User