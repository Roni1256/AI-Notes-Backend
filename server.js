import express from 'express'
import dotenv from 'dotenv'
import { connectToDb } from './database/connectDatabase.js'
dotenv.config()
import cors from 'cors'
import authRoute from "./routes/user.route.js"
import cookieParser from 'cookie-parser'
import passport from "passport"
import session from 'express-session'
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { GithubOAuth, GoogleOAuth } from './middleware/OAuth.js'
import {Strategy as GitHubStrategy} from 'passport-github2'
import notesRoute from './routes/notes.route.js'
import aiRoute from './routes/ai.route.js'
import foldersRoute from './routes/folder.route.js'

const app = express()
app.use(cors({
  origin:"http://localhost:5173",
  allowedHeaders:['Content-Type','Authorization','Cookie'],
  methods:["GET","POST","PUT","DELETE","PATCH"],
  credentials: true
}))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(passport.initialize())
app.use(passport.session())

const PORT = process.env.PORT || 5000



/// Google Passport
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/auth/google/callback",
        },
        function(accessToken, refreshToken, profile, done) {
          GoogleOAuth(profile,done)
        }    
    )
);
passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})

/// Github Passport
passport.use(new GitHubStrategy({
  clientID:process.env.GITHUB_CLIENT_ID,
  clientSecret:process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/api/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  GithubOAuth(profile,done)
}
));


app.get('/', (req, res) => {
  return res.status(200).send('Server is running')
})
app.use('/api/auth',authRoute)
app.use('/api/notes',notesRoute)
app.use('/api/ai',aiRoute)
app.use('/api/folders',foldersRoute)
connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})
.catch((error) => {
  console.error('Failed to connect to database:', error)
})