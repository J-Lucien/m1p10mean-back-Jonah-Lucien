// app.js
const express = require( 'express' );
const path = require( 'path' );
const cookieParser = require( 'cookie-parser' );
const logger = require( 'morgan' );
const mongoose = require( 'mongoose' );
require( 'dotenv' ).config();
const cors = require( 'cors' );

// Autoriser tous les domaines à accéder à la ressource
const PORT = process.env.PORT || 3001;

const indexRouter = require( './routes/auth' );
const clientRouter = require( './routes/client' );
const employeRouter = require( './routes/employe' );
const managerRouter = require( './routes/manager' );
const serviceRouter = require( './routes/ServiceRouter' );
const rendezVousRouter = require( './routes/rendezVousRouter' );
const verifyToken = require( './service/midlware/JwtFilter' );

const app = express();
app.use( logger( 'dev' ) );
app.use( express.json() );
app.use( express.urlencoded( {
  extended: false
} ) );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( cors() );
//  app.use(verifyToken)

mongoose.connect( 'mongodb+srv://jtolojanahary5:A1NYRdGIqctB8FPA@mongodbcluster.8z1hiuf.mongodb.net/salon-beaute?retryWrites=true&w=majority&appName=mongodbCluster' );

const db = mongoose.connection;
db.on( 'error', console.error.bind( console, 'Erreur de connexion à MongoDB :' ) );
db.once( 'open', () => {
  console.log( 'Connecté à la base de données MongoDB' );
} );

app.use( '/auth', indexRouter );
app.use( '/clients', clientRouter );
app.use( '/manager', managerRouter );
app.use( '/employees', employeRouter );
app.use( '/services', serviceRouter );
app.use( '/rendez-vous', rendezVousRouter );

app.listen( PORT, () => {
  console.log( `Serveur en cours d'exécution sur le port ${PORT}` );
} );


module.exports = app;