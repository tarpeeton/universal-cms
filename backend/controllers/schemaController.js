const mongoose = require('mongoose');
const SchemaDefinition = require('./schemaDefinition');
const multer = require('multer');

const upload = multer(); // Initialize multer to handle FormData

// Function to parse fields into a Mongoose-compatible format, supporting language-specific fields
const parseFields = (fields) => {
    const parsedFields = {};
  
    fields.forEach((field) => {
      let fieldType;
      switch (field.type) {
        case 'string':
          fieldType = String;
          break;
        case 'number':
          fieldType = Number;
          break;
        case 'object':
          if (field.fields) {
            // Treat as nested object
            const subFields = parseFields(field.fields);
            fieldType = new mongoose.Schema(subFields, { _id: false });
          }
          break;
        case 'url':
          fieldType = String;
          break;
        case 'image':
          fieldType = Buffer; // Handle image as binary data
          break;
        default:
          fieldType = String;
      }
  
      parsedFields[field.name] = { type: fieldType };
  
      if (field.validation && field.validation.required) {
        parsedFields[field.name].required = true;
      }
    });
  
    return parsedFields;
  };
  

// POST Endpoint to create and store schema definition in MongoDB
const createSchema = async (req, res) => {
    try {
      const schemaConfig = req.body.schemaDefinition;
  
      if (!schemaConfig || !schemaConfig.fields) {
        throw new Error('Invalid schema configuration: fields are missing.');
      }
  
      const schemaFields = parseFields(schemaConfig.fields);
  
      // Create or reuse the model in Mongoose
      const Model = mongoose.models[schemaConfig.name] || mongoose.model(schemaConfig.name, new mongoose.Schema(schemaFields));
  
      // Save the schema definition to MongoDB if not already saved
      let existingSchema = await SchemaDefinition.findOne({ name: schemaConfig.name });
      if (!existingSchema) {
        const schemaDefinition = new SchemaDefinition({
          name: schemaConfig.name,
          fields: schemaConfig.fields,
        });
        await schemaDefinition.save();
      }
  
      res.status(200).json({ message: `${schemaConfig.name} schema created and saved successfully.` });
    } catch (error) {
      console.error('Error creating schema:', error);
      res.status(500).json({ error: 'Failed to create schema.' });
    }
  };
  

// POST Endpoint to submit data based on schema name using FormData
const submitData = async (req, res) => {
    upload.any()(req, res, async function (err) {
      if (err) return res.status(500).json({ error: 'File upload failed.' });
  
      const schemaName = req.body.schemaName;
      const data = {};
  
      // Parse text fields, handling nested JSON where needed
      for (const key in req.body) {
        if (key !== 'schemaName') {
          try {
            data[key] = JSON.parse(req.body[key]); // Parse JSON strings for complex data
          } catch {
            data[key] = req.body[key];
          }
        }
      }
  
      // Parse files and add them as binary buffers
      req.files.forEach((file) => {
        data[file.fieldname] = file.buffer;
      });
  
      try {
        // Retrieve schema definition and model
        const schemaDefinition = await SchemaDefinition.findOne({ name: schemaName });
        if (!schemaDefinition) {
          return res.status(400).json({ error: `Schema with name ${schemaName} does not exist.` });
        }
  
        const schemaFields = parseFields(schemaDefinition.fields);
        const Model = mongoose.models[schemaName] || mongoose.model(schemaName, new mongoose.Schema(schemaFields));
  
        // Save data based on the schema model
        const newData = new Model(data);
        await newData.save();
        res.status(200).json({ message: 'Data saved successfully.' });
      } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data.' });
      }
    });
  };
  
module.exports = { createSchema, submitData };
