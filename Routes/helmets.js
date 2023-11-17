/** @format */

const express = require('express');
const isAdmin = require('../Middlewares/isAdmin');
const helmets = express.Router();
const HelmetsModel = require('../Models/helmets');
const multer = require('multer');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APY_KEY,
  api_secret: process.env.CLOUDINARY_APY_SECRET,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'HelmetsImages',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.name,
  },
});

const cloudUpload = multer({ storage: cloudStorage });

helmets.post(
  '/helmets/cloudUpload',
  cloudUpload.fields([
    { name: 'img', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'image5', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const fileUrls = {
        img: req.files['img'][0].path,
        image2: req.files['image2'][0].path,
        image3: req.files['image3'][0].path,
        image4: req.files['image4'][0].path,
        image5: req.files['image5'][0].path,
      };
      res.status(200).json(fileUrls);
    } catch (error) {
      res.status(500).send({
        message: 'Errore nel server interno',
        error: error.message,
        statusCode: 500,
      });
    }
  }
);
helmets.get('/helmets', async (req, res) => {
  const { page = 1, pageSize = 8 } = req.query;
  try {
    const helmet = await HelmetsModel.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const totalHelmets = await HelmetsModel.count();

    res.status(200).send({
      statusCode: 200,
      currentPage: Number(page),
      totalHelmets,
      totalPages: Math.ceil(totalHelmets / pageSize),
      helmet,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore nel server interno',
      error: error.message,
      statusCode: 500,
    });
  }
});

helmets.get('/helmets/bytitle', async (req, res) => {
  const { title } = req.query;

  try {
    const helmet = await HelmetsModel.find({
      title: {
        $regex: title,
        $options: 'i',
      },
    });

    if (!helmet) {
      res.status(404).send({
        message: 'Titolo non trovato ',
        statusCode: 404,
      });
    }

    res.status(200).send({
      statusCode: 200,
      helmet,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore nel server interno',
      error: error.message,
      statusCode: 500,
    });
  }
});

helmets.get('/helmets/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const helmet = await HelmetsModel.findById(id);
    if (!helmet) {
      return res.status(404).send({
        statusCode: 404,
        message: `Helmet not found with this id ${id}`,
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: `Helmet found with this id ${id}`,
      helmet,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore nel server interno',
      error: error.message,
      statusCode: 500,
    });
  }
});

helmets.post('/helmets/create', async (req, res) => {
  const newHelmet = new HelmetsModel({
    img: req.body.img,
    image2: req.body.image2,
    image3: req.body.image3,
    image4: req.body.image4,
    image5: req.body.image5,
    description: req.body.description,
    price: Number(req.body.price),
    title: req.body.title,
    height: Number(req.body.height),
    weight: Number(req.body.weight),
    subtitle: req.body.subtitle,
  });

  try {
    const helmet = await newHelmet.save();
    res.status(201).send({
      message: 'Post inviato con successo',
      statusCode: 201,
      helmet,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore nel server interno',
      error: error.message,
      statusCode: 500,
    });
  }
});

helmets.patch('/helmets/update/:id', async (req, res) => {
  const { id } = req.params;

  const helmetExist = await HelmetsModel.findById(id);
  if (!helmetExist) {
    return res.status(404).send({
      message: `armor non trovato con questo id ${id}`,
      statusCode: 404,
    });
  }

  try {
    const updateArmor = req.body;
    const options = { new: true };
    const helmet = await HelmetsModel.findByIdAndUpdate(
      id,
      updateArmor,
      options
    );

    res.status(200).send({
      message: 'Update effettuato con successo',
      statusCode: 200,
      helmet,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore nel server interno',
      error: error.message,
      statusCode: 500,
    });
  }
});

helmets.delete('/helmets/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const helmet = await HelmetsModel.findByIdAndDelete(id);
    if (!helmet) {
      return res.status(404).send({
        statusCode: 404,
        message: 'Errore interno al server',
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: 'Delete effettuato con successo',
      helmet,
    });
  } catch (error) {}
});

module.exports = helmets;
