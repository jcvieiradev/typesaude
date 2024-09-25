import { ErrorsMessages } from "@/config/messages";
import { ROLES } from "@/enums/roles";
import { prisma } from "@/lib/prisma";
import { DefaultReturn, ErrorReturn } from "@/types/actions/_general";
import {
  CreateUser as CreateResource,
  ListReturn,
  UpdateUser as UpdateResource,
} from "@/types/actions/users";
import { User as Model } from "@prisma/client";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const model = prisma.user;
//Para usar como modelo basta trocar CreateUser, UpdateUser e User

export async function create(
  data: CreateResource
): Promise<DefaultReturn<Omit<Model, "password">> | ErrorReturn> {
  try {
    const session = await getServerSession();

    if (session?.user.role !== ROLES.ADMIN) {
      return { error: ErrorsMessages.not_authorized };
    }

    const response = await model.create({
      data: {
        ...data,
        password: bcrypt.hashSync(data.password, 10),
      },
    });

    const { password, ...safeResponse } = response;

    return { data: safeResponse };
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const uniqueValue = (error.meta?.target as string[] | null)?.[0];
      if (uniqueValue === "email")
        return { error: "Já existe um usuário com este email" };
    }

    console.error(error);
    return { error: "Erro ao criar um usuário" };
  }
}

export async function find(): Promise<ListReturn | ErrorReturn> {
  try {
    const session = await getServerSession();

    if (session?.user.role !== ROLES.ADMIN) {
      return { error: ErrorsMessages.not_authorized };
    }
    const response = await model.findMany();

    const safeReponse = response.map((user) => {
      const { password, ...safeUser } = user;
      return safeUser;
    });

    return { data: safeReponse };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao listar usuários" };
  }
}

export async function update(
  data: UpdateResource
): Promise<DefaultReturn<Omit<Model, "password">> | ErrorReturn> {
  try {
    const session = await getServerSession();

    if (session?.user.role !== ROLES.ADMIN) {
      return { error: ErrorsMessages.not_authorized };
    }
    const { id, ...dataToUpdate } = data;

    if (dataToUpdate.password) {
      dataToUpdate.password = bcrypt.hashSync(dataToUpdate.password, 10);
    }

    const response = await model.update({
      where: { id },
      data: dataToUpdate,
    });

    const { password, ...safeResponse } = response;

    return { data: safeResponse };
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const uniqueValue = (error.meta?.target as string[] | null)?.[0];
      if (uniqueValue === "email")
        return { error: "Já existe um usuário com este email" };
    }
    console.error(error);
    return { error: "Erro ao atualizar usuário" };
  }
}

export async function remove(id: Model["id"]): Promise<void | ErrorReturn> {
  try {
    const session = await getServerSession();

    if (session?.user.role !== ROLES.ADMIN) {
      return { error: ErrorsMessages.not_authorized };
    }
    await model.delete({
      where: { id },
    });
  } catch (error) {
    console.error(error);
    return { error: "Erro ao remover um usuário" };
  }
}
