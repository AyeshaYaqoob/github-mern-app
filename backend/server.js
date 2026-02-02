import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import path from "path";
import "./passport/github.auth.js";
import 'dotenv/config';
import userRoutes from "./routes/user.route.js";
import exploreRoutes from "./routes/explore.route.js";
import authRoutes from "./routes/auth.route.js";
import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;
const __dirname = path.resolve();

app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());


app.use(cors({
	origin: 'http://127.0.0.1:3000',
	credentials: true,
  }));


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/explore", exploreRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// app.listen(PORT, () => {
// 	console.log(`Server started on http://localhost:${PORT}`);
// 	connectMongoDB();
// });
app.listen(5005, "127.0.0.1", () => {
    console.log("Server is strictly running on http://127.0.0.1:5005");
	connectMongoDB();
});
// app.listen(PORT, "0.0.0.0", () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//     console.log(`Also accessible at http://127.0.0.1:${PORT}`);
// 	connectMongoDB();
// });
