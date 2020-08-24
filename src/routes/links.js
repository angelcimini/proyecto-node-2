const express = require('express');
const router = express.Router();
//requerimos "express" para usar el método Router() para almacenarlo la constante "router" y exportarla después

const { usuarioRegistrado } = require('../lib/auth');

const pool = require('../database');
//importamos la conexión desde src/database.js

router.get('/add', usuarioRegistrado, (req,res)=> {
    res.render('links/add');
});
//peticion "get" de la ruta "/add" para renderizar la vista: src/views/links/add.hbs

router.post('/add', usuarioRegistrado, async (req,res)=>{
    // console.log(req.body);
    const { title, url, description } = req.body;
    // obtener las propiedades "title, url, description" desde "req.body"
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    // creamos el objeto "newLink" con las constantes obtenidas de "req.body"
    // console.log(newLink);
    
    // ahora podríamos usar:
    // async await
    await pool.query('INSERT INTO links set ?', [newLink]);
    
    // callbacks
    // pool.query('INSERT INTO links set ?', [newLink], ()=>{} ...);

    // promesas
    // pool.query('INSERT INTO links set ?', [newLink]);
    //     .then()

    req.flash('success', 'link guardado correctamente');
    res.redirect('/links');
    // res.send('received');
});
//peticion "post" de la ruta "/add" para enviar los datos del formulario a la DB

router.get('/', usuarioRegistrado, async (req,res)=>{
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    console.log(links);
    // res.render('links/list', {links: links}); o simplemente...
    res.render('links/list', {links});
    // renderizamos las vistas de "links" del archivo "list"
});

router.get('/delete/:id', usuarioRegistrado, async (req,res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'link eliminado correctamente');
    res.redirect('/links');
});

router.get('/edit/:id', usuarioRegistrado, async (req,res) =>{
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE ID = ?', [id]);
    console.log(links[0]);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', usuarioRegistrado, async (req,res) =>{
    const { id } = req.params;
    const { title, url, description } = req.body;
    const editedLink = {
        title,
        url,
        description
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [editedLink, id]);
    req.flash('success', 'link editado correctamente');
    res.redirect('/links');
});

module.exports = router;
//exportamos la constante router