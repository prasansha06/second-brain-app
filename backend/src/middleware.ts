import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];

    if (!header) {
        res.status(401).json({
            message: "Authentication token required"
        });
        return;
    }

    // Support both "Bearer <token>" and raw "<token>"
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : header.trim();

    try {
        const decoded = jwt.verify(token, JWT_PASSWORD);

        if (decoded && typeof decoded !== "string") {
            req.userId = (decoded as JwtPayload).id;
            next();
        } else {
            res.status(403).json({
                message: "You are not logged in"
            });
        }
    } catch (err) {
        res.status(403).json({
            message: "Invalid or expired token"
        });
    }
};
