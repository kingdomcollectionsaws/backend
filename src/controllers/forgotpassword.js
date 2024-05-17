const User = require("../models/user.model");
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const sendmail = async ({ link, email }) => {
  try {


    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      service: 'gmail',
      auth: {
        user: 'essential662233@gmail.com',
        pass: 'eizwyzaqfhuybnwr'
      }
    });

    var mailOptions = {
      from: 'essential662233@gmail.com',
      to: 'dynotawfeeq@gmail.com',
      subject: 'Forgot password',
      text: `Follow this link to reset yout kingdom collection password: ${link}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  } catch (error) {
    console.log(error);
  }
}
const sendpasswordchangelink = async (req, res) => {
  const { email } = req.body
  console.log(email);
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      res.send({ msg: 'User not found' })
    } else {
      const token = jwt.sign({ email: email }, process.env.SECERET_KEY, { expiresIn: '5m' })
      const link = `http://localhost:5173/reset-password/?id=${user._id}&token=${token}`
      sendmail({ link, email })
      res.send({ msg: 'Email send successfully' })
    }

  } catch (error) {
    res.status(500).send(error)
  }
}
const resetpassword = async (req, res) => {
  const { id, token } = req.params;
  let { password } = req.body
  try {

    const verify = jwt.verify(token, process.env.SECERET_KEY);
    if (verify) {

      password = await bcrypt.hash(password, 8);
      let user = await User.findById(id);
      console.log(user);
      res.send("user");

    } else {
      res.send("not verifys");
    }


  } catch (error) {
    res.status(500).send("not verify");
  }
}

module.exports = { sendpasswordchangelink, resetpassword }