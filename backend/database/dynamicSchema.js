// database/dynamicSchema.js
const mongoose = require('mongoose');

const generateSchema = (fields) => {
  const schemaDefinition = {};

  fields.forEach((field) => {
    const { name, type, required, localized } = field;
    const fieldConfig = { type: mongoose.Schema.Types[type], required };

    // Handle localization by setting up an object with translations
    if (localized) {
      fieldConfig.type = Map;
      fieldConfig.of = String;
    }

    schemaDefinition[name] = fieldConfig;
  });

  return new mongoose.Schema(schemaDefinition, { timestamps: true });
};

const createModel = (modelName, schemaDefinition) => {
  if (mongoose.models[modelName]) {
    delete mongoose.models[modelName];
  }
  return mongoose.model(modelName, schemaDefinition);
};

module.exports = { generateSchema, createModel };
