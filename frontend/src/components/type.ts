// helpers/defineType.js (frontend in Next.js)

export interface SchemaField {
    name: string;
    type: string;
    title: string;
    fields?: SchemaField[]; // Nested fields for localized text or objects
    options?: {
      hotspot?: boolean;
    };
    validation?: {
      required?: boolean;
      uri?: boolean;
    };
  }
  
  export interface SchemaDefinition {
    name: string;
    type: string;
    title: string;
    fields: SchemaField[];
  }





  function defineType(schemaDefinition: SchemaDefinition): SchemaDefinition {
    return schemaDefinition;
  }
  
  export default defineType;