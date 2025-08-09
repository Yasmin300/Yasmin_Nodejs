import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    state: String,
    country: String,
    city: String,
    street: String,
    houseNumber: Number,
    zip: {
        type: Number,
        default: 0
    }
}, { _id: true });

const ImageSchema = new mongoose.Schema({
    url: String,
    alt: String
}, { _id: true });

const NameSchema = new mongoose.Schema({
    first: String,
    middle: String,
    last: String
}, { _id: true });

const UserSchema = new mongoose.Schema({
    name: NameSchema,
    phone: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    address: AddressSchema,
    image: ImageSchema,
    isBusiness: Boolean,
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    }
});

export default mongoose.model("users", UserSchema);
