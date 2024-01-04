const router = require('express').Router();
const gisting_http = require('./controler_http.js');

router.get('/getDataGistingNew', gisting_http.getDataGistingNew);

module.exports = router;