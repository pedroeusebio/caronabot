import botBuilder from 'claudia-bot-builder';
import Conversation from './models/conversation';
import User from './models/user';
import FuzzySet from 'fuzzyset';
import res from './response';
import handler from './handler';

const fbTemplate = botBuilder.fbTemplate;

async function get_or_create(sender) {
  const conversation = await Conversation
        .findOne({recipient_id : sender})
        .populate('user_id')
        .then((doc) => {
          return doc;
        })
        .catch(err => err);
  if(!conversation) {
    const user = await res.get_user(sender);
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

async function handlerMessage(message, sender, conversation) {
  const user = await User.findOne({id: sender}).then(doc => doc).catch(err=> err);
  let msg = [];
  if(conversation.state == "welcome"){
    msg = handler.welcome(user, conversation);
    return res.multipleResponse(msg ,sender);
  }

  if(conversation.state == 'get_origin' || conversation.state == 'set_origin') {
    msg = handler.originHandler(message, conversation);
    return res.multipleResponse(msg ,sender);
  }

  if(conversation.state == 'get_destiny'|| conversation.state == 'set_destiny') {
    msg.push(handler.destinyHandler(message, conversation));
    return res.multipleResponse(msg, sender);
  }

  msg.push(handler.error(user.firstName));
  res.multipleResponse(msg, sender);
  return 'Success';
}

async function handlerPostback(payload, sender, conversation) {
  const user = await User.findOne({id: sender}).then(doc => doc).catch(err=> err);
  let msg = [];
  if(conversation.state == 'default') {
    if(payload == "CHANGE_ORIGIN_PAYLOAD") {
      msg.push(handler.setOrigin(conversation));
    } else if( payload == 'CHANGE_DESTINY_PAYLOAD') {
      msg.push(handler.setDestiny(conversation));
    }
    return res.multipleResponse(msg, sender);
  } else {
    if(conversation.state == 'get_destiny' || conversation.state == 'set_destiny') {
      msg.push(handler.destinyHandler(payload, conversation));
      return res.multipleResponse(msg, sender);
    } else {
      msg.push(handler.errorHandler(payload, conversation));
      return res.multipleResponse(msg, sender);
    }
  }
}


export default {
  handlerMessage,
  handlerPostback,
  get_or_create
};
