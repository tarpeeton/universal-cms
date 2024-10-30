const express = require('express');
const { createSchema  , submitData} = require('../controllers/schemaController');
const { getSchemaByName } = require('../controllers/getSchemaByName');
const router = express.Router();

router.post('/create-schema', createSchema);
router.get('/get-schema/:name', getSchemaByName); // New route to get schema by name
router.post('/submit-data', submitData); // New route for data submission



module.exports = router;
