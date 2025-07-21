import { useFieldArray, type Control } from 'react-hook-form';
import { SchemaRow } from './SchemaRow';
import type { FormValues } from '@/types';
import { Button } from '@/components/ui/button';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

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
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: name as 'schema', // Only 'schema' is allowed at the top level
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Find the old and new index of the items based on their unique IDs
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      move(oldIndex, newIndex);
    }
  };

return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {/* SortableContext manages the state for the sortable items */}
      <SortableContext items={fields} strategy={verticalListSortingStrategy}> 
    <div className="pl-6 border-l-2 border-gray-200">
      {fields.map((field, index) => (
        <SchemaRow
          key={field.id}
          fieldId={field.id}
          control={control}
          remove={remove}
          fieldPath={name === 'schema' ? `schema.${index}` : `${name}.${index}` as FieldPath}
          index={index}
          fields={fields}
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
    </SortableContext>
    </DndContext>
  );
};