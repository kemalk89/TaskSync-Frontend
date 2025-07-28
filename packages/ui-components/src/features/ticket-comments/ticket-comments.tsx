"use client";

import { Button } from "react-bootstrap";
import { TextEditor } from "../../texteditor/texteditor";
import { useEditor } from "@tiptap/react";
import { Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import { getAPI } from "@app/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TextEditorReadonly } from "../../texteditor/texteditor-readonly";
import { UserName } from "../../user-name/user-name";
import { TextDate } from "../../text-date";
import { IconTrash } from "../../icons/icons";
import { useContext } from "react";
import { ToastContext } from "../../toast";
import { useConfirmationModal } from "../../confirmation-modal";

type Props = {
  ticketId: string;
};

export const TicketComments = ({ ticketId }: Props) => {
  const { newToast } = useContext(ToastContext);
  const {
    setConfirmationModalPending,
    showConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write a comment...",
      }),
    ],
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });

  const { data: commentsResponse, refetch: reloadComments } = useQuery({
    queryKey: ["load-comments", ticketId],
    queryFn: () => {
      return getAPI().fetchTicketComments(ticketId, {
        pageNumber: 1,
        pageSize: 10,
      });
    },
  });

  const { mutateAsync: saveComment, isPending: isPendingSaveComment } =
    useMutation({
      mutationFn: (comment: object) => {
        return getAPI().saveTicketComment(ticketId, comment);
      },
    });

  const { mutateAsync: deleteComment, isPending: isPendingDeleteComment } =
    useMutation({
      mutationFn: (commentId: string) => {
        return getAPI().deleteTicketComment(ticketId, commentId);
      },
    });

  const handleSaveComment = async () => {
    if (editor) {
      const comment = editor.getJSON();
      await saveComment(comment);
      reloadComments();
    }
  };

  const onConfirmDeleteTicket = async (commentId: unknown) => {
    // note: state data cannot be used here because of stale closure problem
    if (!commentId) {
      return;
    }

    try {
      setConfirmationModalPending(true);

      const result = await deleteComment(commentId.toString());
      if (result.status === "error") {
        newToast({
          msg: "Kommentar konnte nicht gelöscht werden: Es fehlen notwendige Berechtigungen.",
          type: "error",
        });

        setConfirmationModalPending(false);
      } else {
        newToast({
          msg: "Kommentar erfolgreich gelöscht.",
          type: "success",
        });

        closeConfirmationModal();
      }
    } catch {
      newToast({
        msg: "Kommentar konnte nicht gelöscht werden.",
        type: "error",
      });

      setConfirmationModalPending(false);
    }
  };

  const handleDeleteComment = (commentId: number) => {
    showConfirmationModal(
      {
        title: "Kommentar löschen",
        body: <p>Möchten Sie den Kommentar wirklich löschen?</p>,
        data: commentId,
      },
      {
        onConfirm: onConfirmDeleteTicket,
      }
    );
  };

  const { items: comments } = commentsResponse?.data ?? {};

  return (
    <div>
      <div className="mb-4">
        <TextEditor editor={editor} />
        <div className="mt-2">
          <Button
            variant="primary"
            onClick={handleSaveComment}
            disabled={isPendingSaveComment}
          >
            Speichern
          </Button>{" "}
          <Button variant="light">Abbrechen</Button>
        </div>
      </div>
      {comments?.map((comment) => (
        <div
          key={comment.id}
          className={["mb-4", comment.isDeleted ? "text-secondary" : ""].join(
            " "
          )}
        >
          <div className="d-flex align-items-center gap-2 mb-2">
            <UserName user={comment.createdBy} />
            <TextDate date={comment.createdDate} />
          </div>

          {comment.isDeleted ? (
            <div>
              <i>Dieser Kommentar wurde vom Autor gelöscht.</i>
            </div>
          ) : (
            <TextEditorReadonly content={comment.comment} />
          )}
          {!comment.isDeleted && (
            <Button
              title="Kommentar löschen"
              size="sm"
              variant="light"
              disabled={isPendingDeleteComment}
              onClick={() =>
                handleDeleteComment(comment.id as unknown as number)
              }
            >
              <IconTrash />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
