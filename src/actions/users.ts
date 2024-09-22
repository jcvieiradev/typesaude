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

const model = prisma.user;
//Para usar como modelo basta trocar CreateUser, UpdateUser e User

export async function create(
  data: CreateResource
): Promise<DefaultReturn<Model> | ErrorReturn> {
  try {
    const session = await getServerSession();

    if (session?.user.role !== ROLES.ADMIN) {
      return { error: ErrorsMessages.not_authorized };
    }

    const response = await model.create({ data });
    return { data: response };
  } catch (error) {
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
    return { data: response };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao listar usuários" };
  }
}

export async function update(
  data: UpdateResource
): Promise<DefaultReturn<Model> | ErrorReturn> {
  try {
    const session = await getServerSession();

    if (session?.user.role !== ROLES.ADMIN) {
      return { error: ErrorsMessages.not_authorized };
    }
    const { id, ...dataToUpdate } = data;
    const response = await model.update({
      where: { id },
      data: dataToUpdate,
    });
    return { data: response };
  } catch (error) {
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
