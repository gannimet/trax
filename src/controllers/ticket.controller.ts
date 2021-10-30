import { RequestHandler } from 'express';
import { HttpErrorString } from '../constants/http-error-string';
import TicketService from '../services/ticket.service';
import { HttpErrorMessage } from './models/http-error-message';
import {
  sendDataResponse,
  sendDataResponseWith404Option,
  sendErrorResponse,
} from './utils/req-res.utils';

export default class TicketController {
  constructor(private ticketService: TicketService) {}

  getTicketsBySprint: RequestHandler = (req, res) => {
    const { sprintId } = req.params;

    this.ticketService
      .getTicketsBySprint(sprintId)
      .then(sendDataResponse(res), sendErrorResponse(res));
  };

  getTicketByIssueNumber: RequestHandler = (req, res) => {
    const { issueNumber } = req.params;
    const numericalIssueNumber = parseInt(issueNumber, 10);

    if (Number.isNaN(numericalIssueNumber)) {
      return res.status(400).json({
        statusCode: 400,
        errorMessage: HttpErrorString.INVALID_PARAMETER,
      } as HttpErrorMessage);
    }

    this.ticketService
      .getTicketByIssueNumber(numericalIssueNumber)
      .then(sendDataResponseWith404Option(res), sendErrorResponse(res));
  };

  createTicket: RequestHandler = (req, res) => {
    const { title, description, sprintId, assigneeId } = req.body;
    const { authenticatedUser } = res.locals;

    this.ticketService
      .createTicket(
        sprintId,
        authenticatedUser.id,
        title,
        description,
        assigneeId,
      )
      .then(sendDataResponse(res, 201), sendErrorResponse(res));
  };

  addTicketComment: RequestHandler = (req, res) => {
    const { text } = req.body;
    const { ticketId } = req.params;
    const { authenticatedUser } = res.locals;

    this.ticketService
      .addTicketComment(ticketId, authenticatedUser.id, text)
      .then(sendDataResponseWith404Option(res), sendErrorResponse(res));
  };
}
