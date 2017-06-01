import db from '../db.js';

const userSchema = db.Schema({
  id: String,
  firstName: String,
  lastName: String,
  profilePic: String,
  locale: String,
  timezone : Number,
  gender : {
    type : String,
    enum : [
      'male',
      'female',
    ]
  }
});

const User = db.model('User', userSchema);

export default User;
