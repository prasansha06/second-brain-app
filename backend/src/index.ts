import express from "express";
import { random } from "./utils";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import { JWT_PASSWORD, PORT } from "./config";
import { userMiddleware } from "./middleware";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.status(400).json({ message: "Username and password are required" });
        return;
    }

    try {
        await UserModel.create({
            username: username,
            password: password
        });

        res.json({
            message: "User signed up successfully"
        });
    } catch (e) {
        res.status(411).json({
            message: "User already exists"
        });
    }
});

app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const existingUser = await UserModel.findOne({
            username,
            password
        });

        if (existingUser) {
            const token = jwt.sign({
                id: existingUser._id
            }, JWT_PASSWORD);

            res.json({
                token,
                username: existingUser.username
            });
        } else {
            res.status(403).json({
                message: "Incorrect credentials"
            });
        }
    } catch (e) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    const title = req.body.title;
    const tags = req.body.tags || [];

    if (!link || !type || !title) {
        res.status(400).json({ message: "Title, link and type are required" });
        return;
    }

    try {
        const content = await ContentModel.create({
            link,
            type,
            title,
            tags,
            userId: req.userId
        });

        res.json({
            message: "Content added successfully",
            contentId: content._id
        });
    } catch (e) {
        res.status(500).json({ message: "Failed to create content" });
    }
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    try {
        const content = await ContentModel.find({
            userId: req.userId
        }).populate("userId", "username");

        res.json({
            content
        });
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch content" });
    }
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;

    try {
        await ContentModel.deleteOne({
            _id: contentId,
            userId: req.userId
        });

        res.json({
            message: "Content deleted successfully"
        });
    } catch (e) {
        res.status(500).json({ message: "Failed to delete content" });
    }
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const share = req.body.share;
    try {
        if (share) {
            const existingLink = await LinkModel.findOne({
                userId: req.userId
            });

            if (existingLink) {
                res.json({
                    hash: existingLink.hash
                });
                return;
            }

            const hash = random(10);
            await LinkModel.create({
                userId: req.userId,
                hash: hash
            });

            res.json({
                hash
            });
        } else {
            await LinkModel.deleteOne({
                userId: req.userId
            });

            res.json({
                message: "Removed share link"
            });
        }
    } catch (e) {
        res.status(500).json({ message: "Error processing share link" });
    }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    try {
        const link = await LinkModel.findOne({ hash });

        if (!link) {
            res.status(404).json({
                message: "Brain share link not found or expired"
            });
            return;
        }

        const content = await ContentModel.find({
            userId: link.userId
        });

        const user = await UserModel.findOne({
            _id: link.userId
        });

        if (!user) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }

        res.json({
            username: user.username,
            content: content
        });
    } catch (e) {
        res.status(500).json({ message: "Error retrieving shared brain" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Brainly backend server running on http://localhost:${PORT}`);
});
