import mongoose from 'mongoose';
import bluebird from 'bluebird';
import env from 'dotenv';

env.config({silent: true});

mongoose.Promise = bluebird;

const conString = `${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}`;

mongoose.connect(process.env.NODE_ENV == 'production'?  conString : '127.0.0.1:27017/caronabot');

const db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    // we're connected!
});

export default mongoose;
