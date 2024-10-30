import bannerSchema from './defineType';

export async function sendSchema() {
  try {
    const response = await fetch('http://localhost:5050/api/schema/create-schema', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ schemaDefinition: bannerSchema }), // Wrap with `schemaDefinition`
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('Error in sendSchema:', error);
    throw error;
  }
}
