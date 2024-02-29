const url = require( 'url' );
const jwt = require( 'jsonwebtoken' );
require( 'dotenv' ).config();


const verifyToken = ( req, res, next ) => {
    const pathName = url.parse( req.url ).pathname;
    console.log( "🚀 ~ app.use ~ pathname:", pathName );
    if ( pathName.startsWith( '/auth' ) ) {
        console.log( "🚀 ~ skip this url" );
        next();
    } else {
        const authorization = req.header( 'Authorization' );
        console.log( "🚀 ~ app.use ~ authorization:", authorization );
        if ( !authorization ) {
            return res.status( 403 ).json( {
                error: 'Access denied'
            } );
        }
        const token = req.header( 'Authorization' ).split( ' ' )[ 1 ];
        console.log( "🚀 ~ app.use ~ token:", token );

        jwt.verify( token, 'hBb3MmlyZQKD6ckVFMtC9M7CYHvA5W6f', ( err, decode ) => {
            if ( err ) {
                console.log( "🚀 ~ jwt.verify ~ err:", err );
                return res.status( 403 ).json( {
                    error: err.message
                } );
            } else {
                next();
            }
        } );
    }
};

module.exports = verifyToken;