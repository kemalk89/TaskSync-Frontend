"use client";

import { useState } from "react";
import { Board, BoardColumn } from "@app/ui-components";

const defaultColumns: BoardColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    color: "#6c757d",
    collapsed: false,
    tickets: [
      {
        id: 1,
        title: "Investigate performance regression on dashboard",
        type: "bug",
        assignee: { id: 1, email: "alice@example.com" },
      },
      {
        id: 2,
        title: "Add export to CSV functionality",
        type: "story",
        assignee: { id: 2, email: "bob@example.com" },
      },
      {
        id: 3,
        title: "Update dependencies to latest versions",
        type: "task",
      },
    ],
  },
  {
    id: "todo",
    title: "To Do",
    color: "#0d6efd",
    collapsed: false,
    tickets: [
      {
        id: 4,
        title: "Fix login redirect after session expiry",
        type: "bug",
        assignee: { id: 3, email: "carol@example.com" },
      },
      {
        id: 5,
        title: "Implement user notification preferences",
        type: "story",
        assignee: { id: 1, email: "alice@example.com" },
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "#fd7e14",
    collapsed: false,
    tickets: [
      {
        id: 6,
        title: "Refactor ticket search API",
        type: "task",
        assignee: { id: 2, email: "bob@example.com" },
      },
      {
        id: 7,
        title: "Wrong date format in ticket history",
        type: "bug",
        assignee: { id: 3, email: "carol@example.com" },
      },
    ],
  },
  {
    id: "review",
    title: "In Review",
    color: "#198754",
    collapsed: false,
    tickets: [
      {
        id: 8,
        title: "Add keyboard shortcuts for common actions",
        type: "story",
        assignee: { id: 1, email: "alice@example.com" },
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "#6c757d",
    collapsed: true,
    tickets: [
      {
        id: 9,
        title: "Migrate to Next.js 14 app router",
        type: "task",
        assignee: { id: 2, email: "bob@example.com" },
      },
      {
        id: 10,
        title: "Fix XSS vulnerability in comment field",
        type: "bug",
        assignee: { id: 3, email: "carol@example.com" },
      },
    ],
  },
];

export default function BoardDemoPage() {
  const [columns, setColumns] = useState<BoardColumn[]>(defaultColumns);

  const handleCreateTicket = (columnId: string) => {
    const newId = Math.max(
      ...columns.flatMap((c) => c.tickets.map((t) => t.id)),
      0,
    ) + 1;
    const newTicket = {
      id: newId,
      title: "New work item",
      type: "task" as const,
    };
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, tickets: [...col.tickets, newTicket] }
          : col,
      ),
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ marginBottom: "16px" }}>Board Demo</h3>
      <p style={{ color: "#6c757d", marginBottom: "20px" }}>
        Drag and drop tickets between columns. Click the arrow to fold/unfold
        columns. Use the color picker to customize column colors. Export and
        import board configuration as JSON.
      </p>
      <Board
        columns={columns}
        onColumnsChange={setColumns}
        onCreateTicket={handleCreateTicket}
        onTicketMove={(ticket, sourceColumnId, destinationColumnId) => {
          console.log(
            `Ticket "${ticket.title}" moved from "${sourceColumnId}" to "${destinationColumnId}"`,
          );
        }}
        onDragStart={(ticket) => {
          console.log(`Drag started: "${ticket.title}"`);
        }}
        onDragEnd={(ticket) => {
          console.log(`Drag ended: "${ticket.title}"`);
        }}
      />
    </div>
  );
}
