import rp from 'request-promise';

const headers = {
  'Content-Type': 'application/json'
};


async function messengerResponse(content, recipient_id, url) {
  const options = {
    url: url,
    method: 'POST',
    headers: headers,
    json: {
      recipient: {
        id: recipient_id
      },
      message: content
    }
  };
  console.log(url);
  return await rp(options)
    .then((response) => response)
    .catch((err) => err);
}

const api = {
  response: messengerResponse
};


export default api;
