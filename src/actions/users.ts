import { DefaultReturn, ErrorReturn } from "@/types/actions/_general";
import {
  CreateUser as CreateResource,
  ListReturn,
  UpdateUser as UpdateResource,
} from "@/types/actions/users";
import { User as Model } from "@prisma/client";
//Para usar como modelo basta trocar CreateUser, UpdateUser e User

export async function create(
  data: CreateResource
): Promise<DefaultReturn<Model> | ErrorReturn> {
  return { error: "" };
}
export async function find(): Promise<ListReturn | ErrorReturn> {
  return { error: "" };
}
export async function update(
  data: UpdateResource
): Promise<DefaultReturn<Model> | ErrorReturn> {
  return { error: "" };
}
export async function remove(id: Model["id"]): Promise<void | ErrorReturn> {}
