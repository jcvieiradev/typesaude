import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import {
  CreateUser as CreateResource,
  ListReturn,
  UpdateUser as UpdateResource,
} from "@/types/actions/users";
import { create, find, remove, update } from "@/actions/users";

const model = prisma.user;

describe("Integration: Users", () => {
  let defaultResourse: User;

  beforeEach(async () => {
    defaultResourse = await model.create({
      data: {
        email: "contato@type.dev.br",
        password: "123456",
      },
    });
  });

  test("deve ser possível criar um usuário", async () => {
    const dataToCreate: CreateResource = {
      email: "contato@type.der.br",
      password: "type",
      name: "typedev",
      role: "ADMIN",
    };
    const response = await create(dataToCreate);
    if ("error" in response) throw Error(response.error);
    expect(response.data.id).toBeTruthy();
  });

  test("deve ser possível listar usuários", async () => {
    const response = await find();

    if ("error" in response) throw Error(response.error);
    expect(response.data.length).greaterThan(0);
  });

  test("deve ser possível atualizar um usuário", async () => {
    const dataToUpdate: UpdateResource = {
      id: defaultResourse.id,
      name: "Teste",
    };
    const response = await update(dataToUpdate);
    if ("error" in response) throw Error(response.error);
    expect(response.data.name).toBe("Teste");
  });

  test.only("deve ser possível remover um usuário", async () => {
    await remove(defaultResourse.id);

    const removedResource = await model.findUnique({
      where: {
        id: defaultResourse.id,
      },
    });
    expect(removedResource).toBeNull();
  });
});
