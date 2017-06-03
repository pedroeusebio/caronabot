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
    msg.push(handler.welcome(user.firstName, user.lastName));
    msg.push(handler.getOrigin());
    res.multipleResponse(msg ,sender);
    return await Conversation
      .findOneAndUpdate({_id: conversation._id},{...conversation._doc, state: 'get_origin'},{new:true})
      .then(doc => doc)
      .catch(err => err);
  }
  if(conversation.state == 'get_origin') {
    const location = handler.validateOrigin(message);
    msg.push(handler.originHandler(location, message, conversation.state));
    if(location) {
      msg.push(handler.getDestiny());
      const newConv = {...conversation._doc, origin: location, state: 'get_destiny'};
      await Conversation
        .findOneAndUpdate({_id: conversation._id}, newConv, {new:true})
        .then(doc => doc)
        .catch(err => err);
    }
    return res.multipleResponse(msg ,sender);
  }

  if(conversation.state == 'set_origin') {
    const location = handler.validateOrigin(message);
    msg.push(handler.originHandler(location, message, conversation.state));
    if(location) {
      const newConv = {...conversation._doc, origin: location, state: 'default'};
      await Conversation
        .findOneAndUpdate({_id: conversation._id}, newConv, {new:true})
        .then(doc => doc)
        .catch(err => err);
    }
    return res.multipleResponse(msg ,sender);
  }

  if(conversation.state == 'get_destiny'|| conversation.state == 'set_destiny') {
    const location = handler.validateDestiny(message);
    msg.push(handler.destinyHandler(location, message, conversation.state));
    if(location) {
      const newConv = {...conversation._doc, destiny: location, state: 'default'};
      await Conversation
        .findOneAndUpdate({_id: conversation._id}, newConv, {new:true})
        .then(doc => doc)
        .catch(err => err);
    }
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
      msg.push(handler.setOrigin());
      await Conversation
        .findOneAndUpdate({_id: conversation._id}, {...conversation._doc, state: 'set_origin'}, {new:true})
        .then(doc => doc)
        .catch(err => err);
    } else if( payload == 'CHANGE_DESTINY_PAYLOAD') {
      msg.push(handler.setDestiny());
      await Conversation
        .findOneAndUpdate({_id: conversation._id}, {...conversation._doc, state: 'set_destiny'}, {new:true})
        .then(doc => doc)
        .catch(err => err);
    }
    return res.multipleResponse(msg, sender);
  } else {
    if(conversation.state == 'get_destiny' || conversation.state == 'set_destiny') {
      const location = handler.validateDestiny(payload);
      msg.push(handler.destinyHandler(location, payload, conversation.state));
      if(location) {
        const newConv = {...conversation._doc, destiny: location, state: 'default'};
        await Conversation
          .findOneAndUpdate({_id: conversation._id}, newConv, {new:true})
          .then(doc => doc)
          .catch(err => err);
      }
      return res.multipleResponse(msg, sender);
    } else {
      msg.push(handler.errorHandler(conversation.state, payload));
      await Conversation
        .findOneAndUpdate({_id: conversation._id}, {...conversation._doc, state: 'default'}, {new:true})
        .then(doc => doc)
        .catch(err => err);
      return res.multipleResponse(msg, sender);
    }
  }
}


export default {
  handlerMessage,
  handlerPostback,
  get_or_create
};
