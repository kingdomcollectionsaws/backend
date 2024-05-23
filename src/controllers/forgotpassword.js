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
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD
      }
    });

    var mailOptions = {
      from: process.env.MAIL,
      to: email,
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
      const link = `kingdomcollection.uk/reset-password/?id=${user._id}&token=${token}`
      sendmail({ link, email })
      res.send({ msg: 'Email sent successfully' })
    }

  } catch (error) {
    res.status(500).send(error)
  }
}
const resetpassword = async (req, res) => {
  let { password, id, token } = req.body
  try {

    const verify = jwt.verify(token, process.env.SECERET_KEY);
    console.log(id, token);
    if (verify) {

      password = await bcrypt.hash(password, 8);
      let user = await User.findById(id);
      user.password =  password;
      user.save()
      res.status(200).send("password updated");

    } else {
      res.status(500).send("not verifys");
    }


  } catch (error) {
    res.status(500).send("not verify");
  }
}

module.exports = { sendpasswordchangelink, resetpassword }