import { z } from 'zod';
import type { Sprints } from '@/database';

// Validation schema
type Record = Sprints;
const schema = z.object({
  id: z.coerce.number().int().positive(),
  sprintCode: z.coerce.string().min(1).max(10),
  sprintTitle: z.coerce.string().min(1).max(500),
  messageId: z.coerce.number().int().positive(),
});

const insertable = schema.omit({
  id: true,
});

const updateable = insertable.partial();

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseSprintCode = (sprintCode: unknown) =>
  schema.shape.sprintCode.parse(sprintCode);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdateable = (record: unknown) => updateable.parse(record);

// Ensures there are no additional keys in the schema
export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
