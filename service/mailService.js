const nodemailer = require( 'nodemailer' );
require( 'dotenv' ).config();

async function createTransporter() {
    return nodemailer.createTransport( {
        service: 'gmail',
        auth: {
            user: 'jonahrafit@gmail.com',
            pass: 'vupp bpwz pijf mnod',
        },
    } );
}

async function sendConfirmationEmail( email, str ) {
    const mailOptions = {
        from: 'jonahrafit@gmail.com',
        to: email,
        subject: 'Confirmation d\'inscription',
        html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation d'inscription</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    text-align: center;
                }
        
                .container {
                    max-width: 600px;
                    margin: 50px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
        
                .message {
                    margin-bottom: 20px;
                }
        
                .confirmation-link {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                }
        
                .confirmation-link:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="message">
                    <p>Merci de vous être inscrit!</p>
                    <p>Cliquez sur le bouton ci-dessous pour confirmer votre inscription :</p>
                </div>
                <a href="http://localhost:3001/auth/confirm/compte/${email}/${str}" class="confirmation-link">Confirmer l'inscription</a>
            </div>
        </body>
        </html>
        `,
    };
    try {
        const transporter = await createTransporter();
        await transporter.sendMail( mailOptions );
    } catch ( error ) {
        console.error( 'Error sending email:', error.message );

        // Handle the error based on the error code or message
        switch ( error.code ) {
            case 'EAUTH': // Incorrect credentials
                console.error( 'Invalid email or password' );
                // Send notification to user or retry with different credentials
                break;
            case 'ENOTFOUND': // Server not found
                console.error( 'Email server not found' );
                // Retry or use a different service
                break;
            default:
                console.error( 'Unexpected error:', error );
                // Log the error for debugging
                break;
        }
    }

}

async function sendNofiticationEmail( email, nomClient, frontLink ) {
    console.log( "🚀 ~ sendNofiticationEmail ~  email, nomClient, frontLink:", email, nomClient, frontLink );
    const mailOptions = {
        from: 'jonahrafit@gmail.com',
        to: email,
        subject: 'Offre special',
        html: `
        < !DOCTYPE html >
            <html lang = "en" >
            <head >
            <meta charset = "UTF-8" >
            <meta name = "viewport"content = "width=device-width, initial-scale=1.0" >
            <title > Promotion Publiée < /title>
            <style >
                body {
                    font - family: Arial, sans - serif;
                    margin: 0;
                    padding: 0;
                    background - color: #f5f5f5;
                }
                .container {
                    max - width: 600 px;
                    margin: 20 px auto;
                    background - color: #fff;
                    padding: 20 px;
                    border - radius: 8 px;
                    box - shadow: 0 0 10 px rgba( 0, 0, 0, 0.1 );
                }
                h1 {
                    color: #333;
                    text-align: center;
                }
                p {
                    color: # 666;
                    font - size: 16 px;
                    line - height: 1.6;
                    margin - bottom: 20 px;
                }
                .btn {
                    display: inline - block;
                    background - color: #007bff;
                    color: # fff;
                    text - decoration: none;
                    padding: 10 px 20 px;
                    border - radius: 5 px;
                    transition: background - color 0.3 s;
                }
                .btn: hover {
                        background - color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class= "container" >
                < h1 > Promotion Publiée! < /h1>
                < p > Bonjour ${nomClient}, < /p>
                <p > Nous sommes heureux de vous informer qu 'une nouvelle promotion a été publiée.</p>
                < p > Consultez nos offres spéciales dès maintenant! < /p> <a href = "${frontLink}" class = "btn" > Voir les promotions < /a >
            </div>
        </body>
    </html>
            `,
    };
    try {
        const transporter = await createTransporter();
        await transporter.sendMail( mailOptions );
    } catch ( error ) {
        console.error( 'Error sending email:', error.message );

        // Handle the error based on the error code or message
        switch ( error.code ) {
            case 'EAUTH': // Incorrect credentials
                console.error( 'Invalid email or password' );
                // Send notification to user or retry with different credentials
                break;
            case 'ENOTFOUND': // Server not found
                console.error( 'Email server not found' );
                // Retry or use a different service
                break;
            default:
                console.error( 'Unexpected error:', error );
                // Log the error for debugging
                break;
        }
    }

}

module.exports = {
    sendConfirmationEmail,
    sendNofiticationEmail
};