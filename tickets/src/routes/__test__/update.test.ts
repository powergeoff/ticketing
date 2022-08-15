import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the id doesn\'t exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
  .put(`/api/tickets/${id}`)
  .set('Cookie', global.signin())
  .send({
    title: 'aslkjdf',
    price:20
  })
  .expect(404);
});


it('returns a 401 if the user is not auth', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'aslkjdf',
      price:20
    })
    .expect(401);
});


it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'aslkjdf',
      price:20
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin()) //totally diff user
    .send({
      title: 'aslkjdf',
      price: 21
    })
    .expect(401);
  
});


it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  //create a ticket 
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'aslkjdf',
      price:20
    });
    //update with invalid title
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie) //same user
    .send({
      title: '',
      price: 20
    })
    .expect(400);
    //update with invalid price
    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie) //same user
    .send({
      title: 'aslkjdf',
      price: -20
    })
    .expect(400);
});


it('updates the ticket if things are good', async () => {
  const cookie = global.signin();
  //create a ticket 
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'aslkjdf',
      price:20
    });
    //edit with good params
    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie) //same user
    .send({
      title: 'New Title',
      price: 22 //always need to supply both price and title???
    })
    .expect(200);
    //go get the ticket and compare title and price to see if update worked
    const goodTicket = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send();

    expect(goodTicket.body.title).toEqual('New Title');
    expect(goodTicket.body.price).toEqual(22);
});