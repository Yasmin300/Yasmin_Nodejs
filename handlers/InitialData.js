import bcrypt from "bcrypt";
import UserModel from './schemas/User.js'
import CardModel from './schemas/Card.js'
async function insertInitialData() {
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
        console.log("⚠️ No users found. Inserting initial users...");
        const users = [
            {
                name: { first: "Admin", middle: "", last: "User" },
                phone: "0501234567",
                email: "admin@example.com",
                password: await bcrypt.hash("Admin1234!", 10),
                address: {
                    state: "",
                    country: "Israel",
                    city: "Tel Aviv",
                    street: "Herzl",
                    houseNumber: 10
                },
                image: {
                    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUsbmTZu_uMrmJ0z--CrG-o1UIXytu1OCizQ&s",
                    alt: "Admin image"
                },
                isBusiness: false,
                isAdmin: true
            },
            {
                name: { first: "Business", middle: "", last: "Owner" },
                phone: "0507654321",
                email: "business@example.com",
                password: await bcrypt.hash("Business1234!", 10),
                address: {
                    state: "",
                    country: "Israel",
                    city: "Haifa",
                    street: "Hagana",
                    houseNumber: 5
                },
                image: {
                    url: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                    alt: "Business image"
                },
                isBusiness: true,
                isAdmin: false
            },
            {
                name: { first: "Regular", middle: "", last: "User" },
                phone: "0501111111",
                email: "user@example.com",
                password: await bcrypt.hash("User1234!", 10),
                address: {
                    state: "",
                    country: "Israel",
                    city: "Jerusalem",
                    street: "King George",
                    houseNumber: 3
                },
                image: {
                    url: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    alt: "User image"
                },
                isBusiness: false,
                isAdmin: false
            }
        ];

        const insertedUsers = await UserModel.insertMany(users);
        console.log("✅ Initial users inserted.");
        const businessUser = insertedUsers.find(u => u.isBusiness);
        if (businessUser) {
            const cardCount = await CardModel.countDocuments();
            if (cardCount === 0) {
                console.log("⚠️ No cards found. Inserting initial cards...");
                const cards = [
                    {
                        title: "Coffee Shop",
                        subtitle: "Fresh Coffee Everyday",
                        description: "Cozy place for coffee lovers.",
                        phone: "0501234567",
                        email: "coffeebiz@example.com",
                        web: "https://coffeeshop.example.com",
                        image: {
                            url: "https://example.com/images/coffee.jpg",
                            alt: "Coffee Shop"
                        },
                        address: {
                            state: "",
                            country: "Israel",
                            city: "Tel Aviv",
                            street: "Dizengoff",
                            houseNumber: 20,
                            zip: 0
                        },
                        bizNumber: Math.floor(100000 + Math.random() * 900000),
                        user_id: businessUser._id,
                        likes: []
                    },
                    {
                        title: "Tech Gadgets",
                        subtitle: "Smartphones & Accessories",
                        description: "All your gadget needs.",
                        phone: "0507654321",
                        email: "tech@example.com",
                        web: "https://techgadgets.example.com",
                        image: {
                            url: "https://example.com/images/tech.jpg",
                            alt: "Tech Store"
                        },
                        address: {
                            state: "",
                            country: "Israel",
                            city: "Haifa",
                            street: "Technion",
                            houseNumber: 7,
                            zip: 0
                        },
                        bizNumber: Math.floor(100000 + Math.random() * 900000),
                        user_id: businessUser._id,
                        likes: []
                    },
                    {
                        title: "Book Heaven",
                        subtitle: "Books for Everyone",
                        description: "Your one-stop bookstore.",
                        phone: "0509876543",
                        email: "books@example.com",
                        web: "https://bookheaven.example.com",
                        image: {
                            url: "https://example.com/images/bookstore.jpg",
                            alt: "Bookstore"
                        },
                        address: {
                            state: "",
                            country: "Israel",
                            city: "Jerusalem",
                            street: "Ben Yehuda",
                            houseNumber: 15,
                            zip: 0
                        },
                        bizNumber: Math.floor(100000 + Math.random() * 900000),
                        user_id: businessUser._id,
                        likes: []
                    }
                ];
                await CardModel.insertMany(cards);
                console.log("✅ Initial cards inserted.");
            } else {
                console.log(`ℹ️ Cards already exist (${cardCount} total). No initial cards inserted.`);
            }
        }
    } else {
        console.log(`ℹ️ Users already exist (${userCount} total). No initial users inserted.`);
    }
}
export default insertInitialData;