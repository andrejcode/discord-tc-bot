import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { Insertable } from 'kysely';
import { createFor } from '@tests/utils/records';
import createApp from '@/app';
import { Messages } from '@/database';

const db = await createTestDatabase();
const app = createApp(db);

const createMessages = createFor(db, 'messages');

afterAll(() => db.destroy());

describe('GET /sprints', () => {
  it('should return a defined response body', async () => {
    const { body } = await supertest(app).get('/sprints').expect(200);
    expect(body).toBeDefined();
  });
});

describe('POST /sprints', () => {
  it('should create a new sprint', async () => {
    const message: Insertable<Messages> = {
      id: 999,
      message: 'Some message',
    };
    await createMessages(message);

    const { text } = await supertest(app)
      .post('/sprints')
      .send({ messageId: 999, sprintCode: 'TEST', sprintTitle: 'Test title' })
      .expect(201);

    expect(text).toEqual('New sprint created successfully.');

    await db.deleteFrom('sprints').where('sprintCode', '=', 'TEST').execute();
    await db.deleteFrom('messages').where('id', '=', 999).execute();
  });
});
