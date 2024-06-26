const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'dev';

switch (env) {
    case 'dev':
        dotenv.config({ path: './.env.dev' });
        break;
    case 'release':
        dotenv.config({ path: './.env.release' });
        break;
    case 'prod':
        dotenv.config({ path: './.env.prod' });
        break;
    default:
        throw new Error(`Unknown environment: ${env}`);
}

module.exports = {
    port: process.env.PORT,
    mongodbUri: process.env.MONGODB_URI
};
