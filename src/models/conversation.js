import db from '../db.js';
import User from './user.js';
import mongoose from 'mongoose';

const ValidationError = mongoose.Error.ValidationError;
const ValidatorError = mongoose.Error.ValidatorError;

const conversationSchema = db.Schema({
    recipient_id: String,
    // user_id: {
    //     type: db.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    state: String,
    origin: String,
    destiny: String
});

// conversationSchema.pre('save', async function (next) {
//     const res =  await User
//           .findOne({_id: this.user_id._id})
//           .then(x => x)
//           .catch(err => ({error: err}));
//     (!res || res.error) ? next(res.error) : next();
// });
const Conversation = db.model('Conversation', conversationSchema);

export default Conversation;
