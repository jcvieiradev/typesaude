import {
  create,
  find,
  findAllAppointmentsInDay,
  isTimeAvailable,
  remove,
  update,
} from "@/actions/appointments";
import { APPOINTMENT_STATUS } from "@/enums/Appointment-status";
import { ROLES } from "@/enums/roles";
import { prisma } from "@/lib/prisma";
import {
  CreateAppointments as CreateResource,
  UpdateAppointments as UpdateResource,
} from "@/types/actions/appointments";
import { Appointment as Model } from "@prisma/client";
import { Session } from "next-auth";

const model = prisma.appointment;

vi.mock("next-auth", () => ({
  getServerSession: () => {
    const session: Session = {
      expires: "",
      user: { role: ROLES.VIEWER },
    };
    return session;
  },
}));

describe("Integration: Agendamento", () => {
  let defaultResourse: Model;

  beforeEach(async () => {
    const doctor = await prisma.doctor.create({ data: {} });
    const service = await prisma.service.create({
      data: {
        duration: 14,
        name: "consulta",
      },
    });
    const patient = await prisma.patient.create({ data: {} });

    defaultResourse = await model.create({
      data: {
        dateTime: new Date("2025-06-02T15:00"),
        doctorId: doctor.id,
        patientId: patient.id,
        serviceId: service.id,
        status: APPOINTMENT_STATUS.SCHEDULED,
      },
    });
  });

  test("deve ser possível criar um agendamento", async () => {
    const dataToCreate: CreateResource = {
      dateTime: new Date("2025-06-03T15:00"),
      doctorId: defaultResourse.doctorId,
      patientId: defaultResourse.patientId,
      serviceId: defaultResourse.serviceId,
      status: APPOINTMENT_STATUS.SCHEDULED,
    };
    const response = await create(dataToCreate);
    if ("error" in response) throw Error(response.error);
    expect(response.data.id).toBeTruthy();
  });

  test("deve ser possível listar agendamentos", async () => {
    const response = await find();
    console.log(response);

    if ("error" in response) throw Error(response.error);
    expect(response.data.length).greaterThan(0);
  });

  test("deve ser possível atualizar um agendamento", async () => {
    const dataToUpdate: UpdateResource = {
      id: defaultResourse.id,
      status: APPOINTMENT_STATUS.COMPLETED,
    };
    const response = await update(dataToUpdate);
    if ("error" in response) throw Error(response.error);
    expect(response.data.status).toBe(APPOINTMENT_STATUS.COMPLETED);
  });

  test("deve ser possível remover um agendamento", async () => {
    await remove(defaultResourse.id);

    const removedResource = await model.findUnique({
      where: {
        id: defaultResourse.id,
      },
    });
    expect(removedResource).toBeNull();
  });

  test("deve ser possível listar todos os agendamentos de um médico em um determinado dia", async () => {
    const response = await findAllAppointmentsInDay(
      new Date("2025-06-02T15:00"),
      defaultResourse.doctorId
    );

    if ("error" in response) throw new Error(response.error);

    expect(response.data.length).toBe(1);
  });

  test("deve retornar um horário como indisponível se existir um agendamento ATIVO nomesmo horário para o mesmo médico.", async () => {
    const casesToTest = [
      new Date("2025-06-02T14:46"),
      new Date("2025-06-02T15:00"),
      new Date("2025-06-02T15:14"),
    ];

    for (const toTest of casesToTest) {
      const response = await isTimeAvailable(
        toTest,
        15,
        defaultResourse.doctorId
      );
      if ("error" in response) throw new Error(response.error);

      expect(response.data).toBe(false);
    }
  });

  test("deve retornar um horário como disponível se não existir um agendamento ATIVO nomesmo horário para o mesmo médico.", async () => {
    const casesToTest = [
      new Date("2025-06-02T14:00"),
      new Date("2025-06-02T14:45"),
      new Date("2025-06-02T15:15"),
      new Date("2025-06-02T16:00"),
    ];

    for (const toTest of casesToTest) {
      const response = await isTimeAvailable(
        toTest,
        15,
        defaultResourse.doctorId
      );
      if ("error" in response) throw new Error(response.error);

      expect(response.data).toBe(true);
    }
  });

  test.only("deve validar corretamente um horário na criação de um agendamento.", async () => {
    const dataToCreate: CreateResource = {
      dateTime: new Date("2025-06-03T15:00"),
      doctorId: defaultResourse.doctorId,
      patientId: defaultResourse.patientId,
      serviceId: defaultResourse.serviceId,
      status: APPOINTMENT_STATUS.SCHEDULED,
    };

    const response = await create(dataToCreate);

    if ("data" in response) throw Error("Deveria dar erro");

    expect(response.error).toBe("O horário não esta disponível. Tente outro.");
  });

  test.only("deve validar corretamente um horário na atualização de um agendamento.", async () => {
    const newAppointment = await model.create({
      data: {
        dateTime: new Date("2025-06-03T15:00"),
        doctorId: defaultResourse.doctorId,
        patientId: defaultResourse.patientId,
        serviceId: defaultResourse.serviceId,
        status: APPOINTMENT_STATUS.SCHEDULED,
      },
    });

    const dataToUpdate: UpdateResource = {
      id: newAppointment.id,
      dateTime: new Date("2025-06-02T15:00"),
    };

    const response = await update(dataToUpdate);

    if ("data" in response) throw Error("Deveria dar erro");

    expect(response.error).toBe("O horário não esta disponível. Tente outro.");
  });
});
