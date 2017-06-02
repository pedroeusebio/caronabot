import api from '../api';
import FuzzySet from 'fuzzyset';

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

function validateOrigin(message) {
  const validateMsg = message.toLowerCase();
  const valid = FuzzySet(Object.keys(origins));
  const result = valid.get(validateMsg);
  if(result) {
    return result[0][0] >= 0.6 ? origins[result[0][1]] : null;
  } else {
    return null;
  }
}

function getOrigin() {
  return api
    .textResponse('Para comecar, preciso saber onde voce mora ou costuma pegar as caronas. Aqui vai uma lista de opcoes:',
                  originOptions);
}

function originHandler(location, message, state) {
  if(location) {
    if(state == 'get_origin') {
      return api
        .textResponse(`Sério ?! Minha ex mora la no ${location}. Se você precisar trocar o local de origem é só escrever ORIGEM`);
    }
  } else {
    return api
      .textResponse(`Não possuimos disponibilidade para ${message}. Tente algum desses lugares:`,
                    originOptions);
  }
}


export default {
  getOrigin,
  validateOrigin,
  originHandler
};
