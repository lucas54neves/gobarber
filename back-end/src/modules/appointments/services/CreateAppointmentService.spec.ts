import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();

    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointmentDate = new Date(2020, 4, 10, 11);

    const provider_id = '123456';

    const appointment = await createAppointment.execute({
      date: appointmentDate,
      provider_id,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.date).toStrictEqual(appointmentDate);
    expect(appointment.provider_id).toBe(provider_id);
  });

  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();

    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointmentDate = new Date(2020, 4, 10, 11);

    const provider_id = '123456';

    await createAppointment.execute({
      date: appointmentDate,
      provider_id,
    });

    expect(
      createAppointment.execute({ date: appointmentDate, provider_id }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
