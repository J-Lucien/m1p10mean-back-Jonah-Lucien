// authController.js
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );
const User = require( '../models/User' );
const {
    Manager
} = require( '../models/Manager' );
require( 'dotenv' ).config();
const {
    Employee
} = require( '../models/Employe' );
const {
    sendConfirmationEmail
} = require( './mailService' );
const {
    Client
} = require( '../models/Client' );

async function register( email, nom, prenom, motDePasse, role ) {
    try {

        const existingUser = await User.findOne( {
            email
        } );

        if ( existingUser !== null ) {
            throw new Error( "L'e-mail existe déjà" );
        }

        if ( role === 'employee' ) {
            const employe = new Employee( {
                email,
                nom,
                prenom,
                estValide: false,
                estConfirme: false,
                tauxCommission: 0
            } );
            sendConfirmationEmail( email, 'employee' );
            employe.save();
        } else if ( role === 'client' ) {
            const client = new Client( {
                email,
                nom,
                prenom,
                preferenceEmploye: [],
                preferenceService: []
            } );
            sendConfirmationEmail( email, 'client' );
            client.save();
        }
        const hashedPassword = await bcrypt.hash( motDePasse, 10 );
        const user = new User( {
            email,
            motDePasse: hashedPassword,
            role
        } );
        user.save();
        return {
            message: 'Inscription réussie'
        };
    } catch ( error ) {
        console.log( 'ERREUR ', error );
        throw new Error( "Erreur lors de l'inscription" );
    }
}

async function login( email, motDePasse ) {
    console.log( "🚀 ~ login ~ motDePasse:", motDePasse );
    console.log( "🚀 ~ login ~ email:", email );
    try {
        const user = await User.findOne( {
            email
        } );
        const error_log = "Nom d\'utilisateur ou mot de passe incorrect";
        if ( !user ) {
            throw new Error( error_log );
        }

        const isPasswordValid = await bcrypt.compare( motDePasse, user.motDePasse );
        console.log( isPasswordValid );
        if ( !isPasswordValid ) {
            throw new Error( error_log );
        }

        if ( user.role === 'employee' ) {
            const employe = await Employee.findOne( {
                email
            } );
            if ( employe ) {
                if ( !employe.estConfirme ) {
                    throw new Error( "Email non confirmé" );
                } else if ( !employe.estValide ) {
                    throw new Error( "Email en attente de validation" );
                }
            }
        } else if ( user.role === 'client' ) {
            const client = await Client.findOne( {
                email
            } );
            if ( !client.estConfirme ) {
                throw new Error( "Email non confirmé" );
            }
        }

        const token = jwt.sign( {
            email: user.email,
            role: user.role
        }, 'hBb3MmlyZQKD6ckVFMtC9M7CYHvA5W6f', {
            expiresIn: '2h'
        } );
        return {
            token,
            email
        };

    } catch ( error ) {
        console.log( error );
        throw new Error( error.message );
    }
}

async function confirmCompte( email, str ) {
    try {
        if ( str === 'employee' ) {
            const employe = await Employee.findOne( {
                email
            } );
            if ( !employe ) {
                throw new Error( "Aucun employé trouvé avec cet e-mail" );
            }
            employe.estConfirme = true;
            await employe.save();
        }
        if ( str === 'client' ) {
            const client = await Client.findOne( {
                email
            } );
            if ( !client ) {
                throw new Error( "Aucun client trouvé avec cet e-mail" );
            }
            client.estConfirme = true;
            await client.save();
        }
    } catch ( error ) {
        throw new Error( 'Erreur lors de la confirmation du compte' );
    }
}

async function getUsers() {
    try {
        const users = await User.find( {} );
        return users;
    } catch ( error ) {
        throw new Error( 'Erreur lors de la récupération de la liste des utilisateurs' );
    }
}

module.exports = {
    register,
    login,
    confirmCompte,
    getUsers
};