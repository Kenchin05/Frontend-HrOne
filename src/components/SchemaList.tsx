import { useFieldArray, type Control } from 'react-hook-form';
import { SchemaRow } from './SchemaRow';
import type { FormValues } from '@/types';
import { Button } from '@/components/ui/button';

interface SchemaListProps {
  control: Control<FormValues>;
  name: string; // Accept any string for compatibility
}

export const SchemaList = ({ control, name }: SchemaListProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="pl-6 border-l-2 border-gray-200">
      {fields.map((field, index) => (
        <SchemaRow
          key={field.id}
          control={control}
          remove={remove}
          // Pass the full path to the current field
          fieldPath={`${name}.${index}`} 
          index={index}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => append({ keyName: 'newNestedField', type: 'String' })}
      >
        Add Nested Field
      </Button>
    </div>
  );
};