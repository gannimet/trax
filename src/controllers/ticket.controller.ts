import { RequestHandler } from 'express';
import TicketService from '../services/ticket.service';
import { sendDataResponse, sendErrorResponse } from './utils/req-res.utils';

export default class TicketController {
  constructor(private ticketService: TicketService) {}

  getTicketsBySprint: RequestHandler = (req, res) => {
    const { sprintId } = req.params;

    this.ticketService
      .getTicketsBySprint(sprintId)
      .then(sendDataResponse(res), sendErrorResponse(res));
  };
}
