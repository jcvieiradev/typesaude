import { create, find, remove, update } from "@/actions/users";
import { ErrorsMessages } from "@/config/messages";
import { ROLES } from "@/enums/roles";
import { Session } from "next-auth";

let authRole = ROLES.EDITOR;

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      create: () => {},
      findMany: () => {},
      update: () => {},
      delete: () => {},
    },
  },
}));

vi.mock("next-auth", () => ({
  getServerSession: () => {
    const session: Session = {
      expires: "",
      user: { role: authRole },
    };
    return session;
  },
}));

describe("Unit: Usuários", () => {
  test("não deve ser possível criar um usuário sem ser ADMIN", async () => {
    const response = await create({
      email: "teste@teste.com",
      password: "teste",
      name: "Teste",
      role: ROLES.VIEWER,
    });

    if ("data" in response) throw new Error("Deveria retornar um erro");

    expect(response.error).toBe(ErrorsMessages.not_authorized);
  });

  test("não deve ser possível listar usuários sem ser ADMIN", async () => {
    const response = await find();

    if ("data" in response) throw new Error("Deveria retornar um erro");

    expect(response.error).toBe(ErrorsMessages.not_authorized);
  });

  test("não deve ser possível atualizar um usuário sem ser ADMIN", async () => {
    const response = await update({
      id: 1,
      name: "Teste",
    });

    if ("data" in response) throw new Error("Deveria retornar um erro");

    expect(response.error).toBe(ErrorsMessages.not_authorized);
  });

  test("não deve ser possível remover um usuário sem ser ADMIN", async () => {
    const response = await remove(1);

    expect(response?.error).toBe(ErrorsMessages.not_authorized);
  });
});
