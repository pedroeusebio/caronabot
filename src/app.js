import rp from 'request-promise';

const headers = {
  'Content-Type': 'application/json'
};


async function messengerResponse(content, recipient_id, url) {
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
    .then((response) => response)
    .catch((err) => err);
}

async function facebookSearch(recipient_id) {
}

const api = {
  response: messengerResponse
};


module.exports = api;

