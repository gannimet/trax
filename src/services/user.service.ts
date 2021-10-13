import Team from '../models/team';
import User from '../models/user';

export default class UserService {
  getAllUsers(): Promise<User[]> {
    return User.findAll({ include: [Team] });
  }
}
