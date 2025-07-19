import { Controller, useWatch } from 'react-hook-form';
import type { Control, UseFieldArrayRemove } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { FormValues } from '@/types';
import { SchemaList } from './SchemaList';

type FieldPath =
  | 'schema'
  | `schema.${number}`
  | `schema.${number}.type`
  | `schema.${number}.keyName`
  | `schema.${number}.children`;

interface SchemaRowProps {
  control: Control<FormValues>;
  remove: UseFieldArrayRemove;
  fieldPath: FieldPath;
  index: number;
}

export const SchemaRow = ({ control, remove, fieldPath, index }: SchemaRowProps) => {
  // Watch the 'type' dropdown for this specific row
  const currentType = useWatch({
    control,
    name: `${fieldPath}.type` as FieldPath,
  });

  return (
    <Card className="mb-2 p-4 bg-white">
      <div className="flex items-center space-x-2">
        <Controller
          name={`${fieldPath}.keyName` as FieldPath}
          control={control}
          render={({ field }) => <Input placeholder="Field Name" {...field} value={typeof field.value === 'string' ? field.value : ''} />}
        />
        <Controller
          name={`${fieldPath}.type` as FieldPath}
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={typeof field.value === 'string' ? field.value : ''}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="String">String</SelectItem>
                <SelectItem value="Number">Number</SelectItem>
                <SelectItem value="Nested">Nested</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
          X
        </Button>
      </div>
      {/* --- RECURSIVE PART --- */}
      {currentType === 'Nested' && (
        <div className="mt-4">
          <SchemaList control={control} name={`schema.${index}.children`} />
        </div>
      )}
    </Card>
  );
};