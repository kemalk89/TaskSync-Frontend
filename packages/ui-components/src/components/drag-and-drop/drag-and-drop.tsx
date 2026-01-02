import { DragEvent, DragEventHandler, PropsWithChildren } from "react";

type DraggableProps = {
  className?: string;
  itemIdentifier: string;
  dragImageBuilder: (draggableEl: HTMLElement) => HTMLElement | undefined;
  onDragStart: DragEventHandler<HTMLDivElement>;
  onDragEnd: DragEventHandler<HTMLDivElement>;
} & PropsWithChildren;

export function Draggable(props: DraggableProps) {
  const {
    className,
    children,
    itemIdentifier,
    dragImageBuilder,
    onDragStart,
    onDragEnd,
  } = props;
  return (
    <div
      className={className}
      draggable
      onDragEnd={(e) => {
        const elements = document.body.querySelectorAll(".dragImgWrapper");
        for (let e of elements) {
          e.remove();
        }

        onDragEnd(e);
      }}
      onDragStart={(e) => {
        e.dataTransfer.setData("text", itemIdentifier);

        if (onDragStart) {
          onDragStart(e);
        }

        const dragImg = dragImageBuilder(e.target as HTMLElement);
        if (dragImg) {
          const dragImgWrapper = document.createElement("div");
          dragImgWrapper.appendChild(dragImg);
          // hide from view
          dragImgWrapper.style.transform = "translate(-10000px, -10000px)";
          dragImgWrapper.style.position = "absolute";
          dragImgWrapper.classList.add("dragImgWrapper");

          document.body.appendChild(dragImgWrapper);

          e.dataTransfer.setDragImage(dragImgWrapper, 0, 0);
        }
      }}
    >
      {children}
    </div>
  );
}

export const DroppableSlot = (props: {
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
}) => {
  return (
    <div
      className="rounded-2"
      style={{ height: "8px" }}
      onDrop={(e) => {
        const element = e.target as HTMLElement;
        element.classList.remove("text-bg-info");
        props.onDrop(e);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragEnter={(e) => {
        const element = e.target as HTMLElement;
        element.classList.add("text-bg-info");
      }}
      onDragLeave={(e) => {
        const element = e.target as HTMLElement;
        element.classList.remove("text-bg-info");
      }}
    />
  );
};
