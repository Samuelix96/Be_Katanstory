/** @format */

const express = require('express');
const registration = express.Router();
const bcrypt = require('bcrypt');
const UsersModel = require('../Models/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const multer = require('multer');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APY_KEY,
  api_secret: process.env.CLOUDINARY_APY_SECRET,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'UsersImages',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.name,
  },
});

const cloudUpload = multer({ storage: cloudStorage });

registration.post(
  '/registration/cloudUpload',
  cloudUpload.single('avatar'),
  async (req, res) => {
    try {
      res.status(200).json({ avatar: req.file.path });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: 'Error internal server',
      });
    }
  }
);

registration.post('/registration', async (req, res) => {
  const existingUser = await UsersModel.findOne({ email: req.body.email });

  if (existingUser) {
    res.status(500).send({
      message: 'Error internal server',

      statusCode: 500,
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new UsersModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nickName: req.body.nickName,
      email: req.body.email,
      password: hashPassword,
      birth: req.body.birth,
      avatar: req.body.avatar,
      role: req.body.role,
    });

    const addUser = await newUser.save();

    const token = jwt.sign(
      {
        id: addUser._id,
        firstName: addUser.firstName,
        lastName: addUser.lastName,
        email: addUser.email,
        role: addUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '12h',
      }
    );

    res.header('Authorization', token).status(201).send({
      message: 'Utente registrato con successo',
      statusCode: 201,
      token,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore nel server interno',
      error: error.message,
      statusCode: 500,
    });
  }
});

module.exports = registration;
