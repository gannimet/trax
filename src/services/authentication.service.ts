import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HttpErrorString } from '../controllers/constants/http-error-string';
import { tokenSecret } from '../controllers/constants/token.constants';
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
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                  },
                  tokenSecret,
                  {
                    expiresIn: '12h',
                  },
                );

                return Promise.resolve(accessToken);
              }

              return Promise.reject(HttpErrorString.INVALID_CREDENTIALS);
            });
        }

        return Promise.reject(HttpErrorString.INVALID_CREDENTIALS);
      },
      (queryError) => {
        return Promise.reject(queryError);
      },
    );
  }
}
