import express from 'express'
import { changePassword, deleteUser, getCurrentUser, login, logout, resendCode, signup, verifyCode } from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';
import passport from 'passport';
const route=express.Router();


route.post('/signup',signup);
route.post('/verification',verifyCode)
route.post('/resend-code',resendCode)
route.delete('/delete-user',deleteUser)
route.post('/login',login);
route.get('/logout',logout)
route.get('/current-user',protectRoute,getCurrentUser)
route.post('/update-password/:userId',changePassword)
// google authentication

route.get('/google',passport.authenticate('google', { scope: ['email', 'profile'] }))
//google callback
route.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login',
  }),
  (req, res) => {
    res.cookie('token', req.user.token,{
      httpOnly:true,
      secure:true,
      sameSite:'none',
      maxAge:1000*60*60*24*7,
      path:'/'
    })
    res.redirect(`http://localhost:5173/`)
  }
)

// github authentication
route.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));
//github callback
route.get('/github/callback', 
  passport.authenticate('github', {
    failureRedirect: 'http://localhost:5173/login',
  }),
  (req, res) => {
    res.cookie('token', req.user.token,{
      httpOnly:true,
      secure:true,
      sameSite:'none',
      maxAge:1000*60*60*24*7,
      path:'/'
    })
    res.redirect(`http://localhost:5173/`)
  }
);


export default route