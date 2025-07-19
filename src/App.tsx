import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import type { FormValues, SchemaField } from './types';
import { SchemaList } from './components/SchemaList';

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

  // The onFormSubmit handler now uses the new transformer function
  const onFormSubmit = (data: FormValues) => {
    const finalSchemaObject = transformSchemaToJSON(data.schema);
    console.log("Final Generated Schema:", JSON.stringify(finalSchemaObject, null, 2));
  };

  const watchedValues = watch();

  // Transform the raw data in real-time for the preview
  const livePreviewJson = transformSchemaToJSON(watchedValues.schema);

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
          <h2 className="text-lg font-semibold mb-2 border-b pb-2">Live JSON Preview</h2>
          <div className="bg-gray-900 text-white p-4 rounded-md mt-4 h-full sticky top-8">
            <pre>
              {/* Use the transformed livePreviewJson object here */}
              <code>{JSON.stringify(livePreviewJson, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;