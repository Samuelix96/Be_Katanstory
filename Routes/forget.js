const express = require('express');
const forget = express.Router();
const nodemailer = require("nodemailer");
const UsersModel = require("../Models/users")
const uuid = require('uuid');

forget.post('/forgetpassword', async (req, res) =>
{
    const { email } = req.body;

    try
    {
        // Cerca l'utente nel database per l'email fornita
        const user = await UsersModel.findOne({ email });

        if (!user)
        {
            return res.status(404).json({ message: "Utente non trovato" });
        }

        // Genera un token univoco per il reset della password
        const resetToken = uuid.v4();


        // Imposta il token e la sua scadenza nell'oggetto utente nel database
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Scadenza dopo un'ora

        await user.save();

        // Invia un'email all'utente con il link per il reset della password
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'ivy.langosh91@ethereal.email',
                pass: 'WmyFU6ZB2arHUgrD69'
            }
        });

        const mailOptions = {
            to: user.email,
            from: 'ivy.langosh91@ethereal.email',
            subject: 'Reset della password',
            html: `
                <p>You have requested a password reset. Click on the following link to reset your password:</p>
                <a href="http://localhost:3000/resetpassword/${ resetToken }">Click here to reset your password</a>
                `
        };

        transporter.sendMail(mailOptions, (error) =>
        {
            if (error)
            {
                console.log("Error sending password reset email:", error);
                return res.status(500).json({ message: "Error sending password reset email" });
            }


        });


        res.status(200).send({
            statusCode: 200,
            message: "Email sending successfully",
            user

        })
    } catch (error)
    {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
});

module.exports = forget;