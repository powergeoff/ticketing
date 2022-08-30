import { Publisher, Subjects, TicketCreatedEvent } from '@pwrgtickets/common2';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

