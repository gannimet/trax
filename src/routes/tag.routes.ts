import express from 'express';
import TagController from '../controllers/tag.controller';
import TagService from '../services/tag.service';

const tagRouter = express.Router();
const tagController = new TagController(new TagService());

tagRouter.get('/', tagController.getFilteredTags);
tagRouter.post('/', tagController.createTag);

export default tagRouter;
