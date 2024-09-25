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
        email: "teste@teste.com",
        password: "test",
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

  test("deve criptografar senha ao criar um usuário", async () => {
    const dataToCreate: CreateResource = {
      email: "contato@type.der.br",
      password: "senha",
      name: "typedev",
      role: "ADMIN",
    };
    const response = await create(dataToCreate);
    if ("error" in response) throw Error(response.error);

    const createdUser = await model.findUnique({
      where: {
        id: response.data.id,
      },
    });
    expect(createdUser?.password).toBeTruthy();
    expect(createdUser?.password).not.toBe(dataToCreate.password);
  });
  test("deve criptografar senha ao atualizar a senha de um usuário", async () => {
    const dataToUpdate: UpdateResource = {
      id: defaultResourse.id,
      password: "Teste",
    };
    const response = await update(dataToUpdate);
    if ("error" in response) throw Error(response.error);

    const updateUser = await model.findUnique({
      where: {
        id: response.data.id,
      },
    });

    expect(updateUser?.password).toBeTruthy();
    expect(updateUser?.password).not.toBe(dataToUpdate.password);
  });

  test("não deve ser possível criar um usuário com email que já existe", async () => {
    const dataToCreate: CreateResource = {
      email: "teste@teste.com",
      password: "type",
      name: "typedev",
      role: "ADMIN",
    };
    const response = await create(dataToCreate);
    if ("data" in response) throw Error("Deveria dar erro");
    expect(response.error).toBe("Já existe um usuário com este email");
  });
  test("não deve ser possível atualizar um email para um já cadastrado", async () => {
    const secondUser = await model.create({
      data: {
        email: "teste2@teste.com",
        password: "test",
      },
    });

    const dataToUpdate: UpdateResource = {
      id: secondUser.id,
      email: "teste@teste.com",
    };
    const response = await update(dataToUpdate);
    if ("data" in response) throw Error("Deveria dar erro");
    expect(response.error).toBe("Já existe um usuário com este email");
  });
  test("não deve ser retornar a propriedade password ao criar uma senha", async () => {
    const dataToCreate: CreateResource = {
      email: "contatoSenha@type.der.br",
      password: "type",
      name: "typedev",
      role: "ADMIN",
    };
    const response = await create(dataToCreate);

    if ("error" in response) throw Error(response.error);
    expect(response.data).not.toHaveProperty("password");
  });
  test("não deve ser retornar a propriedade password ao listar usuários", async () => {
    const response = await find();

    if ("error" in response) throw Error(response.error);
    expect(response.data[0]).not.toHaveProperty("password");
  });
  test("não deve ser retornar a propriedade password ao atualizar uma senha", async () => {
    const dataToUpdate: UpdateResource = {
      id: defaultResourse.id,
      password: "Teste",
    };
    const response = await update(dataToUpdate);

    if ("error" in response) throw Error(response.error);
    expect(response.data).not.toHaveProperty("password");
  });
});
