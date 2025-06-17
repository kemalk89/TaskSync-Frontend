import { TicketResponse } from "@app/api";
import {
  IconBug,
  IconEarmarkFill,
  IconWrenchAdjustable,
} from "../../icons/icons";
import styles from "./styles.module.css";

interface Props {
  withLabel?: boolean;
}

export const TicketIconBug = ({ withLabel = true }: Props) => {
  return (
    <div className="d-flex align-items-center gap-1">
      <IconBug className={"align-baseline " + styles.iconBug} />
      {withLabel && "Bug"}
    </div>
  );
};

export const TicketIconTask = ({ withLabel = true }: Props) => {
  return (
    <div className="d-flex align-items-center gap-1">
      <IconWrenchAdjustable className={"align-baseline " + styles.iconTask} />
      {withLabel && "Task"}
    </div>
  );
};

export const TicketIconStory = ({ withLabel = true }: Props) => {
  return (
    <div className="d-flex align-items-center gap-1">
      <IconEarmarkFill className={"align-baseline " + styles.iconStory} />
      {withLabel && "Story"}
    </div>
  );
};

export const TicketIcon = ({ ticket }: { ticket: TicketResponse }) => {
  if (!ticket) {
    return null;
  }
  const { type } = ticket;

  switch (type) {
    case "bug":
      return <TicketIconBug withLabel={false} />;
    case "task":
      return <TicketIconTask withLabel={false} />;
    case "story":
      return <TicketIconStory withLabel={false} />;
    default:
      return null;
  }
};
