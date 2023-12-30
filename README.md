# Turing College Discord Bot

## Introduction

Discord Bot that congratulates you when you finish a sprint at Turing College.

## Getting Started

- Create your discord bot application and add it to your server. You can visit [Setting up a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) and [Adding your bot to server](https://discordjs.guide/preparations/adding-your-bot-to-servers.html) for more details.

- Add your environment variables to the .env file. You can see the examples in .env.example file.

- Run `npm install` to install all node modules.

## Endpoints

- `GET /messages` - Get a list of all congratulatory messages.
- `POST /messages` - Send a congratulatory message to a user on Discord or create a new message depending on the body.
- `GET /messages?username=johdoe` - get a list of all congratulatory messages for a specific user
- `GET /messages?sprint=WD-1.1` - get a list of all congratulatory messages for a specific sprint
- `GET/PATCH/DELETE /messages/:id` - Get, update, and delete a message by id.
- `GET /sprints` - Get a list of all the sprints.
- `POST /sprints` - Create a new sprint.
- `GET/PATCH/DELETE /sprints/:id` - Get, update, and delete a sprint by id.
