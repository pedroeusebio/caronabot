const readline = require('readline');
import conversation from './conversation';

const sender = 1421946534519946;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function cli(sender) {
    rl.on('line', async (answer) => {
        const chat = await conversation.get_or_create(sender);
        conversation.response(answer, chat.recipient_id, chat);
    });
}

cli(sender);
