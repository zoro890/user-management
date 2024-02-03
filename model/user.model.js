import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter your name"],
    },
    email:{
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
    },
    password: {
        type: String,
        minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
        type: Number,
        default: 0,
    },
}, {timestamps: true});

// Hash Password before saving

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// sign access token
userSchema.methods.SignAccessToken = function () {
    return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN, {
        expiresIn: '30d',
    });
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
