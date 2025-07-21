import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import type { FormValues, SchemaField } from './types';
import { SchemaList } from './components/SchemaList';
import { Copy } from 'lucide-react';

/**
 * Recursively transforms the schema array from react-hook-form
 * into the desired key-value JSON format.
 * @param fields The array of fields to transform.
 * @returns A key-value object representing the schema.
 */
const transformSchemaToJSON = (fields: SchemaField[] | undefined): Record<string, unknown> => {
  // If there are no fields, return an empty object
  if (!Array.isArray(fields)) {
    return {};
  }

  const jsonObject: Record<string, unknown> = {};

  for (const field of fields) {
    // Skip any fields that don't have a key name yet
    if (!field.keyName) {
      continue;
    }

    if (field.type === 'Nested') {
      // If the field is nested, recursively call this function for its children
      jsonObject[field.keyName] = transformSchemaToJSON(field.children);
    } else {
      // Otherwise, set the key to the field's type (uppercased)
      jsonObject[field.keyName] = field.type.toUpperCase();
    }
  }

  return jsonObject;
};

function App() {
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      schema: [
        { keyName: 'firstName', type: 'String' },
        { keyName: 'age', type: 'Number' },
        {
          keyName: 'address',
          type: 'Nested',
          children: [{ keyName: 'street', type: 'String' }],
        },
      ],
    },
  });

  const [isCopied, setIsCopied] = useState(false);

  // The onFormSubmit handler now uses the new transformer function
  const onFormSubmit = (data: FormValues) => {
    const finalSchemaObject = transformSchemaToJSON(data.schema);
    console.log("Final Generated Schema:", JSON.stringify(finalSchemaObject, null, 2));
  };

  const watchedValues = watch();

  // Transform the raw data in real-time for the preview
  const livePreviewJson = transformSchemaToJSON(watchedValues.schema);
  const jsonString = JSON.stringify(livePreviewJson, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">JSON Schema Builder</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <h2 className="text-lg font-semibold mb-2 border-b pb-2">Builder</h2>
          <form onSubmit={handleSubmit(onFormSubmit)} className="mt-4">
            <SchemaList control={control} name="schema" />
            <Button type="submit" className="mt-4">
              Generate Schema
            </Button>
          </form>
        </div>
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-center mb-2 border-b pb-2">
            <h2 className="text-lg font-semibold">Live JSON Preview</h2>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy size={16} className="mr-2" />
              {isCopied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="bg-gray-900 text-white p-4 rounded-md mt-4 h-full sticky top-8">
            <pre>
              <code>{jsonString}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;