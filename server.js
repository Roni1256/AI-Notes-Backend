import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { GithubOAuth, GoogleOAuth } from "./middleware/OAuth.js";
import { connectToDb } from "./database/connectDatabase.js";
import authRoute from "./routes/user.route.js";
import notesRoute from "./routes/notes.route.js";
import aiRoute from "./routes/ai.route.js";
import foldersRoute from "./routes/folder.route.js";
import flowchartRoute from "./routes/flowchart.route.js";

dotenv.config();

const app = express();
const PORT = 5000 || process.env.PORT;
const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-notes-omega-khaki.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


/// Google Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${PORT}/api/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, done) {
      GoogleOAuth(profile, done);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

/// Github Passport
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${PORT}/api/auth/github/callback`,
    },
    function (accessToken, refreshToken, profile, done) {
      GithubOAuth(profile, done);
    }
  )
);

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Welcome to the AI Notes API",
  });
});
app.use("/api/auth", authRoute);
app.use("/api/notes", notesRoute);
app.use("/api/ai", aiRoute);
app.use("/api/folders", foldersRoute);
app.use("/api/flowchart", flowchartRoute);

connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
  });
