import { Router } from 'express';
import { Client } from 'discord.js';
import { Database } from '@/database';
import buildRepository from './repository';
import buildSprintsRepository from '../sprints/repository';
import buildUsersRepository from '../users/repository';
import buildUsersMessagesRepository from '../users-messages/repository';
import * as schema from './schema';
import * as sprintSchema from '../sprints/schema';
import * as usersSchema from '../users/schema';
import * as usersMessagesSchema from '../users-messages/schema';
import fetchGif from '@/api/tenor';
import { sendMessage } from '@/api/discord';

export default (db: Database, discordClient: Client) => {
  const router = Router();
  const messages = buildRepository(db);
  const sprints = buildSprintsRepository(db);
  const users = buildUsersRepository(db);
  const usersMessages = buildUsersMessagesRepository(db);

  router
    .route('/')
    .get(async (req, res) => {
      const { sprint, username } = req.query;

      if (sprint) {
        try {
          const parsedSprintCode = sprintSchema.parseSprintCode(sprint);
          const sprintResult = await sprints.findBySprintCode(parsedSprintCode);

          const { messageId } = sprintResult[0];
          const result = await messages.findById(messageId);
          res.status(200).json(result);
        } catch (e) {
          res.status(400).send('Unable to get messages for sprint.');
        }
      } else if (username) {
        try {
          const parsedUsername = usersSchema.parseUsername(username);
          const result = await users.findByUsername(parsedUsername);

          const userId = usersSchema.parseId(result[0].id);

          if (userId) {
            const usersMessagesResult =
              await usersMessages.findAllByUserId(userId);

            if (usersMessagesResult) {
              const messageIds: number[] = usersMessagesResult.map(
                (item) => item.messageId
              );
              const messageResult = await messages.findByIds(messageIds);

              res.status(200).json(messageResult);
            } else {
              throw new Error('No messages for the user.');
            }
          } else {
            throw new Error('User not found.');
          }
        } catch (e) {
          res.status(400).send('Unable to get message for the user');
        }
      } else {
        try {
          const result = await messages.findAll();
          res.status(200).json(result);
        } catch (e) {
          res.status(400).send('Unable to get messages.');
        }
      }
    })
    .post(async (req, res) => {
      const { username, sprintCode, message } = req.body;

      if (username && sprintCode) {
        try {
          const parsedUsername = usersSchema.parseUsername(username);
          const result = await users.findByUsername(parsedUsername);
          let userId;

          if (result.length === 0) {
            const body = usersSchema.parseInsertable({ username });
            const newUser = await users.create(body);

            userId = newUser?.id;
          } else {
            userId = usersSchema.parseId(result[0].id);
          }

          const sprintResult = await sprints.findBySprintCode(sprintCode);
          const { sprintTitle, messageId } = sprintResult[0];

          const userAndSprintTitleMessage = `${username} successfully completed the sprint ${sprintTitle}.\n`;
          const messageObject = await messages.findById(messageId);
          const tenorGif = await fetchGif();

          if (messageObject) {
            let combinedMessage =
              userAndSprintTitleMessage + messageObject.message;
            if (tenorGif) {
              combinedMessage += `\n${tenorGif}`;
            }

            sendMessage(discordClient, combinedMessage);
          }

          const record = usersMessagesSchema.parseInsertable({
            messageId,
            userId,
          });
          await usersMessages.create(record);

          res.status(200).send('Sending message on Discord.');
        } catch (e) {
          res.status(400).send('Unable to send message on Discord.');
        }
      } else if (message) {
        try {
          const body = schema.parseInsertable({ message });
          await messages.create(body);
          res.status(201).send('Message successfully created.');
        } catch (e) {
          res.status(400).send('Unable to create a new message.');
        }
      } else {
        res.status(400).send('No payload provided.');
      }
    });

  router
    .route('/:id(\\d+)')
    .get(async (req, res) => {
      try {
        const id = schema.parseId(req.params.id);
        const result = await messages.findById(id);
        res.status(200).json(result);
      } catch (e) {
        res.status(400).send('Unable to get the message.');
      }
    })
    .patch(async (req, res) => {
      try {
        const id = schema.parseId(req.params.id);
        const bodyPatch = schema.parseUpdateable(req.body);
        const record = await messages.update(id, bodyPatch);
        res.status(200).json(record);
      } catch (e) {
        res.status(400).send('Unable to update the message.');
      }
    })
    .delete(async (req, res) => {
      try {
        const id = schema.parseId(req.params.id);
        await messages.remove(id);
        res.status(200).send('Message deleted.');
      } catch (e) {
        res.status(400).send('Unable to delete the message.');
      }
    });

  return router;
};
