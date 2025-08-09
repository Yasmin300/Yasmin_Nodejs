import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from "../validations/userValidation.js";
export const JWT_SECRET = (() => {
    if (!process.env.JWT_SECRET) {
        throw new Error("❌ Missing JWT_SECRET in environment");
    }
    return process.env.JWT_SECRET;
})();
import { authGuard } from '../../Guards/guards.js';
import User from '../schemas/User.js';
const router = Router();

router.post('/login', async (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        const err = new Error(error.details[0].message);
        err.status = 400;
        return next(err);
    }
    const { email, password } = req.body;

    const userFind = await User.findOne({ email });

    if (!userFind) {
        const error = new Error("email or password incorrect");
        error.status = 403;
        return next(error);
    }
    if (userFind.lockUntil && userFind.lockUntil > Date.now()) {
        const err = new Error("Account is locked. Try again later.After : " + userFind.lockUntil);
        err.status = 403;
        return next(err);
    }

    const passwordMatch = await bcrypt.compare(password, userFind.password);

    if (!passwordMatch) {
        userFind.loginAttempts += 1;
        if (userFind.loginAttempts >= 3) {
            userFind.lockUntil = Date.now() + 24 * 60 * 60 * 1000;
            userFind.loginAttempts = 0;
        }
        await userFind.save();
        const error = new Error("email or password incorrect");
        error.status = 403;
        return next(error);
    }
    userFind.loginAttempts = 0;
    userFind.lockUntil = null;
    await userFind.save();
    const obj = {
        _id: userFind._id,
        isBusiness: userFind.isBusiness,
        isAdmin: userFind.isAdmin,
        fullName: `${userFind.firstName} ${userFind.lastName}`,
    };
    const token = jwt.sign(obj, JWT_SECRET, { expiresIn: '15m' });
    res.send(token);
});

router.post('/', async (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        const err = new Error(error.details[0].message);
        err.status = 400;
        return next(err);
    }
    const {
        name: { first, middle, last },
        isBusiness,
        phone,
        email,
        password,
        address: { state, country, city, street, houseNumber },
        image: { url, alt }
    } = req.body;

    const userFind = await User.findOne({ email });

    if (userFind) {
        const error = new Error("email is used");
        error.status = 403;
        return next(error);
    }

    const user = new User({
        name: {
            first: first,
            middle: middle,
            last: last
        },
        email: email,
        phone: phone,
        password: await bcrypt.hash(password, 10),
        address: {
            state: state,
            country: country,
            city: city,
            street: street,
            houseNumber: houseNumber,
            zip: 0
        },
        image: {
            url: url,
            alt: alt
        },
        isAdmin: false,
        isBusiness: isBusiness,
    });
    const newUser = await user.save();
    res.send(newUser);
});

router.get('/token', authGuard, async (req, res) => {
    const data = jwt.decode(req.headers.authorization);
    const obj = {
        _id: data._id,
        isBusiness: data.isBusiness,
        isAdmin: data.isAdmin,
    };
    const token = jwt.sign(obj, JWT_SECRET, { expiresIn: '15m' });

    res.send(token);
});

export default router;