import express from 'express';
import TicketController from '../controllers/ticket.controller';
import TicketService from '../services/ticket.service';

const ticketRouter = express.Router();
const ticketController = new TicketController(new TicketService());

ticketRouter.get('/bysprint/:sprintId', ticketController.getTicketsBySprint);
ticketRouter.get(
  '/byissue/:issueNumber',
  ticketController.getTicketByIssueNumber,
);
ticketRouter.post('/', ticketController.createTicket);
ticketRouter.post('/:ticketId/comments', ticketController.addTicketComment);

export default ticketRouter;
