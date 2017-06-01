import botBuilder from 'claudia-bot-builder';
import Conversation from './models/conversation';
import User from './models/user';
import FuzzySet from 'fuzzyset';
import app from './app';

const fbTemplate = botBuilder.fbTemplate;
const destinyOptions = [{label: 'UFRJ - Fundão', value: 'FUNDAO'}];
const destinies = {
  'fundao': 'FUNDAO',
  'ufrj': 'FUNDAO',
  'UFRJ - fundao' : 'FUNDAO'
};
const originOptions = [
  'barra/recreio',
  'caxias',
  'freguesia/jacarepagua',
  'ilha do governador',
  'meier/cachambi'
];
const origins = {
  'barra' : 'barra/recreio',
  'recreio': 'barra/recreio',
  'barra/recreio': 'barra/recreio',
  'caxias': 'caxias',
  'freguesia' : 'freguesia/jacarepagua',
  'jacarepagua': 'freguesia/jacarepagua',
  'freguesia/jacarepagua': 'freguesia/jacarepagua',
  'ilha': 'ilha do governador',
  'ilha do governador': 'ilha do governador',
  'meier' : 'meier/cachambi',
  'cachambi': 'meier/cachambi',
  'meier/cachambi': 'meier/cachambi'
};


async function get_or_create(sender) {
  const conversation = await Conversation
        .findOne({recipient_id : sender})
        .populate('user_id')
        .then((doc) => {
          return doc;
        })
        .catch(err => err);
  if(!conversation) {
    const user = await app.get_user(sender);
    const newUser = await new User({
      id: sender,
      firstName: user.first_name,
      lastName : user.last_name,
      profilePic : user.profile_pic,
      locale: user.locale,
      timezone: user.timezone,
      gender: user.gender
    })
          .save ()
          .then(doc => doc);
    const newConv = await new Conversation({
      recipient_id: sender,
      user_id : newUser._id,
      state: 'welcome'
    });
    const chat = await newConv
          .save()
          .then(doc => doc);
    return chat;
  } else {
    return conversation;
  }
}

async function response(message, sender, conversation) {
  const user = await User.findOne({id: sender}).then(doc => doc).catch(err=> err);
  let msg = [];
  if (conversation.state == "welcome") {
    msg.push(new fbTemplate
             .Text(`Olá ${user.firstName} ${user.lastName}! Espero poder te ajudar a encontrar muitas caronas`)
             .get());
    conversation.state = "initial";
  }
  if(conversation.state == "initial"){
     const res = new fbTemplate
           .Text('Para comecar, preciso saber onde voce mora ou costuma pegar as caronas. Aqui vai uma lista de opcoes:');
    originOptions.forEach((el) => res.addQuickReply(el, el));
    msg.push(res.get());
    app.multipleResponse(msg ,sender);
    return await Conversation
      .findOneAndUpdate({_id: conversation._id},{...conversation._doc, state: 'get_origin'},{new:true})
      .then(doc => doc)
      .catch(err => err);
  }
  if(conversation.state == 'get_origin') {
    const validateMsg = message.toLowerCase();
    const valid = FuzzySet(Object.keys(origins));
    const result = valid.get(validateMsg);
    let location = null;
    if(result) {
      location = result[0][0] >= 0.6 ? origins[result[0][1]] : null;
    }
    if(location) {
      msg.push(new fbTemplate
      .Text(`Sério ?! Minha ex mora la no ${location}. Se você precisar trocar o local de origem é só escrever ORIGEM`)
      .get());
      const res = new fbTemplate
            .Button('Agora precisamos saber onde costuma ser o seu destino.Em breve iremos adicionar mais opcões');
      destinyOptions.forEach((el) => res.addButton(el.label, el.value));
      console.log(res.get());
      msg.push(res.get());
      const newConv = {...conversation._doc, origin: location, state: 'get_destiny'};
      await Conversation
        .findOneAndUpdate({_id: conversation._id}, newConv, {new:true})
        .then(doc => doc)
        .catch(err => err);
    } else {
      const res = new fbTemplate
            .Text(`Não possuimos disponibilidade para ${message}. Tente algum desses lugares:`);
      originOptions.forEach((el) => res.addQuickReply(el, el));
      msg.push(res.get());
    }
    return app.multipleResponse(msg ,sender);
  }
  if(conversation.state == 'get_destiny') {
    const validateMsg = message.toLowerCase();
    const valid = FuzzySet(Object.keys(destinies));
    const result = valid.get(validateMsg);
    let location = null;
    if(result) {
      location = result[0][0] >= 0.6 ? destinies[result[0][1]] : null;
      const newConv = {...conversation._doc, destiny: location, state: 'default'};
      await Conversation
        .findOneAndUpdate({_id: conversation._id}, newConv, {new:true})
        .then(doc => doc)
        .catch(err => err);
    msg.push(new fbTemplate
             .Text(`sua resposta foi ${location}`).get());
    } else {
      const res = new fbTemplate
            .Button(`Não possuimos disponibilidade para ${message}. Tente algum desses lugares:`);
      destinyOptions.forEach((el) => res.addButton(el.label, el.value));
      msg.push(res.get());
    }
    return app.multipleResponse(msg, sender);
  }

  let messaging = new fbTemplate.Text('não entendi o que voce disse :( ').get();
  app.response(messaging, sender);
  return 'Success';
}


module.exports = {
  response,
  get_or_create
};
