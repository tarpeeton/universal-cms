const SchemaDefinition = require('./schemaDefinition')


const getSchemaByName = async (req, res) => {
    try {
      const schemaName = req.params.name;
  
      // Find the schema definition by name
      const schemaDefinition = await SchemaDefinition.findOne({ name: schemaName });
      
      if (!schemaDefinition) {
        return res.status(404).json({ error: `Schema with name ${schemaName} not found.` });
      }
  
      // Send the schema definition to the client
      res.status(200).json(schemaDefinition);
    } catch (error) {
      console.error('Error retrieving schema by name:', error);
      res.status(500).json({ error: 'Failed to retrieve schema definition.' });
    }
  };
  
  module.exports = { getSchemaByName };
  