const express = require("express");
const isAdmin = require("../Middlewares/isAdmin");
const katanas = express.Router();
const katanasModel = require("../Models/katanas")
const multer = require("multer")
const crypto = require("crypto")
const cloudinary = require ("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary")
require("dotenv").config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_APY_KEY,
    api_secret : process.env.CLOUDINARY_APY_SECRET,
})

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params : {
        folder: "KatanasImages",
        format: async(req,file) => "png",
        public_id : (req, file) => file.name
    }
})

const cloudUpload = multer({ storage: cloudStorage})

katanas.post('/katanas/cloudUpload', cloudUpload.fields([
    { name: 'img', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'image5', maxCount: 1 }
]), async (req, res) => {
    try {
        const fileUrls = {
            img: req.files['img'][0].path,
            image2: req.files['image2'][0].path,
            image3: req.files['image3'][0].path,
            image4: req.files['image4'][0].path,
            image5: req.files['image5'][0].path
        };
        res.status(200).json(fileUrls);
    } catch (error) {
        res.status(500).send({
            message: "Errore nel server interno",
            error: error.message,
            statusCode: 500
        });
    }
});


katanas.get('/katanas', async (req, res) =>
{
    try
    {
        const katanas = await katanasModel.find()

        res.status(200).send({
            statusCode: 200,
            katanas
        })
    } catch (error)
    {
        res.status(500).send({
            message: "Errore nel server interno",
            error: error.message,
            statusCode: 500
        })
    }
})
katanas.get('/katanas/:id', async (req, res) =>
{
    const { id } = req.params;
    try
    {
        const kata = await katanasModel.findById(id)
        if (!kata)
        {
            return res.status(404).send({
                message: `Katana not found with this id ${ id }`,
                statusCode: 404
            })
        }

        res.status(200).send({
            statusCode: 200,
            kata
        })
    } catch (error)
    {

    }
})

katanas.get('/katanas/category/:category', async (req, res) =>
{
    const { category } = req.params;

    try
    {
        const katas = await katanasModel.find({
            category: {
                $regex: category,
                $options: "i"
            },
        })

        if (!katas)
        {
            res.status(404).send({
                message: "Caegory not Found ",
                statusCode: 404
            })
        }

        res.status(200).send({
            statusCode: 200,
            katas
        })
    } catch (error)
    {
        res.status(500).send({
            message: "Errore nel server interno",
            error: error.message,
            statusCode: 500
        })
    }
})

katanas.get('/katanas/title/:title', async (req, res) =>
{
    const { title } = req.params;

    try
    {
        const katatitle = await katanasModel.find({
            title: {
                $regex: title,
                $options: "i"
            },
        })

        if (!katatitle)
        {
            res.status(404).send({
                message: "Title not found",
                statusCode: 404
            })
        }

        res.status(200).send({
            statusCode: 200,
            katatitle
        })
    } catch (error)
    {
        res.status(500).send({
            message: "Errore nel server interno",
            error: error.message,
            statusCode: 500
        })
    }
})
katanas.post('/katanas/create', async (req, res) =>
{
    const newKata = new katanasModel({
        title: req.body.title,
        description: req.body.description,
        img: req.body.img,
        image2: req.body.image2,
        image3: req.body.image3,
        image4: req.body.image4,
        image5: req.body.image5,
        category: req.body.category,
        price: Number(req.body.price),
        length: Number(req.body.length),
        width: Number(req.body.width),
        thickness: Number(req.body.thickness),
        age: req.body.age,
        location: req.body.location
    })

    try
    {
        const kata = await newKata.save()
        res.status(201).send({
            message: "Post inviato con successo",
            statusCode: 201,
            kata
        })
    } catch (error)
    {
        res.status(500).send({
            message: "Errore nel server interno",
            error: error.message,
            statusCode: 500
        })
    }

})

katanas.patch('/katanas/update/:id', async (req, res) =>
{
    const { id } = req.params;

    const kataExist = await katanasModel.findById(id)
    if (!kataExist)
    {

        return res.status(404).send({
            message: `armor non trovato con questo id ${ id }`,
            statusCode: 404
        })
    }

    try
    {
        const updateKata = req.body;
        const options = { new: true };
        const kata = await katanasModel.findByIdAndUpdate(id, updateKata, options)

        res.status(200).send({
            message: "Update effettuato con successo",
            statusCode: 200,
            kata
        })

    } catch (error)
    {
        res.status(500).send({
            message: "Errore nel server interno",
            error: error.message,
            statusCode: 500
        })
    }
})

katanas.delete('/katanas/delete/:id', async (req, res) =>
{
    const { id } = req.params;

    try
    {
        const katanas = await katanasModel.findByIdAndDelete(id)
        if (!katanas)
        {
            return res.status(404).send({
                statusCode: 404,
                message: "Errore interno al server"
            })
        }

        res.status(200).send({
            statusCode: 200,
            message: "Delete effettuato con successo",
            katanas
        })
    } catch (error)
    {
        res.status(500).send({
            message: "Errore nel server interno",
            error: error.message,
            statusCode: 500
        })
    }
})


module.exports = katanas;