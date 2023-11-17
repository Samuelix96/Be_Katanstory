
const express = require("express");
const login = express.Router();
const bcrypt = require('bcrypt');
const UsersModel = require("../Models/users")
const jwt = require('jsonwebtoken');
const isAdmin = require("../Middlewares/isAdmin");


require("dotenv").config();

login.post('/login',  async (req, res) => {
  const user = await UsersModel.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).send({
      message: 'Nome utente errato o inesistente',
      statusCode: 404,
    });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    return res.status(400).send({
      statusCode: 400,
      message: 'Email o password errati.',
    });
  }

  // generazione token
  const token = jwt.sign(
    {
        id: user._id,
      firstName: user.firstName,
      nickName: user.nickName,
      lastName: user.lastName,
      email: user.email,
      avatar:user.avatar,
      birth: user.birth,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '24h',
    }
  );

  res.header('Authorization', token).status(200).send({
    message: 'Login effettuato con successo',
    statusCode: 200,
    token,
  });

});


module.exports = login;