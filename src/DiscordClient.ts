import { Client, Message, CollectorFilter } from 'discord.js';

export class DiscordClient {
  client: Client;
  handleMessage: (message: Message) => void;

  constructor() {
    this.client = new Client({
      partials: ['REACTION', 'MESSAGE'],
    });

    this.client.on('message', (message) => {
      // ignore other bots
      if (message.author.bot) return;

      // only admins can manage rules
      if (!message.member?.hasPermission('ADMINISTRATOR')) return;

      // ignore invalid prefixes
      if (message.content.slice(0, 2) !== 'z!') return;

      const content = message.content.slice(2);
      const [command, ...args] = content.split(' ');

      if (command === 'add') {
        console.log('want to add a rule: ', args);
      } else if (command === 'remove') {
        console.log('want to remove a rule');
      } else if (command === 'help') {
        message.reply('I need to implement the help. Yup.');

        const filter: CollectorFilter = (reaction, user) => {
          return (
            ['✅', '❌'].includes(reaction.emoji.name) &&
            user.id === message.author.id
          );
        };

        message.react('✅');
        message.react('❌');

        message
          .awaitReactions(filter, {
            max: 1,
            time: 60000,
            errors: ['time'],
          })
          .then((collected) => {
            const reaction = collected.first();

            if (reaction?.emoji.name === '✅') {
              message.reply('The post has been accepted.');
            } else {
              message.reply('The post has been rejected.');
            }
          })
          .catch(() => {
            message.reply(
              'you reacted with neither a thumbs up, nor a thumbs down.'
            );
          });
      }
    });
  }

  async connect(): Promise<void> {
    await this.client.login(process.env.DISCORD_TOKEN);
  }
}
