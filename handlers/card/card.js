import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Router } from 'express';
import jwt from 'jsonwebtoken';
export const JWT_SECRET = process.env.JWT_SECRET;
import Card from '../schemas/Card.js';
import { adminGuard, authGuard, businessGuard, registerGuard, userGuard, userAdminGuard, cardOwnerOrAdminGuard, cardOwnerGuard } from '../../Guards/guards.js';
import { cardSchema, cardEditSchema } from "../validations/cardValidation.js";
const router = Router();

async function generateUniqueBizNumber() {
    let bizNumber;
    let exists = true;
    while (exists) {
        bizNumber = Math.floor(100000 + Math.random() * 900000);
        exists = await Card.findOne({ bizNumber });
    }
    return bizNumber;
}
router.put('/:id/biznumber', adminGuard, async (req, res, next) => {
    const { id } = req.params;
    const { newBizNumber } = req.body;
    try {
        const card = await Card.findById(id);
        if (!card) {
            const error = new Error("Card not found");
            error.status = 404;
            return next(error);
        }
        const existingCard = await Card.findOne({ bizNumber: newBizNumber });
        if (existingCard) {
            const error = new Error("Business number already in use");
            error.status = 409;
            return next(error);
        }
        const updatedCard = await Card.findByIdAndUpdate(id, { bizNumber: newBizNumber },
            { new: true });
        res.send({ message: "Business number updated", card: updatedCard });
    } catch (err) {
        const error = new Error("Invalid card ID");
        error.status = 400;
        return next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        const data = await Card.find();
        res.send(data);
    }
    catch (err) {
        const error = new Error("Failed to retrieve cards" + err.message);
        error.status = 500;
        return next(error);
    }
});
router.get('/my-cards', registerGuard, async (req, res, next) => {
    try {
        const userId = req.user._id;
        const userCards = await Card.find({ user_id: userId });
        res.send(userCards);
    } catch (err) {
        const error = new Error("Failed to retrieve cards" + err.message);
        error.status = 500;
        return next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const card = await Card.findById(id);
        if (!card) {
            const error = new Error("Card not found");
            error.status = 404;
            return next(error);
        }
        res.send(card);
    } catch (err) {
        const error = new Error("Invalid card ID" + err.message);
        error.status = 400;
        return next(error);
    }
});
router.post('/', businessGuard, async (req, res, next) => {
    try {
        const { error } = cardSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.status = 400;
            return next(err);
        }
        const bizNumber = await generateUniqueBizNumber();
        const card = new Card({
            ...req.body, // title, subtitle, address, etc.
            bizNumber,
            user_id: req.user._id,  // set by guard middleware
            likes: []
        });
        const newCard = await card.save();
        res.status(201).send(newCard);
    } catch (err) {
        const error = new Error("Card creation failed" + err.message);
        error.status = 400;
        return next(error);
    }
});
router.delete('/:id', cardOwnerOrAdminGuard, async (req, res, next) => {
    const { id } = req.params;
    try {
        const card = await Card.findByIdAndDelete(id);
        if (!card) {
            const error = new Error("Card not found");
            error.status = 404;
            return next(error);
        }
        if (card.user_id.toString() !== req.user._id && !req.user.isAdmin) {
            const error = new Error("Access denied. You can only delete your own card.");
            error.status = 403;
            return next(error);
        }
        // res.send({ message: "Card deleted successfully", user: req.user });
        res.send(card);
    } catch (err) {
        const error = new Error("Error deleting card" + err.message);
        error.status = 500;
        return next(error);
    }
});
router.put('/:id', cardOwnerGuard, async (req, res, next) => {
    try {
        const data = await Card.findById(req.params.id);
        if (!data) {
            const error = new Error("Card not found");
            error.status = 400;
            return next(error);
        }
        if (data.user_id.toString() !== req.user._id) {
            const error = new Error("Access denied. You can only edit your own card.");
            error.status = 403;
            return next(error);
        }
        const { error } = cardEditSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.status = 400;
            return next(err);
        }
        const { title, subtitle, description, phone, email, web, image: { url, alt }, address: { state, country, city, street, houseNumber } } = req.body;
        const updatedCard = await Card.findByIdAndUpdate(
            req.params.id,
            {
                title, subtitle,
                description, phone, email, web,
                address: { state, country, city, street, houseNumber, },
                image: { url, alt, },
            },
            { new: true }
        );
        res.send(updatedCard);
    }
    catch (err) {
        const error = new Error("Error updating card" + err.message);
        error.status = 500;
        return next(error);
    }
});
router.patch('/:id', authGuard, async (req, res, next) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            const error = new Error("card not found");
            error.status = 400;
            return next(error);
        }
        const userId = req.user._id;
        const index = card.likes.indexOf(userId);
        if (index === -1) {
            card.likes.push(userId);
        } else {
            card.likes.splice(index, 1);
        }
        await card.save();
        //res.send({ message: "Card like status updated", likes: card.likes });
        res.send(card);
    }
    catch (err) {
        const error = new Error("Error updating card like" + err.message);
        error.status = 400;
        return next(error);
    }
});
export default router;