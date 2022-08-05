import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@pwrgtickets/common';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin', 
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
      body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({ email });
    if(!existingUser) {
      throw new BadRequestError('Invalid creds');
    }

    const passwordsMatch = await Password.compare(existingUser.password, password)
    if(!passwordsMatch) {
      throw new BadRequestError('Invalid creds');
    }
    //generate jwt 
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
      }, 
      process.env.JWT_KEY! //!shut up typescript
    );
    //kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
    //store it on session obj
    req.session = {
      jwt: userJwt
    }; //decode from response base64decode.org then jwt.io

    res.status(200).send(existingUser);
      
});

export { router as signinRouter };