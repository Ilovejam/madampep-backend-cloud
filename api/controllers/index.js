const express = require('express');
const middlewares = require('../middlewares');
const messageController = require('./message');
const uploadController = require('./upload');
const pingController = require('./ping');

const router = express.Router();

const API_VERSION = 'v1';
const API_PATH = `/api/${API_VERSION}`;

// Setup Route Bindings
router.all('*', middlewares.api.initAPI);
router.use('/ping', pingController.routes);
router.use('/message', messageController);
router.use('/upload', uploadController);

// Add default route
router.get('*', (req, res) => {
    res.apiNotFound(new Error('Invalid route'));
});

module.exports = router;
