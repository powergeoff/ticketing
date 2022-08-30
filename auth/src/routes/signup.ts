import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError } from '@pwrgtickets/common2';
import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/signup', 
[
  body('email')
  .isEmail()
  .withMessage('Email must be valid'),
  body('password')
  .trim()
  .isLength({ min:4, max: 20})
  .withMessage('Password must be between 4 and 20 characters')
],
validateRequest,
async (req: Request, res: Response) => {

  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError('Email already used');
  }

  const user = User.build({ email, password });
  await user.save();
  
  //generate jwt 
  const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, 
    process.env.JWT_KEY! //!shut up typescript
  );
  //kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
  //store it on session obj
  req.session = {
    jwt: userJwt
  }; //decode from response base64decode.org then jwt.io

  res.status(201).send(user);

});

export { router as signupRouter };