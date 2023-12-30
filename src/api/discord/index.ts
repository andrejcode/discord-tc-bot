/* eslint-disable no-console */
import 'dotenv/config';
import { Client, Events, GatewayIntentBits, TextChannel } from 'discord.js';

const { TOKEN, CHANNEL_ID } = process.env;

function createNewClient() {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });

  return client;
}

function sendMessage(client: Client, message: string) {
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    const channel = readyClient.channels.cache.get(
      CHANNEL_ID as string
    ) as TextChannel;

    try {
      channel.send(message);
      console.log('Message sent');
    } catch (e) {
      console.error(e);
    } finally {
      console.log('Logging out');
      readyClient.destroy();
    }
  });
}

function loginClient(client: Client) {
  client.login(TOKEN);
}

export default function sendDiscordMessage(message: string): void {
  const client = createNewClient();
  loginClient(client);
  sendMessage(client, message);
}
