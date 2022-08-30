//application cannot discern whether the jwt is valid or not
//need a service call
import express, {Request, Response} from 'express';
import { currentUser } from '@pwrgtickets/common2';

const router = express.Router();

router.get('/api/users/currentuser', currentUser,
(req: Request, res: Response) => {
  
  res.send({ currentUser: req.currentUser || null });
  
});

export { router as currentUserRouter };