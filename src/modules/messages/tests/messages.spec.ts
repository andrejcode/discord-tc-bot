import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { Insertable } from 'kysely';
import { createFor } from '@tests/utils/records';
import createApp from '@/app';
import { Messages, Sprints, Users, UsersMessages } from '@/database';

const db = await createTestDatabase();
const app = createApp(db);

const createSprints = createFor(db, 'sprints');
const createMessages = createFor(db, 'messages');
const createUsers = createFor(db, 'users');
const createUsersMessages = createFor(db, 'usersMessages');

afterAll(() => db.destroy());

describe('GET /messages', () => {
  it('should return a defined response body', async () => {
    const { body } = await supertest(app).get('/messages').expect(200);
    expect(body).toBeDefined();
  });

  it('should return message for the sprint', async () => {
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

    const { body } = await supertest(app)
      .get('/messages')
      .query({ sprint: 'WD-TEST' })
      .expect(200);

    expect(body.id).toEqual(999);
    expect(body).toBeDefined();

    await db
      .deleteFrom('sprints')
      .where('sprintCode', '=', 'WD-TEST')
      .execute();

    await db.deleteFrom('messages').where('id', '=', 999).execute();
  });

  it('should return message for the user', async () => {
    const message: Insertable<Messages> = {
      id: 999,
      message: 'Some message',
    };
    await createMessages(message);

    const user: Insertable<Users> = {
      id: 999,
      username: 'testuser',
    };
    await createUsers(user);

    const usersMessages: Insertable<UsersMessages> = {
      userId: 999,
      messageId: 999,
    };
    await createUsersMessages(usersMessages);

    const { body } = await supertest(app)
      .get('/messages')
      .query({ username: 'testuser' })
      .expect(200);

    expect(body).toEqual([{ id: 999, message: 'Some message' }]);
    expect(body).toBeDefined();

    await db.deleteFrom('usersMessages').where('userId', '=', 999).execute();
    await db.deleteFrom('messages').where('id', '=', 999).execute();
    await db.deleteFrom('users').where('id', '=', 999).execute();
  });
});

describe('POST /messages', () => {
  it('should return 400 if no body provided', async () => {
    const { text } = await supertest(app).post('/messages').expect(400);
    expect(text).toEqual('No payload provided.');
  });

  it('should create a new message', async () => {
    const { text } = await supertest(app)
      .post('/messages')
      .send({ message: 'New message' })
      .expect(201);

    expect(text).toEqual('Message successfully created.');

    await db
      .deleteFrom('messages')
      .where('message', '=', 'New message')
      .execute();
  });

  it('should return 400 when sprint code does not exist', async () => {
    const { text } = await supertest(app)
      .post('/messages')
      .send({ username: 'user', sprintCode: 'NON_EXISTING_SPRINT_CODE' })
      .expect(400);

    expect(text).toEqual('Unable to send message on Discord.');
  });
});

describe('GET /messages/:id', () => {
  it('should return message by id', async () => {
    const message: Insertable<Messages> = {
      id: 999,
      message: 'Some message',
    };
    await createMessages(message);

    const { body } = await supertest(app).get('/messages/999').expect(200);

    expect(body.id).toEqual(999);

    await db.deleteFrom('messages').where('id', '=', 999).execute();
  });
});

describe('PATCH /messages/:id', () => {
  it('should patch the message', async () => {
    const message: Insertable<Messages> = {
      id: 999,
      message: 'Some message',
    };
    await createMessages(message);

    const { body } = await supertest(app)
      .patch('/messages/999')
      .send({ message: 'Some patched message' })
      .expect(200);

    expect(body).toEqual({ id: 999, message: 'Some patched message' });

    await db.deleteFrom('messages').where('id', '=', 999).execute();
  });
});

describe('DELETE /messages/:id', () => {
  it('should delete the message', async () => {
    const message: Insertable<Messages> = {
      id: 999,
      message: 'Some messages',
    };
    await createMessages(message);

    const { text } = await supertest(app).delete('/messages/999').expect(200);

    expect(text).toEqual('Message deleted.');
  });

  it('should not be able to remove message if it is used in sprints', async () => {
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

    const { text } = await supertest(app).delete('/messages/999').expect(400);
    expect(text).toEqual('Unable to delete the message.');

    await db
      .deleteFrom('sprints')
      .where('sprintCode', '=', 'WD-TEST')
      .execute();

    await db.deleteFrom('messages').where('id', '=', 999).execute();
  });
});
