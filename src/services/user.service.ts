import jwt from 'jsonwebtoken';
import { tokenSecret } from '../constants';
import Team from '../models/team';
import User from '../models/user';

export default class UserService {
  login(username: string, password: string): Promise<string> {
    if (username === 'hanswurst' && password === 'abc') {
      const accessToken = jwt.sign(
        {
          username: 'hanswurst',
          email: 'hans@wur.st',
        },
        tokenSecret,
      );

      return Promise.resolve(accessToken);
    }

    return Promise.reject('INVALID_CREDENTIALS');
  }

  getAllUsers(): Promise<User[]> {
    return User.findAll({ include: [Team] });
  }
}
