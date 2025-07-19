// This defines the allowed types for a field
export type FieldType = "String" | "Number" | "Nested";

// This defines the structure of a single field in our schema array
export interface SchemaField {
  keyName: string;
  type: FieldType;
  children?: SchemaField[];
}

// This defines the overall shape of our form's data
export interface FormValues {
  schema: SchemaField[];
}