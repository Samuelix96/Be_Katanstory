/** @format */

const express = require('express');
const isAdmin = require('../Middlewares/isAdmin');
const posts = express.Router();
const PostsModel = require('../Models/posts');
require('dotenv').config();
const cron = require('node-cron');
const axios = require('axios');

cron.schedule('*/30 * * * *', async () => {
  try {
    const response = await axios.get(`${process.env.CLIENT_URL}/posts`);
    console.log('Richiesta eseguita con successo:', response.data);
  } catch (error) {
    console.error('Errore durante la richiesta:', error.message);
  }
});

posts.get('/posts', async (req, res) => {
  try {
    const post = await PostsModel.find();

    res.status(200).send({
      statusCode: 200,
      message: 'Post effettuato con successo',
      post,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Errore interno al server',
      error: message.error,
    });
  }
});

posts.get('/posts/bytitle', async (req, res) => {
  const { title } = req.query;

  try {
    const post = await PostsModel.find({
      title: {
        $regex: title,
        $options: 'i',
      },
    });

    if (!post) {
      res.status(404).send({
        message: 'Titolo non trovato ',
        statusCode: 404,
      });
    }

    res.status(200).send({
      statusCode: 200,
      post,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore nel server interno',
      error: error.message,
      statusCode: 500,
    });
  }
});

posts.post('/posts/create', async (req, res) => {
  const newPost = new PostsModel({
    title: req.body.title,
    description: req.body.description,
    img: req.body.img,
    source: req.body.source,
    subtitle: req.body.subtitle,
  });

  try {
    const post = await newPost.save();
    res.status(201).send({
      message: 'Post inviato con successo',
      statusCode: 201,
      post,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore nel server interno',
      error: error.message,
      statusCode: 500,
    });
  }
});

posts.patch('/posts/update/:id', async (req, res) => {
  const { id } = req.params;

  const postExist = await PostsModel.findById(id);
  if (!postExist) {
    return res.status(404).send({
      message: `armor non trovato con questo id ${id}`,
      statusCode: 404,
    });
  }

  try {
    const updatePost = req.body;
    const options = { new: true };
    const post = await PostsModel.findByIdAndUpdate(id, updatePost, options);

    res.status(200).send({
      message: 'Update effettuato con successo',
      statusCode: 200,
      post,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore nel server interno',
      error: error.message,
      statusCode: 500,
    });
  }
});

posts.delete('/posts/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostsModel.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).send({
        statusCode: 404,
        message: `Questo id ${id} non esiste o è gia stato eliminato `,
      });
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send({
      message: 'Errore nel server interno',
      error: error.message,
      statusCode: 500,
    });
  }
});

module.exports = posts;
