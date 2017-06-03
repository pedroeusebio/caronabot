import Conversation from './models/conversation';

export async function goto(id, state, object) {
  return await Conversation
    .findOneAndUpdate({_id: id}, {...object, state: state}, {new: true})
    .then(res => res)
    .catch(err => err);
}

