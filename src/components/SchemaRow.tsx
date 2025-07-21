import { Controller, useWatch } from 'react-hook-form';
import type { Control, UseFieldArrayRemove, FieldArrayWithId } from 'react-hook-form'; // Import FieldArrayWithId
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { FormValues, SchemaField } from '@/types'; // Import SchemaField
import { SchemaList } from './SchemaList';
import { GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type FieldPath =
  | `schema.${number}`
  | `schema.${number}.children.${number}`; // Simplified for clarity

interface SchemaRowProps {
  fieldId: string;
  control: Control<FormValues>;
  remove: UseFieldArrayRemove;
  fieldPath: FieldPath;
  index: number;
  // Prop to pass sibling fields for uniqueness validation
  fields: FieldArrayWithId<FormValues, any, 'id'>[];
}

export const SchemaRow = ({ fieldId, control, remove, fieldPath, index, fields }: SchemaRowProps) => {
  // Watch the 'type' dropdown for this specific row
  const currentType = useWatch({
    control,
    name: `${fieldPath}.type` as any,
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: fieldId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="mb-2 p-4 bg-white">
        <div className="flex items-center space-x-2">
          <div {...attributes} {...listeners} className="cursor-grab touch-none p-1">
            <GripVertical size={18} className="text-gray-400" />
          </div>
          <Controller
            name={`${fieldPath}.keyName`}
            control={control}
            rules={{
              required: 'Field name is required.',
              validate: {
                unique: (value) => {
                  // Find if another field at this level has the same name
                  const isDuplicate = fields.some(
                    (field, i) => i !== index && field.keyName === value
                  );
                  return isDuplicate ? 'Field name must be unique.' : true;
                },
              },
            }}
            // Destructure fieldState to get the error object
            render={({ field, fieldState: { error } }) => (
              <div className="flex-grow">
                <Input
                  placeholder="Field Name"
                  {...field}
                  value={typeof field.value === 'string' ? field.value : ''}
                />
                {/* Display the error message if it exists */}
                {error && (
                  <p className="text-xs text-red-500 mt-1">{error.message}</p>
                )}
              </div>
            )}
          />
          <Controller
            name={`${fieldPath}.type`}
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
        {currentType === 'Nested' && (
          <div className="mt-4">
            {/* Corrected the name prop to handle deep nesting */}
            <SchemaList control={control} name={`${fieldPath}.children`} />
          </div>
        )}
      </Card>
    </div>
  );
};