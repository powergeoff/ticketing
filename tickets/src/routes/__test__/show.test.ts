import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

//test for /api/tickets/:id

it ('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
  .get(`/api/tickets/${id}`)
  .send()
  .expect(404);

});

it ('returns the ticket if it is found', async () => {
  const title = 'Stray Bullets - Midway';
  const price = 5;

  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title, price
  })
  .expect(201);

  const ticketResponse = await request(app)
  .get(`/api/tickets/${response.body.id}`)
  .send()
  .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
  //console.log(ticketResponse.body)
});