import { Router } from 'express';
import { Database } from '@/database';
import * as schema from './schema';
import buildRepository from './repository';

export default (db: Database) => {
  const router = Router();
  const sprints = buildRepository(db);

  router
    .route('/')
    .get(async (_, res) => {
      try {
        const result = await sprints.findAll();

        res.status(200).json(result);
      } catch (e) {
        res.status(400).send('Unable to get sprints.');
      }
    })
    .post(async (req, res) => {
      try {
        const body = schema.parseInsertable(req.body);

        const sprintsFound = await sprints.findBySprintCode(body.sprintCode);

        if (sprintsFound.length !== 0) {
          res.status(400).send('Sprint already exists.');
        } else {
          await sprints.create(body);
          res.status(201).send('New sprint created successfully.');
        }
      } catch (e) {
        res.status(400).send('Unable to create a new sprint.');
      }
    });

  router
    .route('/:id(\\d+)')
    .get(async (req, res) => {
      try {
        const id = schema.parseId(req.params.id);
        const result = await sprints.findById(id);

        res.status(200).json(result);
      } catch (e) {
        res.status(500).send('Unable to get the sprint.');
      }
    })
    .patch(async (req, res) => {
      try {
        const id = schema.parseId(req.params.id);
        const bodyPatch = schema.parseUpdateable(req.body);
        const record = await sprints.update(id, bodyPatch);

        res.status(200).json(record);
      } catch (e) {
        res.status(500).send('Unable to update the sprint');
      }
    })
    .delete(async (req, res) => {
      try {
        const id = schema.parseId(req.params.id);
        await sprints.remove(id);

        res.status(200).send('Sprint deleted.');
      } catch (e) {
        res.status(500).send('Unable to delete the sprint.');
      }
    });

  return router;
};
