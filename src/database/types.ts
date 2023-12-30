import type { ColumnType } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Messages {
  id: Generated<number>;
  message: string;
}

export interface Sprints {
  id: Generated<number>;
  messageId: number;
  sprintCode: string;
  sprintTitle: string;
}

export interface Users {
  id: Generated<number>;
  username: string;
}

export interface UsersMessages {
  id: Generated<number>;
  messageId: number;
  userId: number;
}

export interface DB {
  messages: Messages;
  sprints: Sprints;
  users: Users;
  usersMessages: UsersMessages;
}
