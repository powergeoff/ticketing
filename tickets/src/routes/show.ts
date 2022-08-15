import express, {Request, Response} from 'express';
import { NotFoundError } from '@pwrgtickets/common';
import { Ticket } from '../models/ticket';  

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket){
    throw new NotFoundError();
  }

  res.send(ticket); //default status code = 200
});

export { router as showTicketRouter };