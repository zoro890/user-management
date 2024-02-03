import UserModel from "../model/user.model.js";

// register a new user
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const isEmailExists = await UserModel.findOne({email});
        if(isEmailExists) {
            return res.status(400).json({
                success: false,
                error: "Email already exists. Please use a different email.",
            });
        }
        const newUser = await UserModel.create({name, email, password});

        res.status(201).json({
            success: true,
            newUser
        })
    } catch (error) {
        return next(res.status(500).send(error.message));
    }
};

// login user
export const loginUser = async (req, res, next) => {
    try {
        const {email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Please enter email and password!",
            });
        };
        const user = await UserModel.findOne({email});
        if(!user) {
            return res.status(400).json({
                success: false,
                error: "Invalid email!",
            });
        };
        const isPasswordMatch = await user.comparePassword(password);
        if(!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                error: "Invalid password!",
            });
        };

        const accessToken = user.SignAccessToken();
        res.status(200).json({
            success: true,
            user,
            accessToken,
        })
    } catch (error) {
        return next(res.status(500).send(error.message));
    }
};

// get all users for admin
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find().sort({createdAt: -1});
        res.status(201).json({
            success: true,
            users,
        });
    } catch {
        return next(res.status(500).send(error.message));
    }
};

// get user info
export const getUserInfo = async (req, res, next) => {
    try {
        const id = req.user?._id;
        const user = await UserModel.findById(id);
        res.status(201).json({
            success: true,
            user,
        })
    } catch {
        return next(res.status(500).send(error.message));
    }
};

// Update user info
export const updateUserInfo = async (req, res, next) => {
    try {
        const id = req.user._id;
        const { name, email } = req.body;
        const user = await UserModel.findByIdAndUpdate(id, {name, email}, {new: true});
        if(!user) {
            return res.status(404).json({
                success: false,
                error: "User not found!",
            });
        }
        await user.save();
        
        res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        return next(res.status(500).send(error.message));
    }
};

// Update user password
export const updateUserPassword = async (req, res, next) => {
    try {
        const id = req.user._id;
        const {oldPassword, newPassword} = req.body;
        if(!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: "Please enter old and new password!",
            });
        }
        const user = await UserModel.findById(id);
        const isPasswordMatch = await user?.comparePassword(oldPassword);
        if(!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                error: "Invalid old password!",
            });
        }
        user.password = newPassword;
    
        await user.save();
    
        res.status(201).json({
            success: true,
            user,
        })
    } catch (error) {
        return next(res.status(500).send(error.message));
    }
};

// Update user role for admin
export const updateUserRole = async (req, res, next) => {
    try {
        const {id, role} = req.body;
        const user = await UserModel.findByIdAndUpdate(id, {role}, {new: true});
        if(!user) {
            return res.status(404).json({
                success: false,
                error: "User not found!",
            });
        }
        res.status(201).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(res.status(500).send(error.message));
    }
};

// Delete user for admin
export const deleteOneUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await UserModel.findByIdAndDelete(id);
        if(!user) {
            return res.status(404).json({
                success: false,
                error: "User not found!",
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });  
    } catch (error) {
        return next(res.status(500).send(error.message));
    }
};
