const mongoose = require('mongoose');

const SchemaFieldSchema = new mongoose.Schema({
  name: String,
  type: String,
  fields: [this], // Nested fields for 'object' types
  validation: {
    required: Boolean,
  },
  options: {
    hotspot: Boolean,
  },
});

const SchemaDefinitionSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true }, // Schema name (e.g., 'banner')
  fields: [SchemaFieldSchema], // List of fields defining the schema
});

const SchemaDefinition = mongoose.model('SchemaDefinition', SchemaDefinitionSchema);

module.exports = SchemaDefinition;
