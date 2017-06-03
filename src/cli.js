import readline from 'readline';
import conversation from './conversation';

const sender = 1421946534519946;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function cli(sender) {
    rl.on('line', async (answer) => {
        const chat = await conversation.get_or_create(sender);
      if(answer == '1') {
        conversation.handlerPostback("CHANGE_ORIGIN_PAYLOAD", chat.recipient_id, chat);
      } else if(answer == '2') {
        conversation.handlerPostback("CHANGE_DESTINY_PAYLOAD", chat.recipient_id, chat);
      } else {
        conversation.handlerMessage(answer, chat.recipient_id, chat);
      }
    });
}

cli(sender);
