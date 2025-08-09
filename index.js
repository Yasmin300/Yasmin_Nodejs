import './config.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './handlers/user/index.js';
import cardRoutes from './handlers/card/index.js';
import insertInitialData from './handlers/InitialData.js';
import logger from './filelogger.js';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    await insertInitialData();
} catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
}


const app = express();
app.use(express.json());
app.use(morgan(':date[iso] :method :url :status - :response-time ms'));
app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',

}));

app.get("/test-error", (req, res, next) => {
    res.status(400);
    next(new Error("Simulated error"));
});
//app.use(logger);
app.use("/users", userRoutes);
app.use('/cards', cardRoutes);

// ✅ Custom error logger
app.use((err, req, res, next) => {
    const status = err.status || 500;

    const now = new Date();
    const logDate = now.toISOString().split('T')[0];
    const time = now.toISOString();
    const logsDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logsDir, `${logDate}.log`);

    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    const logEntry = `[${time}] ${status} - ${err.message}\n`;
    fs.appendFile(logFile, logEntry, (error) => {
        if (error) {
            console.error("❌ Failed to write to log file:", error.message);
        } else {
            console.log("✅ Error written to log file.");
        }
    });

    next(err); // Pass to final error handler
});

// ✅ Final error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Unknown error" });
});
app.listen(3000, () => {
    console.log("listening on port 3000");
});
