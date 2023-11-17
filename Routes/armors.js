const express = require("express");
const isAdmin = require("../Middlewares/isAdmin");
const armors = express.Router();
const ArmorsModel = require("../Models/armors")
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
        folder: "ArmorsImages",
        format: async(req,file) => "png",
        public_id : (req, file) => file.name
    }
})

const cloudUpload = multer({ storage: cloudStorage})

armors.post('/armors/cloudUpload', cloudUpload.fields([
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





armors.get('/armors', async (req, res) =>
{
    const { page = 1, pageSize = 8} = req.query;
    try
    {
        const armor = await ArmorsModel.find()
        .skip((page - 1) * pageSize)
        .limit(pageSize)

        const totalArmors = await ArmorsModel.count()

        res.status(200).send({
            statusCode: 200,
            currentPage: Number(page),
            totalArmors,
            totalPages: Math.ceil(totalArmors / pageSize),
            armor
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


armors.get('/armors/bytitle', async (req, res) =>
{
    let { title } = req.query;

    title = title.replace(/\s/g, '');

    try
    {
        const armor = await ArmorsModel.find({
            title: {
                $regex: title,
                $options: "i"
            },
        })

        if (!armor)
        {
            res.status(404).send({
                message: "Titolo non trovato ",
                statusCode: 404
            })
        }

        res.status(200).send({
            statusCode: 200,
            armor
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

armors.get('/armors/:id' , async(req, res) => {
    const {id} = req.params;

    try {
        const armor = await ArmorsModel.findById(id)
        if(!armor) {
            return res.status(404).send({
                statusCode:404,
                message: "ID non trovato "
            })
        }

        res.status(200).send({
            armor,
            message: "Armor trovato con questo id",
            statusCode:200,
            
        })

    } catch (error) {
        res.status(500).send({
            message: "Errore nel server interno",
            error: error.message,
            statusCode: 500
        })
    }
})

armors.post('/armors/create',  async (req, res) =>
{
    const newArmors = new ArmorsModel({
        img: req.body.img,
        image2: req.body.image2,
        image3: req.body.image3,
        image4: req.body.image4,
        image5: req.body.image5,
        description: req.body.description,
        price: req.body.price,
        title: req.body.title,
        helmet: req.body.helmet,
        mask: req.body.mask,
        armor: req.body.armor,
        sleeves:req.body.sleeves
    })

    try
    {
        const armor = await newArmors.save()
        res.status(201).send({
            message: "Post inviato con successo",
            statusCode: 201,
            armor
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

armors.patch('/armors/update/:id',   async (req, res) =>
{
    const { id } = req.params;

    const armorExist = await ArmorsModel.findById(id)
    if (!armorExist)
    {

        return res.status(404).send({
            message: `armor non trovato con questo id ${ id }`,
            statusCode: 404
        })
    }

    try
    {
        const updateArmor = req.body;
        const options = { new: true };
        const armor = await ArmorsModel.findByIdAndUpdate(id, updateArmor, options)

        res.status(200).send({
            message: "Update effettuato con successo",
            statusCode: 200,
            armor
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

armors.delete('/armors/delete/:id', async (req, res) =>
{
    const { id } = req.params;

    try
    {
        const armor = await ArmorsModel.findByIdAndDelete(id)
        if (!armor)
        {
            return res.status(404).send({
                statusCode: 404,
                message: "Errore interno al server"
            })
        }

        res.status(200).send({
            statusCode: 200,
            message: "Delete effettuato con successo",
            armor
        })
    } catch (error)
    {

    }
})

module.exports = armors