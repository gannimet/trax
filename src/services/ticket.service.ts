import Ticket from '../models/sequelize/ticket';
import TicketStatus from '../models/sequelize/ticket-status';
import User from '../models/sequelize/user';

export default class TicketService {
  getTicketsBySprint(sprintId: string): Promise<Ticket[]> {
    return Ticket.findAll({
      where: {
        sprintId,
      },
      include: [
        { model: User, as: 'assignee' },
        { model: User, as: 'author' },
        TicketStatus,
      ],
    });
  }
}
