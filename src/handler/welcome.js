import api from '../api';
import origin from './origin';

function welcome(user, conversation) {
  return [
    api.textResponse(`Olá ${user.firstName} ${user.lastName}! Espero poder te ajudar a encontrar muitas caronas`),
    origin.getOrigin(conversation)
  ];
}


export default {
  welcome
};
