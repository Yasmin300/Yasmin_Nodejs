import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { editSchema } from "../validations/userValidation.js";
export const JWT_SECRET = process.env.JWT_SECRET;
import { userGuard, userAdminGuard } from '../../Guards/guards.js';
import User from '../schemas/User.js';
const router = Router();

router.get('/:id', userAdminGuard, async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            return next(error);
            //return res.status(404).send({ message: "User not found" });
        }

        res.send(user);
    } catch (err) {
        const error = new Error("Invalid user ID");
        error.status = 400;
        return next(error);
        //  res.status(400).send({ message: "Invalid user ID" });
    }
});
router.delete('/:id', userAdminGuard, async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            return next(error);
            //return res.status(404).send({ message: "User not found" });
        }
        res.send({ message: "User deleted successfully", user });
    } catch (err) {
        const error = new Error("Error deleting user" + err.message);
        error.status = 500;
        return next(error);
        //  res.status(500).send({
        ///    message: "Error deleting user",
        //    error: err.message
        //  });
    }
});
router.put('/:id', userGuard, async (req, res, next) => {
    const data = await User.findById(req.params.id);
    if (!data) {
        const error = new Error("User not found");
        error.status = 400;
        return next(error);
        //return res.status(400).send({ message: "User not found" });
    }
    const { err } = editSchema.validate(req.body);
    if (err) {
        const error = new Error(err.details[0].message);
        error.status = 400;
        return next(error);
        //  return res.status(400).send({ message: error.details[0].message });
    }
    const {
        name: { first, middle, last },
        phone,
        address: { state, country, city, street, houseNumber },
        image: { url, alt }
    } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: {
                    first: first,
                    middle: middle,
                    last: last
                },
                phone: phone,
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
            },
            { new: true }
        );
        res.send(updatedUser);
    }
    catch {
        const error = new Error("Error updating user" + err.message);
        error.status = 400;
        return next(error);
        //  res.status(400).send({ message: "Error updating user", error: err.message });
    }
});
router.patch('/:id', userGuard, async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        const error = new Error("User not found");
        error.status = 400;
        return next(error);
        // return res.status(400).send({ message: "User not found" });
    }
    user.isBusiness = !user.isBusiness;
    try {
        await user.save();
        res.send(user);
    }
    catch {
        const error = new Error("Error updating user's business status" + err.message);
        error.status = 400;
        return next(error);
        //  res.status(400).send({ message: "Error updating user's business status", error: err.message });
    }
});
export default router;
