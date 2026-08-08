import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { asc } from "drizzle-orm";
import { db } from "#/drizzle/db";
import { issues } from "#/drizzle/schema";

const getAllTickets = createServerFn().handler(async () => {
  return db.select().from(issues).orderBy(asc(issues.createdAt));
});

export const Route = createFileRoute("/")({
  loader: async () => {
    const tickets = await getAllTickets();
    return { tickets };
  },
  component: Home,
});

function Home() {
  const { tickets } = useLoaderData({ from: "/" });

  const todoTickets = tickets.filter((t) => t.status === "todo");
  const doneTickets = tickets.filter((t) => t.status === "done");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Board</h1>
      <div className="grid grid-cols-2 gap-6">
        <Column title="To Do" tickets={todoTickets} />
        <Column title="Done" tickets={doneTickets} />
      </div>
    </div>
  );
}

function Column({ title, tickets }: { title: string; tickets: { id: number; title: string }[] }) {
  return (
    <div className="rounded-lg bg-gray-100 p-4">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="space-y-2">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="rounded bg-white p-3 shadow-sm">
            {ticket.title}
          </div>
        ))}
      </div>
    </div>
  );
}
