import express from 'express';
import TicketController from '../controllers/ticket.controller';
import TicketService from '../services/ticket.service';

const ticketRouter = express.Router();
const ticketController = new TicketController(new TicketService());

ticketRouter.get('/:sprintId', ticketController.getTicketsBySprint);

export default ticketRouter;
