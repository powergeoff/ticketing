import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@pwrgtickets/common2';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';

const router = express.Router();

router.post('/api/tickets', 
requireAuth, 
[
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price')
  .isFloat({ gt: 0 })
  .withMessage('Price must be greater than 0')
],
validateRequest,
async (req: Request, res: Response) => {
  const { title, price } = req.body;

  const newTicket = Ticket.build({ 
    title, 
    price,
    userId: req.currentUser!.id
   });

   await newTicket.save();
   //publish elements from newTicket in mongoose NOT from request.body
   new TicketCreatedPublisher(client).publish({
    id: newTicket.id,
    title: newTicket.title,
    price: newTicket.price,
    userId: newTicket.userId,
   });

   res.status(201).send(newTicket);

});

export { router as createTicketRouter };