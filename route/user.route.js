import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middleware/auth.js';
import { deleteOneUser, getAllUsers, getUserInfo, loginUser, registerUser, updateUserInfo, updateUserPassword, updateUserRole } from '../controller/user.controller.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);

userRouter.post('/login', loginUser);

userRouter.get('/me', isAuthenticated, getUserInfo);

userRouter.patch('/update-user-info', isAuthenticated, updateUserInfo);

userRouter.patch('/update-user-password', isAuthenticated, updateUserPassword);

userRouter.get('/get-all-users', isAuthenticated, authorizeRoles([1]), getAllUsers);

userRouter.patch('/update-user-role', isAuthenticated, authorizeRoles([1]), updateUserRole);

userRouter.delete('/delete-one-user/:id', isAuthenticated, authorizeRoles([1]), deleteOneUser);

export default userRouter;