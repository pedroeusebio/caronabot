import api from '../api';
import FuzzySet from 'fuzzyset';

const destinyOptions = [{label: 'UFRJ - Fundão', value: 'FUNDAO'}];
const destinies = {
  'fundao': 'FUNDAO',
  'ufrj': 'FUNDAO',
  'UFRJ - fundao' : 'FUNDAO'
};

function getDestiny() {
  return api
    .buttonResponse('Agora precisamos saber onde costuma ser o seu destino.Em breve iremos adicionar mais opcões',
                  destinyOptions);
}

function setDestiny() {
  return api
    .buttonResponse('Para qual destino você deseja mudar ? Aqui vai uma lista de opções :',
                  destinyOptions);
}

function validateDestiny(message) {
  const validateMsg = message.toLowerCase();
  const valid = FuzzySet(Object.keys(destinies));
  const result = valid.get(validateMsg);
  let location = null;
  if(result) {
    return result[0][0] >= 0.6 ? destinies[result[0][1]] : null;
  } else {
    return null;
  }
}

function destinyHandler(location, message, state) {
  if(location) {
    if(state == 'get_destiny') {
      return api.textResponse(`Ótimo! Agora você pode oferecer ou pegar carona sempre que precisar!`);
    }
    if(state == 'set_destiny') {
      return api.textResponse(`Show ! seu destino agora é ${location}`);
    }
  } else {
    return api.buttonResponse(`Não possuimos disponibilidade para ${message}. Tente algum desses lugares:`,
                                   destinyOptions);
  }
}


export default {
  getDestiny,
  setDestiny,
  validateDestiny,
  destinyHandler,
};
