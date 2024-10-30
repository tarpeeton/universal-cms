"use client";
import { FC, useEffect, useState } from 'react';

interface SchemaField {
  name: string;
  type: string;
  fields?: SchemaField[];
}

interface IHuysos {
  schemaName: string;
}

const DynamicForm: FC<IHuysos> = ({ schemaName }) => {
  const [schema, setSchema] = useState<SchemaField[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await fetch(`http://localhost:5050/api/schema/get-schema/${schemaName}`);
        const data = await response.json();
        setSchema(data.fields);
      } catch (error) {
        console.error('Error fetching schema:', error);
      }
    };

    fetchSchema();
  }, [schemaName]);

  const handleChange = (name: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const renderInput = (field: SchemaField) => {
    switch (field.type) {
      case 'string':
        return (
          <input
            type="text"
            name={field.name}
            placeholder={field.name}
            key={field.name}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
        );
      case 'url':
        return (
          <input
            type="url"
            name={field.name}
            placeholder={field.name}
            key={field.name}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
        );
      case 'object':
        return (
          <div key={field.name} className="mb-6">
            <h4 className="text-lg font-semibold mb-2">{field.name || field.name}</h4>
            <div className="ml-4 space-y-2">
              {field.fields && field.fields.map((nestedField) => (
                <div key={nestedField.name} className="flex flex-col">
                  <label className="mb-1 text-sm text-gray-600">{nestedField.name || nestedField.name}</label>
                  {renderInput(nestedField)}
                </div>
              ))}
            </div>
          </div>
        );
      case 'image':
        return (
          <input
            type="file"
            name={field.name}
            accept="image/*"
            key={field.name}
            onChange={(e) => handleChange(field.name, e.target.files ? e.target.files[0] : null)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4 text-green-900"
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();

    for (const key in formData) {
      if (formData[key] instanceof File) {
        form.append(key, formData[key]);
      } else {
        form.append(key, JSON.stringify(formData[key])); // Serialize nested objects
      }
    }

    form.append("schemaName", schemaName);

    try {
      const response = await fetch(`http://localhost:5050/api/schema/submit-data`, {
        method: 'POST',
        body: form,
      });
      const result = await response.json();
      console.log('Form submission successful:', result);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      {schema?.map((field, index) => (
        <div key={field.name || index} className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">{field.name || field.name}</label>
          {renderInput(field)}
        </div>
      ))}
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md mt-4 hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
