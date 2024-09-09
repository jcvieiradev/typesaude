import { Button } from "@/components/ui/button";
import { config } from "../config";
import { prisma } from "@/lib/prisma";
import { Table } from "./table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SheetForm } from "../(form)/sheet-form";

export default async function Page() {
  const users = await prisma.user.findMany();
  return (
    <div className="p-8">
      <div className="flex justify-between items-center bg-slate-500 mb-4">
        <div>
          <h1 className="text-3xl font-bold">
            {config.conteudo.tabela.titulo}
          </h1>
          <p className="text-sm">{config.conteudo.tabela.descricao}</p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button>{config.conteudo.tabela.botaoNovo}</Button>
          </SheetTrigger>
          <SheetForm />
        </Sheet>
      </div>

      <div>
        <div>
          <Table data={users}></Table>
        </div>
      </div>
    </div>
  );
}
