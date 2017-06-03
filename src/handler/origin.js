import api from '../api';
import FuzzySet from 'fuzzyset';
import {goto} from  '../state';
import destiny from './destiny';

const originOptions = [
  {label: 'barra/recreio', value: 'barra/recreio'},
  {label: 'caxias', value: 'caxias'},
  {label: 'freguesia/jacarepagua', value: 'freguesia/jacarepagua'},
  {label: 'ilha do governador', value: 'ilha do governador'},
  {label: 'meier/cachambi', value: 'meier/cachambi'},
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

function getOrigin(conversation) {
  goto(conversation._id, 'get_origin', conversation._doc);
  return api
    .textResponse('Para começar, preciso saber onde você mora ou costuma pegar as caronas. Aqui vai uma lista de opções:',
                  originOptions);
}

function setOrigin(conversation) {
  goto(conversation._id, 'set_origin', conversation._doc);
  return api
    .textResponse('Para qual origem você deseja mudar ? Aqui vai uma lista de opções :',
                  originOptions);
}

function originHandler(message, conversation) {
  const location = validateOrigin(message);
  if(location) {
    const newConv = {...conversation._doc, origin: location};
    if(conversation.state == 'get_origin') {
      return [
        api.textResponse(`Sério ?! Minha ex mora la no ${location}. Se você precisar trocar o local de origem é só escrever ORIGEM`),
              destiny.getDestiny(newConv)
      ];
    }
    if(conversation.state == 'set_origin') {
      goto(conversation._id, 'default', newConv);
      return [
        api.textResponse(`Beleza ! Sua nova origem é ${location}`)
      ];
    }
  } else {
    return [
      api.textResponse(`Não possuimos disponibilidade para ${message}. Tente algum desses lugares:`,
                       originOptions)
    ];
  }
}


export default {
  getOrigin,
  setOrigin,
  validateOrigin,
  originHandler
};
