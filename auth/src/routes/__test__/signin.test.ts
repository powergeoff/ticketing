import request from 'supertest';
import {app} from '../../app';

it('fails when an email that doesn\'t exist is supplied', async () => {
  await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: 'password'
  })
  .expect(400)
});

it('fails when an incorrect pwd is supplied', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'password'
  })
  .expect(201)

  await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: 'passwordy'
  })
  .expect(400)
})

it('responds with a cookie if good creds', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'password'
  })
  .expect(201)

  const response = await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: 'password'
  })
  .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined();
})