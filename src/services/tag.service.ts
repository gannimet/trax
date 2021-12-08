import { Op } from 'sequelize';
import Tag from '../models/sequelize/tag';
import { generateRandomHexColor } from './utils/basic-utils';
import { createUUID } from './utils/query-utils';

export default class TagService {
  getFilteredTags(searchValue: string): Promise<Tag[]> {
    if (!searchValue) {
      return Promise.resolve([]);
    }

    return Tag.findAll({
      where: {
        name: {
          [Op.like]: `%${searchValue}%`,
        },
      },
    });
  }

  createTag(name: string): Promise<Tag> {
    const id = createUUID();
    const color = generateRandomHexColor();

    return Tag.create(
      {
        id,
        name,
        color,
      },
      {
        validate: true,
      },
    );
  }
}
