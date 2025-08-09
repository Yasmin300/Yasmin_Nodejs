// guards.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../handlers/user/auth.js';
import Card from '../handlers/schemas/Card.js'; // Make sure path is correct

// Utility: decode token and attach req.user
const verifyToken = (req, next) => {
    const token = req.headers.authorization;
    if (!token) {
        const error = new Error("No token provided");
        error.status = 401;
        return { error };
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        return { data };
    } catch (err) {
        const error = new Error("User is not authorized: " + err.message);
        error.status = 401;
        return { error };
    }
};

// General auth check
export const authGuard = (req, res, next) => {
    const { data, error } = verifyToken(req, next);
    if (error) return next(error);
    req.user = data;
    next();
};

// Admin-only access
export const adminGuard = (req, res, next) => {
    const { data, error } = verifyToken(req, next);
    if (error) return next(error);
    if (!data.isAdmin) {
        const err = new Error("Admin access only");
        err.status = 403;
        return next(err);
    }
    req.user = data;
    next();
};

// Business-only access
export const businessGuard = (req, res, next) => {
    const { data, error } = verifyToken(req, next);
    if (error) return next(error);
    if (!data.isBusiness) {
        const err = new Error("Business users only");
        err.status = 403;
        return next(err);
    }
    req.user = data;
    next();
};

// User can access only their own resource (or admin)
export const userAdminGuard = (req, res, next) => {
    const { data, error } = verifyToken(req, next);
    if (error) return next(error);
    if (!data.isAdmin && req.params.id !== data._id) {
        const err = new Error("Only the user themselves or admin can access this");
        err.status = 403;
        return next(err);
    }
    req.user = data;
    next();
};

// Only exact user (no admin override)
export const userGuard = (req, res, next) => {
    const { data, error } = verifyToken(req, next);
    if (error) return next(error);
    if (req.params.id !== data._id) {
        const err = new Error("Only the user themselves can access this");
        err.status = 403;
        return next(err);
    }
    req.user = data;
    next();
};

// Registered user (simple auth check)
export const registerGuard = authGuard;

// Card owner or admin
export const cardOwnerOrAdminGuard = async (req, res, next) => {
    const { data, error } = verifyToken(req, next);
    if (error) return next(error);

    const card = await Card.findById(req.params.id);
    if (!card) {
        const err = new Error("Card not found");
        err.status = 404;
        return next(err);
    }

    if (!data.isAdmin && card.user_id.toString() !== data._id) {
        const err = new Error("Access denied. You can only modify your own card.");
        err.status = 403;
        return next(err);
    }

    req.user = data;
    req.card = card;
    next();
};

// Card owner only (no admin override)
export const cardOwnerGuard = async (req, res, next) => {
    const { data, error } = verifyToken(req, next);
    if (error) return next(error);

    const card = await Card.findById(req.params.id);
    if (!card) {
        const err = new Error("Card not found");
        err.status = 404;
        return next(err);
    }

    if (card.user_id.toString() !== data._id) {
        const err = new Error("Only the card owner can access this");
        err.status = 403;
        return next(err);
    }

    req.user = data;
    req.card = card;
    next();
};
