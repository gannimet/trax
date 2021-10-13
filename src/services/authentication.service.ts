import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { tokenSecret } from '../constants';
import User from '../models/user';

export default class AuthenticationService {
  login(username: string, password: string): Promise<string> {
    return User.findOne({ where: { email: username } }).then(
      (user) => {
        if (user && user.password) {
          return bcrypt
            .compare(password, user.password)
            .then((compareResult) => {
              if (compareResult) {
                const accessToken = jwt.sign(
                  {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                  },
                  tokenSecret,
                );

                return Promise.resolve(accessToken);
              }

              return Promise.reject('INVALID_CREDENTIALS');
            });
        }

        return Promise.reject('INVALID_CREDENTIALS');
      },
      (queryError) => {
        return Promise.reject(queryError);
      },
    );
  }
}
