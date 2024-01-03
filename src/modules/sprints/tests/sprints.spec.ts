import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { Insertable } from 'kysely';
import { createFor } from '@tests/utils/records';
import createApp from '@/app';
import { Messages, Sprints } from '@/database';

const db = await createTestDatabase();
const app = createApp(db);

const createMessages = createFor(db, 'messages');
const createSprints = createFor(db, 'sprints');

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
      .send({
        messageId: 999,
        sprintCode: 'WD-TEST',
        sprintTitle: 'Test title',
      })
      .expect(201);

    expect(text).toEqual('New sprint created successfully.');

    await db
      .deleteFrom('sprints')
      .where('sprintCode', '=', 'WD-TEST')
      .execute();
    await db.deleteFrom('messages').where('id', '=', 999).execute();
  });

  it('should return 400 sprint already exists', async () => {
    const message: Insertable<Messages> = {
      id: 999,
      message: 'Some message',
    };
    await createMessages(message);

    const sprints: Insertable<Sprints> = {
      messageId: 999,
      sprintCode: 'WD-TEST',
      sprintTitle: 'Test Sprint Title',
    };
    await createSprints(sprints);

    const { text } = await supertest(app)
      .post('/sprints')
      .send({
        messageId: 999,
        sprintCode: 'WD-TEST',
        sprintTitle: 'Test title',
      })
      .expect(400);

    expect(text).toEqual('Sprint already exists.');

    await db
      .deleteFrom('sprints')
      .where('sprintCode', '=', 'WD-TEST')
      .execute();
    await db.deleteFrom('messages').where('id', '=', 999).execute();
  });
});
