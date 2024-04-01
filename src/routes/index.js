const express = require('express');
const router = express.Router();
const usersRouter = require( './users.router.js' );

// colocar las rutas aquí
router.use(usersRouter)

router.post('/emails', (req, res) => {
    return res.json({message: "Enviando email"})
})



module.exports = router;