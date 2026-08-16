import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { db } from "#/drizzle/db";
import { issues, epics } from "#/drizzle/schema";
import { queryOptions, useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

const getAllTickets = createServerFn().handler(async () => {
  return db.select().from(issues).orderBy(asc(issues.createdAt));
});

const getAllEpics = createServerFn().handler(async () => {
  return db.select().from(epics);
});

const updateTicketStatus = createServerFn()
  .validator((data: { id: number; status: "todo" | "done" }) => data)
  .handler(async ({ data }) => {
    await db.update(issues).set({ status: data.status }).where(eq(issues.id, data.id));
  });

const ticketsQueryOptions = queryOptions({
  queryKey: ["tickets"],
  queryFn: () => getAllTickets(),
});

const epicsQueryOptions = queryOptions({
  queryKey: ["epics"],
  queryFn: () => getAllEpics(),
});

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(ticketsQueryOptions),
      context.queryClient.ensureQueryData(epicsQueryOptions),
    ]);
  },
  component: Home,
});

type Ticket = Awaited<ReturnType<typeof getAllTickets>>[number];

function Home() {
  const { data: tickets } = useSuspenseQuery(ticketsQueryOptions);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "todo" | "done" }) =>
      updateTicketStatus({ data: { id, status } }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries(ticketsQueryOptions);
      const previousTickets = queryClient.getQueryData(ticketsQueryOptions.queryKey);
      queryClient.setQueryData(ticketsQueryOptions.queryKey, (old) =>
        old?.map((t) => (t.id === id ? { ...t, status } : t)),
      );
      return { previousTickets };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTickets) {
        queryClient.setQueryData(ticketsQueryOptions.queryKey, context.previousTickets);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(ticketsQueryOptions);
    },
  });

  const todoTickets = tickets.filter((t) => t.status === "todo");
  const doneTickets = tickets.filter((t) => t.status === "done");

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const ticketId = active.id as number;
    const newStatus = over.id as "todo" | "done";
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket || ticket.status === newStatus) return;

    mutation.mutate({ id: ticketId, status: newStatus });
  }

  return (
    <div className="p-8">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 gap-6">
          <Column title="To Do" status="todo" tickets={todoTickets} />
          <Column title="Done" status="done" tickets={doneTickets} />
        </div>
      </DndContext>
    </div>
  );
}

function Column({ title, status, tickets }: { title: string; status: string; tickets: Ticket[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className={`rounded-lg bg-gray-100 p-4 ${isOver ? "ring-2 ring-blue-400" : ""}`}>
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="space-y-3">
        {tickets.map((ticket) => (
          <Card key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}

function Card({ ticket }: { ticket: Ticket }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: ticket.id });

  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`cursor-grab rounded-md bg-white p-3 shadow-sm ${isDragging ? "opacity-50" : ""}`}
    >
      {ticket.title}
    </div>
  );
}
