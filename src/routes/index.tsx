import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { asc } from "drizzle-orm";
import { db } from "#/drizzle/db";
import { issues, epics } from "#/drizzle/schema";

const getAllTickets = createServerFn().handler(async () => {
  return db.select().from(issues).orderBy(asc(issues.createdAt));
});

const getAllEpics = createServerFn().handler(async () => {
  return db.select().from(epics);
});

export const Route = createFileRoute("/")({
  loader: async () => {
    const [tickets, allEpics] = await Promise.all([
      getAllTickets(),
      getAllEpics(),
    ]);
    return { tickets, epics: allEpics };
  },
  component: Home,
});

function Home() {
  const { tickets, epics } = useLoaderData({ from: "/" });

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Tickets</h1>
      <ul className="mt-4 space-y-2">
        {tickets.map((ticket) => (
          <li key={ticket.id} className="border p-3 rounded">
            <span className="font-semibold">{ticket.title}</span>
            {ticket.description && (
              <p className="text-sm text-gray-600">{ticket.description}</p>
            )}
            <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-200">
              {ticket.status}
            </span>
          </li>
        ))}
      </ul>

      <h1 className="text-4xl font-bold mt-10">Epics</h1>
      <ul className="mt-4 space-y-2">
        {epics.map((epic) => (
          <li key={epic.id} className="border p-3 rounded">
            <span className="font-semibold">{epic.name}</span>
            {epic.description && (
              <p className="text-sm text-gray-600">{epic.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
