import { Op } from 'sequelize';
import Tag from '../models/sequelize/tag';

export default class TagService {
  getFilteredTags(searchValue: string): Promise<Tag[]> {
    return Tag.findAll({
      where: {
        name: {
          [Op.like]: `%${searchValue}%`,
        },
      },
    });
  }
}
