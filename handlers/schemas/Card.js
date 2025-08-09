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

const CardSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    description: String,
    phone: String,
    email: {
        type: String,
        required: true
    },
    web: String,
    address: AddressSchema,
    image: ImageSchema,
    bizNumber: {
        type: Number,
        unique: true,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        default: []
    }],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("cards", CardSchema);
