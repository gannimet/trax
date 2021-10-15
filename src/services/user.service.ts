import Team from '../models/sequelize/team';
import User from '../models/sequelize/user';
import UserRole from '../models/sequelize/user-role';

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
