// app.js
const express = require( 'express' );
const path = require( 'path' );
const cookieParser = require( 'cookie-parser' );
const logger = require( 'morgan' );
const mongoose = require( 'mongoose' );
const cors = require( 'cors' );

// Autoriser tous les domaines à accéder à la ressource
const PORT = 4505;

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

// mongoose.connect( 'mongodb+srv://jtolojanahary5:A1NYRdGIqctB8FPA@mongodbcluster.8z1hiuf.mongodb.net/salon-beaute?retryWrites=true&w=majority&appName=mongodbCluster' );
const connectDB = async () => {
  try {
    const conn = await mongoose.connect( 'mongodb+srv://jtolojanahary5:A1NYRdGIqctB8FPA@mongodbcluster.8z1hiuf.mongodb.net/salon-beaute?retryWrites=true&w=majority&appName=mongodbCluster' );
    console.log( `MongoDB Connected: ${conn.connection.host}` );
  } catch ( error ) {
    console.log( error );
    process.exit( 1 );
  }
}

connectDB().then( () => {
  app.listen( PORT, () => {
    console.log( "listening for requests" );
  } )
} )

app.use( '/auth', indexRouter );
app.use( '/clients', clientRouter );
app.use( '/manager', managerRouter );
app.use( '/employees', employeRouter );
app.use( '/services', serviceRouter );
app.use( '/rendez-vous', rendezVousRouter );



module.exports = app;