const catchError = require('../utils/catchError');
const Users = require('../models/Users.js');
const bcrypt = require('bcrypt')
const sendEmail = require('../utils/sendEmail');
const EmailCode = require('../models/EmailCode.js');
const jwt  = require("jsonwebtoken");

const getAll = catchError(async (req, res) => {
    const users = await Users.findAll();
    return res.json(users)
});

const createUser = catchError(async (req, res) => {
    const { email, password, firstName, lastName, country, image, frontBaseUrl } = req.body;
    const encriptedPassword = await bcrypt.hash(password, 10);
    const result = await Users.create({
        email,
        password: encriptedPassword,
        firstName,
        lastName,
        country,
        image,
        frontBaseUrl
    });

    const code = require('crypto').randomBytes(32).toString('hex')
    const link = `${frontBaseUrl}/${code}`

    await EmailCode.create({
        code,
        userId: result.id
    })

    await sendEmail({
        to: email,
        subject: "Verify your email",
        html: `
    <h1>Hello ${firstName} ${lastName}!</h1>
    <p>Please click on the following link to verify your account.</p>
    <p><a href="${link}">${link}</a><br></p>
    <p> Or copy this <b>Code:<br> 
    ${code}</b><br> 
    Gracias por iniciar sesión en UsersApp </p>
    `
    })

    return res.status(201).json(result);
});

const getOneUser = catchError(async (req, res) => {
    const { id } = req.params;
    const user = await Users.findByPk(id);
    return res.json(user);
});

const removeUser = catchError(async (req, res) => {
    const { id } = req.params;
    await Users.destroy({ where: { id } });
    return res.sendStatus(204);
});

const updateUser = catchError(async (req, res) => {
    const { id } = req.params;
    const { email, firstName, lastName, country, image, isVerified} = req.body;
    const user = await Users.update(
        {
            email,
            firstName,
            lastName,
            country,
            image,
            isVerified
        },
        { where: { id }, returning: true }
    );
    if (result[0] === 0) return res.sendStatus(404)
    return res.json(user[1][0]);
});

const verifyEmail = catchError(async (req, res) => {
    const { code } = req.params
    const emailCode = await EmailCode.findOne({
        where: { code: code }
    })
    if (!emailCode) return res.status(401).json({ message: "Invalid Code" })
    const user = await Users.update(
        { isVerified: true },
        {
            where: { id: emailCode.userId }, 
            returning: true
        })
        await emailCode.destroy()
    return res.json(user[1][0])
})

const login = catchError(async (req, res) => {
    const {email, password} = req.body
    const user = await Users.findOne({ where: { email: email } })
    if (!user) return  res.status(401).json({message:"Login failed! Check your username."})
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return res.status(401).json({message:'Login failed! Wrong password.'})
    if (user.isVerified === false) return res.status(401).json({message:'Login failed! User not verified'})
    const token = jwt.sign(
        { user},
        process.env.TOKEN_SECRET,
        {expiresIn:'1d'},
    )

    return res.json({user, token})
})

const getLoggedUser = catchError(async(req, res) => {
    return  res.json(req.user);
})

module.exports = {
    getAll,
    createUser,
    getOneUser,
    removeUser,
    updateUser,
    verifyEmail,
    login,
    getLoggedUser
}