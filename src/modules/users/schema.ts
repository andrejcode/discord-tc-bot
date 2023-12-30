import { z } from 'zod';
import type { Users } from '@/database';

// Validation schema
type Record = Users;
const schema = z.object({
  id: z.coerce.number().int().positive(),
  username: z.coerce.string().min(1).max(50),
});

const insertable = schema.omit({
  id: true,
});

const updateable = insertable.partial();

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseUsername = (username: unknown) =>
  schema.shape.username.parse(username);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdateable = (record: unknown) => updateable.parse(record);

// Ensures there are no additional keys in the schema
export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
