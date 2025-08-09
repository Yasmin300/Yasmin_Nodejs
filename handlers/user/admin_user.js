import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from "../validations/userValidation.js";
export const JWT_SECRET = process.env.JWT_SECRET;
import { adminGuard } from '../../Guards/guards.js';
import User from '../schemas/User.js';
const router = Router();

router.get('/', adminGuard, async (req, res) => {
    const data = await User.find();
    res.send(data);
});

export default router;