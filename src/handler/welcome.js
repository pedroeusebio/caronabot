import api from '../api';

function welcome(firstName, lastName) {
  return api
    .textResponse(`Olá ${firstName} ${lastName}! Espero poder te ajudar a encontrar muitas caronas`);
}


export default {
  welcome
};
