import { useFieldArray, type Control } from 'react-hook-form';
import { SchemaRow } from './SchemaRow';
import type { FormValues } from '@/types';
import { Button } from '@/components/ui/button';

type FieldPath =
  | 'schema'
  | `schema.${number}`
  | `schema.${number}.type`
  | `schema.${number}.keyName`
  | `schema.${number}.children`;

interface SchemaListProps {
  control: Control<FormValues>;
  name: 'schema' | `schema.${number}.children`;
}

export const SchemaList = ({ control, name }: SchemaListProps) => {
  // Only allow useFieldArray for 'schema' or 'schema.${number}.children'
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as 'schema', // Only 'schema' is allowed at the top level
  });

  return (
    <div className="pl-6 border-l-2 border-gray-200">
      {fields.map((field, index) => (
        <SchemaRow
          key={field.id}
          control={control}
          remove={remove}
          fieldPath={name === 'schema' ? `schema.${index}` : `${name}.${index}` as FieldPath}
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