import express from 'express';
import TagController from '../controllers/tag.controller';
import TagService from '../services/tag.service';

const tagRouter = express.Router();
const tagController = new TagController(new TagService());

tagRouter.get('/', tagController.getFilteredTags);

export default tagRouter;
