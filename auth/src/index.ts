
import mongoose from 'mongoose';
import { app } from './app'

const start = async () => {
  if (!process.env.JWT_KEY){
    throw new Error('Secret JWT_KEY not defiined!!')
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('connected to mongo')
  } catch(err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('listening on 3000!')
  });
};

start();

