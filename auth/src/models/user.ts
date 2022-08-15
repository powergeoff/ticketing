import mongoose from "mongoose";
import { Password } from '../services/password';

// **ONLY FOR TypeScript An interface that describes the required properties for a new User
interface UserAttrs {
  email: string;
  password: string;
}

// **ONLY FOR TypeScript An interface that describes the properties that a User document has
//INDIVIDUAL Document from the model - child
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// An interface that describe the props a User model has - ENTIRE MODEL - parent
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}



const userSchema = new mongoose.Schema({
  email: {
    type: String, //String is for Mongoose not Typescript
    required: true
  },
  password: {
    type: String, //String is for Mongoose not Typescript
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
});

userSchema.pre('save', async function(done) {
  //function() vs arrow () => gives access to 'this' keyword
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
})

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);


export { User };