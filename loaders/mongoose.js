const mongoose = require('mongoose');
const config = require('../config/config');

module.exports = async () => {
  try {
    const connection = await mongoose.connect(config.db_connection);
    return connection;
  } catch (err) {
    console.log(err.message);
  }
};

//
