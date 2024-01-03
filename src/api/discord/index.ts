/* eslint-disable no-console */
import 'dotenv/config';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';

const { TOKEN, CHANNEL_ID } = process.env;

export function createNewClient() {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });

  return client;
}

export function sendMessage(client: Client, message: string) {
  const channel = client.channels.cache.get(
    CHANNEL_ID as string
  ) as TextChannel;

  try {
    channel.send(message);
    console.log('Message sent on Discord channel.');
  } catch (e) {
    console.error('Unable to sent message on Discord channel.');
  }
}

export function loginClient(client: Client) {
  console.log('Logging client.');
  client.login(TOKEN);
}

export function logoutClient(client: Client) {
  console.log('Logging out client.');
  client.destroy();
}
