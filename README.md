# 📇 Yasmin Node.js Project

A **Node.js & Express** server connected to **MongoDB** for managing users and business cards.  
Includes authentication, role-based authorization, and full CRUD operations.

---

## 🚀 Features
- **User Authentication** with JWT  
- **Role-based Guards** (Admin, Business, Card Owner)  
- **MongoDB (Atlas or Local)** connection  
- **Secure Password Hashing** with bcrypt  
- **Input Validation** with Joi  
- **Environment-based Configuration**  
- **Error Handling Middleware**  

---

## 📂 Project Structure
```
Yasmin_Nodejs/
│
├── Guards/               # Authorization guards
├── handlers/             # API logic & routes
│   ├── card/              # Card routes
│   ├── user/              # User routes
│   └── schemas/           # Mongoose models
├── .env                   # Local environment variables
├── .env.cloud             # Cloud (Atlas) environment variables
├── package.json
├── server.js
└── README.md
```

---

## 🛠 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Yasmin300/Yasmin_Nodejs.git
cd Yasmin_Nodejs
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Environment Variables  
You will need **two `.env` files**:
- **.env** → for local development  
- **.env.cloud** → for MongoDB Atlas deployment  

Example:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/YasminDB
JWT_SECRET=your_jwt_secret
```
⚠️ **Do not commit `.env` files to GitHub** – they are ignored via `.gitignore`.

---

## ▶️ Running the Server

### Local (development)
```bash
npm run dev
```

### Cloud (Atlas)
Switch your `.env` to `.env.cloud` values:
```bash
npm start
```

---

## 🔑 Guards & Authorization
- **authGuard** → Any logged-in user  
- **adminGuard** → Admin only  
- **businessGuard** → Business users only  
- **userAdminGuard** → User themselves or admin  
- **cardOwnerOrAdminGuard** → Card owner or admin  
- **cardOwnerGuard** → Card owner only  

---

## 📌 Notes
- For the assignment submission, **include `.env.cloud`** (with dummy credentials if needed) in the submission folder but **not in GitHub**.  
- The API has been tested in both **local** and **Atlas** environments.  

---

## 🧑‍💻 Author
Yasmin  
[GitHub Profile](https://github.com/Yasmin300)

📝 License
This project is licensed for educational and demo purposes only.
