const express = require('express');
const reset = express.Router();
const UsersModel = require("../Models/users")
const bcrypt = require("bcrypt")

reset.post('/resetpassword', async (req, res) =>
{
    const { email, password } = req.body;

    console.log('Email received:', email);
    console.log('New Password received:', password);
    try
    {
        const user = await UsersModel.findOne({ email });

        if (!user)
        {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Password aggiornata con successo', user });
    } catch (error)
    {
        console.error(error); 
        res.status(500).send({
            message: "Errore nel server interno",
            error: error.message,
            statusCode: 500
        })
    }
});

module.exports = reset;
