import nats from 'node-nats-streaming';

console.clear();
//test relies on skaffold & port forwarding running
//port forwarding TEMPORARY from cluster command: 
//1. kubectl get pods to find nats-depl pod
//2. kubectl port-forward nats-depl-.....whatever 4222:4222

//kubectl port-forward nats-depl-54b7c99874-rkjq8 4222:4222

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const data = JSON.stringify({
    id: '123',
    title: 'concerto',
    price: 20
  });

  stan.publish('ticket:created', data, () => {
    console.log('event published');
  });

})