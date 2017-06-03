import api from '../api';
import { goto } from '../state';


const stateToAction = {
  // "GET_CARONA_PAYLOAD": 'Listar Caronas',
  // "ADD_CARONA_PAYLOAD": 'Adicionar Carona',
  // "REMOVE_CARONA_PAYLOAD": 'Remover Carona',
  // "ACCEPT_USER_PAYLOAD": 'Pedidos Pendentes',
  "set_origin": 'Alterar Origem',
  "set_destiny": 'Alterar Destino'
};

const payloadToAction = {
  "GET_CARONA_PAYLOAD": 'Listar Caronas',
  "ADD_CARONA_PAYLOAD": 'Adicionar Carona',
  "REMOVE_CARONA_PAYLOAD": 'Remover Carona',
  "ACCEPT_USER_PAYLOAD": 'Pedidos Pendentes',
  "CHANGE_ORIGIN_PAYLOAD": 'Alterar Origem',
  "CHANGE_DESTINY_PAYLOAD": 'Alterar Destino'
};

const stateToPayload = {
  "set_origin":   "CHANGE_ORIGIN_PAYLOAD",
  "set_destiny": "CHANGE_DESTINY_PAYLOAD"
};

function error(firstName) {
  return api
    .textResponse(`Desculpe ${firstName}, não entendi o que você disse :(`);
}

function errorHandler(payload, conversation) {
  goto(conversation._id, 'default', conversation._doc);
  return api
    .buttonResponse(`você está executando a operacão de ${stateToAction[conversation.state]}. Gostaria de Cancelar e ir para ${payloadToAction[payload]} ?`,
                    [{label: 'Não', value: stateToPayload[conversation.state]}, {label: 'Sim', value: payload}]);
}


export default {
  error,
  errorHandler
};
