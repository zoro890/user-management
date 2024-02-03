import express from 'express';
import cors from "cors";
import 'dotenv/config.js';
import connectDB from './utils/db.js';
import userRouter from './route/user.route.js';

export const app = express();
app.use(express.json({limit: "50mb"}));
app.use(cors({origin: "*"}));

app.use("/api", userRouter);

app.get("/test", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "API is working",
    });
});

app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is connected with port ${process.env.PORT}`);
    connectDB();
})
