/** @format */

const express = require('express');
const stands = express.Router();
const StandsModel = require('../Models/stands');
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
    folder: 'StandsImages',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.name,
  },
});

const cloudUpload = multer({ storage: cloudStorage });

stands.post(
  '/stands/cloudUpload',
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

stands.get('/stands', async (req, res) => {
  const { page = 1, pageSize = 8 } = req.query;
  try {
    const stand = await StandsModel.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const totalStands = await StandsModel.count();

    res.status(200).send({
      statusCode: 200,
      currentPage: Number(page),
      totalStands,
      totalPages: Math.ceil(totalStands / pageSize),
      stand,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore nel server interno',
      error: error.message,
      statusCode: 500,
    });
  }
});

stands.get('/stands/bytitle', async (req, res) => {
  const { title } = req.query;

  try {
    const standetto = await StandsModel.find({
      title: {
        $regex: title,
        $options: 'i',
      },
    });

    if (!standetto) {
      res.status(404).send({
        message: 'Titolo non trovato ',
        statusCode: 404,
      });
    }

    res.status(200).send({
      statusCode: 200,
      standetto,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore nel server interno',
      error: error.message,
      statusCode: 500,
    });
  }
});

stands.get('/stands/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const stand = await StandsModel.findById(id);
    if (!stand) {
      return res.status(404).send({
        statusCode: 404,
        message: `Stand not found with this id ${id}`,
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: `Stand found with this id ${id}`,
      stand,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore nel server interno',
      error: error.message,
      statusCode: 500,
    });
  }
});

stands.post('/stands/create', async (req, res) => {
  const newStand = new StandsModel({
    img: req.body.img,
    image2: req.body.image2,
    image3: req.body.image3,
    image4: req.body.image4,
    image5: req.body.image5,
    description: req.body.description,
    price: Number(req.body.price),
    title: req.body.title,
    material: req.body.material,
    subtitle: req.body.subtitle,
    type: req.body.type,
  });

  try {
    const stand = await newStand.save();
    res.status(201).send({
      message: 'Post inviato con successo',
      statusCode: 201,
      stand,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore nel server interno',
      error: error.message,
      statusCode: 500,
    });
  }
});

stands.patch('/stands/update/:id', async (req, res) => {
  const { id } = req.params;

  const standExist = await StandsModel.findById(id);
  if (!standExist) {
    return res.status(404).send({
      message: `armor non trovato con questo id ${id}`,
      statusCode: 404,
    });
  }

  try {
    const updateStand = req.body;
    const options = { new: true };
    const stand = await StandsModel.findByIdAndUpdate(id, updateStand, options);

    res.status(200).send({
      message: 'Update effettuato con successo',
      statusCode: 200,
      stand,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore nel server interno',
      error: error.message,
      statusCode: 500,
    });
  }
});

stands.delete('/stands/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const stand = await StandsModel.findByIdAndDelete(id);
    if (!stand) {
      return res.status(404).send({
        statusCode: 404,
        message: `Stand not found with this id ${id} or already deleted`,
      });
    }

    res.status(200).send(stand);
  } catch (errore) {
    res.status(500).send({
      message: 'Errore nel server interno',
      error: error.message,
      statusCode: 500,
    });
  }
});

module.exports = stands;
