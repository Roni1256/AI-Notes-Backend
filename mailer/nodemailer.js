import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ronideni1220@gmail.com",
    pass: "xken akat ngnw brxe",
  },
});

export const transportMail = async (usermail, code) => {
  const mailOptions = {
    from: "ronideni1220@gmail.com",
    to: usermail,
    subject: "AI-Notes Verification",
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #000; border-radius: 5px;">
                <h2 style="color: #000; text-align: center;">AI-Notes Email Verification</h2>
                <p style="color: #000; font-size: 16px; line-height: 1.5;">Your verification code is:</p>
                <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0; border-radius: 4px;">
                    <h1 style="color: #000; margin: 0; font-size: 32px;">${code}</h1>
                </div>
                <p style="color: #000; font-size: 14px;">Please use this code to verify your AI-Notes account.</p>
            </div>
            `,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log(info.response);
  });
};
export const generateVerification = () => {
  const date = new Date();
  const code =
    Math.random().toString(36).substring(2, 3).toUpperCase() +
    date.getTime().toString().substring(1, 3) +
    Math.random().toString(36).substring(2, 3).toUpperCase();

  return code;
};
