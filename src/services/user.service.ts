import Team from '../models/team';
import User from '../models/user';
import UserRole from '../models/user-role';

export default class UserService {
  getAllUsers(): Promise<User[]> {
    return User.findAll({
      include: [Team],
      attributes: {
        exclude: ['password', 'roleId'],
      },
    });
  }

  getUserById(id: string): Promise<User | null> {
    return User.findByPk(id, {
      include: [Team, UserRole],
      attributes: {
        exclude: ['password', 'roleId'],
      },
    });
  }
}
