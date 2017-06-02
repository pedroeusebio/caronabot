import api from '../api';

function error(firstName) {
  return api
    .textResponse(`Desculpe ${firstName}, não entendi o que você disse :(`);
}


export default {
  error
};
