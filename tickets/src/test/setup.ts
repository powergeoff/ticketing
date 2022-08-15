
//import { request } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest'
import { app } from '../app';
import jwt from 'jsonwebtoken'

//globally scoped ONLY within the test tier or env
//process never hits here on normal execution
declare global {
  function signin(): string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'whatever';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
  }
);

global.signin = () => {
  //Build a jwt payload. { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }

  //Create the jwt!
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  //build session object { jwt: MY_JWT }
  const session = { jwt: token};

  //turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  //Take JSON and base64 encode it
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //return a string of the cookie with encoded data
  return [`session=${base64}`];
}

