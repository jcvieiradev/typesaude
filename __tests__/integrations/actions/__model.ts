import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { Session } from "next-auth";
import {
  CreateUser as CreateResource,
  ListReturn,
  UpdateUser as UpdateResource,
} from "@/types/actions/users";
import { create, find, remove, update } from "@/actions/users";
import { ROLES } from "@/enums/roles";

const model = prisma.user;

let authRole = ROLES.ADMIN;

vi.mock("next-auth", () => ({
  getServerSession: () => {
    const session: Session = {
      expires: "",
      user: { role: authRole },
    };
    return session;
  },
}));

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

  test("deve ser possível remover um usuário", async () => {
    await remove(defaultResourse.id);

    const removedResource = await model.findUnique({
      where: {
        id: defaultResourse.id,
      },
    });
    expect(removedResource).toBeNull();
  });

  test.only("deve criptografar senha ao criar um usuário", async () => {
    const dataToCreate: CreateResource = {
      email: "contato@type.der.br",
      password: "senha",
      name: "typedev",
      role: "ADMIN",
    };
    const response = await create(dataToCreate);
    if ("error" in response) throw Error(response.error);

    console.log(response);
    const createdUser = await model.findUnique({
      where: {
        id: response.data.id,
      },
    });
    console.log(createdUser?.password);
    expect(createdUser?.password).toBeTruthy();
    expect(createdUser?.password).not.toBe(dataToCreate.password);
  });
  test("deve criptografar senha ao atualizar a senha de um usuário", async () => {});
  test("não deve ser possível criar um usuário com email que já existe", async () => {});
  test("não deve ser possível atualizar um email que já existe", async () => {});
  test("não deve ser retornar a propriedade password ao criar uma senha", async () => {});
  test("não deve ser retornar a propriedade password ao atualizar uma senha", async () => {});
  // expect("").toBe("Email inválido.");
});
