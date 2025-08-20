import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

export const GoogleOAuth = async (profile, done) => {
  try {
    const existingUser = await User.findOne({ email: profile.emails[0].value });

    if (existingUser) {
      const token = generateToken(existingUser);
      existingUser.token = token;
      return done(null, existingUser);
    }

    const newUser = new User({
      name: profile.name.givenName.toLowerCase(),
      email: profile.emails[0].value,
      googleId: profile.id,
      isGoogleAccount: true,
    });

    await newUser.save();
    const token = generateToken(newUser);
    newUser.token = token;
    done(null, newUser);
  } catch (error) {
    done(error, null);
  }
};

export const GithubOAuth = async (profile, done) => {
  try {
    const existingUser = await User.findOne({ email: profile.email });

    if (existingUser) {
      const token = generateToken(existingUser);
      existingUser.token = token;
      return done(null, existingUser);
    }

    const newUser = new User({
      name: profile.username.toLowerCase(),
      email: profile.email,
      githubId: profile.id,
      isGithubAccount: true,
    });

    await newUser.save();
    const token = generateToken(newUser);
    newUser.token = token;
    done(null, newUser);
  } catch (error) {
    done(error, null);
  }
};