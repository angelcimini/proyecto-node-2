const express = require('express');
const router = express.Router();
//requerimos "express" para usar el método Router() para almacenarlo la constante "router" y exportarla después

router.get('/',(req, res)=>{
    res.render('index');
})

module.exports = router;
//exportamos la constante router