import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import Path from "path";
import { fileURLToPath } from 'url';
import path from "path";
import { register } from "./Controls/auth.js";
import authRoutes from "./Routes/auth.js";
import userRoutes from "./Routes/userRoutes.js";
import postRoutes from "./Routes/postRoutes.js";
import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./Controls/posts.js";
import Post from "./models/Posts.js";
import User from "./models/User.js";
import { users,posts } from "./data/index.js";
import { log } from "console";



// configurations

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assests", express.static(path.join(__dirname, 'public/assests')));



// filestorage

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assests");

    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
        console.log(req.file);
    },
});


const upload = multer({ storage });

// ROUTES


app.post("/auth/register", upload.single("picture"), register);
app.post("/post",verifyToken,upload.single("picture"),createPost)

app.use("/auth",authRoutes)  //login route

app.use("/user",userRoutes) //user details routes

app.use("/posts",postRoutes)




const port = 3001 || 6000;
mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(port, () => {
        console.log(`server started at ${port}`)
    })
    // User.insertMany(users)
    // Post.insertMany(posts)
}).catch(err => [
    console.log(err.message)
])


app.get("/", (req, res) => {
    res.send("helo")
})


