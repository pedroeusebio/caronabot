import botBuilder from 'claudia-bot-builder';
import Conversation from './models/conversation';
import app from './app';

const fbTemplate = botBuilder.fbTemplate;


const url = `https://graph.facebook.com/v2.9/me/messages?access_token=${process.env.PAGE_TOKEN}`;


async function get_or_create(sender) {
    const conversation = await Conversation
          .findOne({recipient_id : sender})
          .populate('user_id')
          .then((doc) => {
              return doc;
          })
          .catch(err => err);
    if(!conversation) {
        const newConv = await new Conversation({
            recipient_id: sender,
            state: 'initial'
        });
        const chat = await newConv
            .save()
            .then(doc => doc);
        console.log(chat);
        return chat;
    } else {
        return conversation;
    }
}

async function response(message, sender, conversation) {
    app.response(new fbTemplate.ChatAction('typing_on').get(), sender, url);
    if (conversation.state == "initial") {
        let messaging = new fbTemplate
            .Text('olá ! Espero poder te ajudar a encontrar muitas caronas')
            .get();
        let messaging2 = new fbTemplate
            .Text('Para comecar, preciso saber onde voce mora ou costuma pegar as caronas. Aqui vai uma lista de opcoes:')
            .addQuickReply('Barra/Recreio','barra')
            .addQuickReply('Caxias', 'caxias')
            .get();
        conversation.state = 'get_origin';
        await Conversation
            .findOneAndUpdate({_id: conversation._id},conversation,{new:true})
            .then(doc => doc)
            .catch(err => console.log(err));
        app.response(messaging, sender, url)
            .then(response => {
                app.response(messaging2, sender, url);
            });
        return ;
    }
    if(conversation.state == 'get_origin') {
        let messaging = new fbTemplate
            .Text(`Sério ?! Minha ex mora la no ${message}. Se você precisar trocar o local de origem é só escrever ORIGEM`)
            .get();
        let messaging2 = new fbTemplate
            .Button('Agora precisamos saber onde costuma ser o seu destino.Em breve iremos adicionar mais opcões')
            .addButton('UFRJ - Fundão', 'FUNDAO')
            .get();
        const newConv = {...conversation._doc, origin: message, state: 'get_destiny'};
        await Conversation
            .findOneAndUpdate({_id: conversation._id}, newConv, {new:true})
            .then(doc => doc)
            .catch(err => console.log(err));
        app.response(messaging, sender, url)
            .then(response => {
                app.response(messaging2, sender, url);
            });
        return ;
    }

    let messaging = new fbTemplate.Text('não entendi o que voce disse :( ').get();
    // console.log(messaging);
    app.response(messaging, sender, url);
    return 'Success';
}



module.exports = {
    response,
    get_or_create
};

