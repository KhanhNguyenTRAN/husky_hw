const express = require('express');
const mongoose = require('mongoose');
const config = require('../config');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/items', require('./routes/item.route'));

// Start server
const port = config.port;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
