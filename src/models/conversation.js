import db from '../db.js';
import User from './user';
import mongoose from 'mongoose';

const ValidationError = mongoose.Error.ValidationError;
const ValidatorError = mongoose.Error.ValidatorError;

const conversationSchema = db.Schema({
  recipient_id: String,
  user_id: {
    type: db.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  state: String,
  origin: {
    type : String,
    enum: [
      'barra/recreio',
      'caxias',
      'freguesia/jacarepagua',
      'ilha do governador',
      'meier/cachambi'
    ]
  },
  destiny:{
    type: String,
    enum: [
      'FUNDAO'
    ]
  }
});

const Conversation = db.model('Conversation', conversationSchema);

export default Conversation;
