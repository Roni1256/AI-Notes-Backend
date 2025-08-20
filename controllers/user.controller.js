import User, { VerificationCode } from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'uuid'
import {generateVerification,transportMail} from '../mailer/nodemailer.js'

export const signup = async (req, res) => {
  const { username, email, password } = req.body
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }
    
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const newUser = new User({ 
      name: username,
      username, 
      email, 
      password: hashedPassword,
      verified:false 
    })

    await newUser.save()
    await sendVerificationCode({_id: newUser._id,email}, res)
    setTimeout(async()=>{
      const user=await User.findById(newUser._id);
      if(user && !user.verified){
        await User.findByIdAndDelete(newUser._id)
      }
    },5*60*1000);

  } catch (error) {
    
    console.log("Error Passage");
    res.status(500).json({ message: error.message })

  }
}

const sendVerificationCode=async({_id,email},res)=>{
  try{
    const code=generateVerification();
    const saltRounds=10;
    const hashedCode=await bcrypt.hash(code,saltRounds)
    const newCode=new VerificationCode({
      userId:_id,
      code:hashedCode,
      createdAt:Date.now(),
      expiresAt:Date.now()+(1000*60*5)
    })
    await newCode.save()
    await transportMail(email,code)
    res.json({
      status:"PENDING",
      message:"Verification code sent",
      data:{
        userId:_id,
        email,
      }
    });

  }catch(err){
    res.json({
      status:"FAILED",
      message:err.message
    })
  }
}

export const verifyCode=async(req,res)=>{
  try {
    const {userId,code}=req.body 
    if(!userId || !code) {
      throw Error("Empty otp details!")
    } else {
      const UserVerificationCodes=await VerificationCode.find({userId})
      if(UserVerificationCodes.length<=0)
        throw new Error("Account records not exist!")
      else{
        const {expiresAt}=UserVerificationCodes[0]
        const hashedCode=UserVerificationCodes[0].code

        if(expiresAt<Date.now()){
          await VerificationCode.deleteMany({userId})
          throw new Error("Code expired!")
        }else{
          const validCode= bcrypt.compare(code,hashedCode)
          if(!validCode)
            throw new Error("Invalid Code!")
          else{
            await User.updateOne({_id:userId},{verified:true})
            await VerificationCode.deleteMany({userId})
            const user=await User.findOne({_id:userId})
            console.log(user);
            
            const token = jwt.sign(
              { id: user._id, email:user.email },
              process.env.JWT_SECRET,
              { expiresIn: "30d" }
            )
  
            res.cookie('token', token, {
              httpOnly: true,
              secure: true,
              sameSite: 'None',
              maxAge: 7 * 24 * 60 * 60 * 1000,
              path: "/",
              partitioned: true 
            })
            res.json({
              status:"VERIFIED",
              message:"Email Verified!"
            })
          }
        }
      }
    }

  } catch (error) {
    res.json({
      status:"FAILED",
      message:error.message
    })
  }
}

export const resendCode=async(req,res)=>{
  try {
    const {userId,email}=req.body 

    if(!userId || !email)
      throw Error("Empty user details!")
    else{
      await VerificationCode.deleteMany({userId});
      sendVerificationCode({_id:userId,email:email},res)
    }
  } catch (error) {
    res.json({
      status:"FAILED",
      message:error.message
    })
  }
}


export const login=async(req,res)=>{
  try {
    
    const {email,password}=req.body;
    
    if(!email || !password || email.trim()==="" || password.trim()==="" || email===undefined || password===undefined)
      return res.status(404).json({message:"Fill all credentials!"})

    const existingUser = await User.findOne({email: email})
    console.log(existingUser);    
    if(!existingUser)
      return res.status(404).json({
        message:"User not exists!"
      })
      
      if(!existingUser.isGoogleAccount){
        const isPasswordCorrect=bcrypt.compare(password, existingUser.password)
        if(!isPasswordCorrect)
          return res.status(400).json({message:"Incorrect Password"});
      }

     

    const token = jwt.sign(
            { id: existingUser._id, email: existingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
          )
      
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
      partitioned: true 
    })
    
   return res.status(200).json({
        userId:existingUser._id,
        email:existingUser.email,
        username:existingUser.name,
        token:token
      
    })
  } catch (error) {
    console.log(error);
    
    res.status(500).json({message:error.message})
  }
}
  export const logout = (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.clearCookie('token');
      // Optional: Redirect to Google's logout if needed
      const logoutFromGoogle = false; // set to true if you want full Google logout

      if (logoutFromGoogle) {
        return res.redirect('https://accounts.google.com/Logout');
      } else {
        return res.status(200).json({message:"Loggout Successfull"}); // or home page
      }
    });
  });
};


export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const isUser = await User.findById(userId);
    if (!isUser) {
      return res.status(404).json({ message: "No user exists" });
    }
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}
export const getCurrentUser = async (req, res) => {
  try {
    if(!req.user?._id){
      throw new Error("User not authenticated");
    }
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error || "Internal server error" });
  }
};  

export const changePassword=async(req,res)=>{
  console.log("heloo");
  
  try {
    const {currentPassword,newPassword}=req.body;
    const {userId}=req.params;
    console.log("entered");
    
    const existingUser=await User.findById(userId);
    if(!existingUser)
      return res.status(404).json({message:"User not exists!"})
    if(!existingUser.verified)
      return res.status(400).json({message:"User not verified!"})
  
    
    const isPasswordCorrect=await bcrypt.compare(currentPassword, existingUser.password)
    
    if(!isPasswordCorrect)
      return res.status(400).json({message:"Incorrect Password"});
    const hashedPassword=await bcrypt.hash(newPassword,12)
    await User.findByIdAndUpdate(userId,{password:hashedPassword})
    return res.status(200).json({message:"Password changed successfully!"})
  } catch (error) {
    return res.status(500).json({error:error.message})
  }
}