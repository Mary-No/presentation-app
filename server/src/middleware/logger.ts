import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

const logFilePath = path.join(__dirname, '../../server.log');

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const now = new Date().toISOString();
    const log = `[${now}] ${req.method} ${req.url} ${req.ip}\n`;

    fs.appendFile(logFilePath, log, (err) => {
        if (err) console.error('Failed to write log:', err);
    });

    next();
};