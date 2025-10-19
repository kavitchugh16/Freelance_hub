// This loads your .env file at the top
require('dotenv').config();

// We export all our secrets from this one file
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'secretkey',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://ajitesh:dbuser%40123@cluster0.04bem14.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  NODE_ENV: process.env.NODE_ENV || 'development',
};