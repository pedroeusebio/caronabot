import rp from 'request-promise';
import R from 'ramda';
const url = `https://graph.facebook.com/v2.9/me/messages?access_token=${process.env.PAGE_TOKEN}`;


const headers = {
  'Content-Type': 'application/json'
};


async function messengerResponse(content, recipient_id) {
  const options = {
    url : url,
    method : 'POST',
    headers : headers,
    json: {
      recipient: {
        id: recipient_id
      },
      message: content
    }
  };
  return await rp(options)
    .then(response => response)
    .catch(err => err);
}

async function multipleResponse(arrayContent, recipient_id) {
  if(arrayContent.length > 1) {
    messengerResponse(arrayContent[0], recipient_id).then(res => {
      multipleResponse(R.slice(1, Infinity, arrayContent), recipient_id);
    });
  } else {
    messengerResponse(arrayContent[0], recipient_id).then(res => res);
  }
}

async function facebookSearch(recipient_id) {
  const urlUser = `https://graph.facebook.com/v2.9/${recipient_id}?access_token=${process.env.PAGE_TOKEN}`;
  const options = {
    url : urlUser,
    method : 'GET',
    headers : headers
  };

  return await rp(options)
    .then(response => JSON.parse(response))
    .catch(err => err);
}

export default {
  response: messengerResponse,
  multipleResponse: multipleResponse,
  get_user: facebookSearch
};
