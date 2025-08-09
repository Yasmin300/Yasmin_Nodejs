// filelogger.js
import fs from 'fs';
import path from 'path';

const errorLogger = (err, req, res, next) => {
    const status = res.statusCode >= 400 ? res.statusCode : 500;
    console.error("❌ Failed to write to lccog file:", err.message);
    if (status >= 400) {
        const now = new Date();
        const logDate = now.toISOString().split('T')[0]; // e.g., 2025-07-31
        const time = now.toISOString();
        const logsDir = path.join(process.cwd(), 'logs');
        const logFile = path.join(logsDir, `${logDate}.log`);
        console.error("❌ Failed to write to lccog file:", err.message);
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        const logEntry = `[${time}] ${status} - ${err.message || "Unknown Error"}\n`;
        fs.appendFile(logFile, logEntry, (error) => {
            if (error) {
                console.error("❌ Failed to write to log file:", error.message);
            }
        });
    }

    next(err); // pass to default error handler
};

export default errorLogger;
