// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors package
const connectDB = require('./database/base');
const schemaRouter = require('./routers/api');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/schema', schemaRouter);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
