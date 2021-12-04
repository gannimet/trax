import { RequestHandler } from 'express';
import TagService from '../services/tag.service';
import { sendDataResponse, sendErrorResponse } from './utils/req-res.utils';

export default class TagController {
  constructor(private tagService: TagService) {}

  getFilteredTags: RequestHandler = (req, res) => {
    const { searchValue = '' } = req.query;

    this.tagService
      .getFilteredTags(searchValue as string)
      .then(sendDataResponse(res), sendErrorResponse(res));
  };
}
