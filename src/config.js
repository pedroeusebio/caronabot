 const config = {
  "persistent_menu":[
    {
      "locale":"default",
      "composer_input_disabled":false,
      "call_to_actions":[
        {
      		"title": "Minhas Caronas",
      		"type" : "nested",
      		"call_to_actions": [
      			{
            	"title":"Listar Caronas",
            	"type":"postback",
            	"payload":"GET_CARONA_PAYLOAD"
            },
            {
            	"title":"Adicionar Carona",
            	"type":"postback",
            	"payload":"ADD_CARONA_PAYLOAD"
            },
	          {
	            "title":"Remover Carona",
	            "type":"postback",
	            "payload":"REMOVE_CARONA_PAYLOAD"
	          },
	          {
	            "title":"Pedidos Pendentes",
	            "type":"postback",
	            "payload":"ACCEPT_USER_PAYLOAD"
	          },
      		]
        },
        {
          "title":"Alterar Origem",
          "type":"postback",
          "payload":"CHANGE_ORIGIN_PAYLOAD"
        },
        {
          "title":"Alterar Destino",
          "type":"postback",
          "payload":"CHANGE_DESTINY_PAYLOAD"
        }
      ]
    },
  ],
   "get_started": {
     "payload" :'GET_STARTED_PAYLOAD'
   }
  };

export default config;
