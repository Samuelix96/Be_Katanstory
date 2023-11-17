const express = require("express");
const users = express.Router();
const mongoose = require("mongoose");
const usersModel = require("../Models/users")
const bcrypt = require("bcrypt")

users.get('/users', async (req, res) =>
{
    try
    {
        const user = await usersModel.find()

        res.status(200).send({
            statusCode: 200,
            user
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

users.get('/users/bynickName', async (req, res) =>
{
    const { nickName } = req.query;

    try
    {
        const user = await usersModel.find({
            nickName: {
                $regex: nickName,
                $options: "i"
            },
        })

        if (!user)
        {
            res.status(404).send({
                message: "Titolo non trovato ",
                statusCode: 404
            })
        }

        res.status(200).send({
            statusCode: 200,
            user
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

users.post('/users/create', async (req, res) =>
{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    const newUser = new usersModel({
       firstName: req.body.firstName,
       lastName: req.body.lastName,
       nickName: req.body.nickName,
       email: req.body.email,
       password:hashedPassword,
       role: req.body.role,
       birth: req.body.birth,
       avatar: req.body.avatar
    })

    try
    {
        const user = await newUser.save()
        res.status(201).send({
            message: "Post inviato con successo",
            statusCode: 201,
            user
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

users.patch('/users/update/:id', async (req, res) =>
{
    const { id } = req.params;

    const userExist = await usersModel.findById(id)
    if (!userExist)
    {

        return res.status(404).send({
            message: `armor non trovato con questo id ${ id }`,
            statusCode: 404
        })
    }

    try
    {
        const updateUser = req.body;
        const options = { new: true };
        const user = await usersModel.findByIdAndUpdate(id, updateUser, options)

        res.status(200).send({
            message: "Update effettuato con successo",
            statusCode: 200,
            user
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


module.exports = users