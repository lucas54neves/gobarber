import { Request, Response } from 'express';
// startOfHour: altera a hora para o inicio da hora. Por exemplo, se for 15:40:35, fica 15:00:00
// parseISO: converte a string hora em um objeto hora
// isEqual: verifica se as horas sao iguais
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;

    /*
    parseISO(date) => transforma dados: transforma uma string em date
    startOfHour(parsedDate) => regra de negocio: os agendamento so podem ocorrer de hora em hora
  */
    const parsedDate = parseISO(date);

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      date: parsedDate,
      provider_id,
    });

    return response.json(appointment);
  }
}
