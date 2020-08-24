const express = require('express');
const morgan = require('morgan');
const expresshbs = require('express-handlebars');
const path = require('path');
// (M)ódulo para usar su método join y unir directorios

const flash = require('connect-flash');
const session = require('express-session');
const mySqlStore = require('express-mysql-session');
const { database } = require('./keys');
const passport = require('passport');


//INITIALIZATIONS
const app = express();
require('./lib/passport');


//SETTINGS
app.set('port', process.env.PORT || 4000);
//si existe un puerto en el sistema usa ese, en caso contrario el 4000

app.set('views', path.join(__dirname, 'views'));
//la carpeta views está en ésta ubicación de archivo (__dirname) + views, es decir, node.mysql/src/views

app.engine('.hbs', expresshbs({
//configurar un engine de express-handlebars con un objeto para poder configurarlo
    defaultLayout: 'main',
    // nombre del archivo por defecto. views/layouts/main.hbs 
    layoutsDir: path.join(app.get('views'), 'layouts'),
    // definimos la ubicación de la carpeta layouts. views/layouts
    partialsDir: path.join(app.get('views'), 'partials'),
    // definimos la ubicación de la carpeta partials. views/partials
    extname: '.hbs',
    // nombre de extensión de los archivos en la carpeta views
    helpers: require('./lib/handlebars')
    // usar los helpers para procesar funciones 
}));
app.set('view engine', 'hbs');
//utilizar el engine


//MIDDLEWARES
app.use(session({
    secret: 'nodemysqlsession',
    resave: false,
    saveUninitialized: false,
    store: new mySqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
// servidor usa morgan con parámetro 'dev'

app.use(express.urlencoded({extended: false}));
//método urlencoded para aceptar datos sencillos enviados por formulario

app.use(express.json());
//método para pasar json
app.use(passport.initialize());
app.use(passport.session());


//GLOBAL VARIABLES
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.success = req.flash('message');
    app.locals.user = req.user;
    next();
});


//ROUTES
app.use(require('./routes'));
// usa la el archivo index.js de la carpeta routes. src/routes/index.js
app.use(require('./routes/autentication'));
// usa la el archivo autentication.js de la carpeta routes. src/routes/autentication.js
app.use('/links', require('./routes/links'));
// usa la el archivo links.js de la carpeta routes. src/routes/links.js


//PUBLIC
app.use(express.static(path.join(__dirname, 'public')));
// Aquí le estamos diciendo donde está la carpeta public.  src/public


//STARTING SERVER
app.listen(app.get('port'), () => {
// servidor escucha en el puerto 'port'
    console.log('server on port', app.get('port'));
    // muestra un mensaje por consola que diga 'server on port' + 'port'
});