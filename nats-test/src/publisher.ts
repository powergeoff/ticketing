import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher'

console.clear();
//test relies on skaffold & port forwarding running
//port forwarding TEMPORARY from cluster command: 
//1. kubectl get pods to find nats-depl pod
//2. kubectl port-forward nats-depl-.....whatever 4222:4222

//kubectl port-forward nats-depl-54b7c99874-rkjq8 4222:4222

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'SB Live',
      price: 25
    });
  } catch(err){
    console.error(err)
  }
  

})