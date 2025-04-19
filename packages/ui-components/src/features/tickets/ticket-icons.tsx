import {
  IconBug,
  IconEarmarkFill,
  IconWrenchAdjustable,
} from "../../icons/icons";
import styles from "./styles.module.css";

export const TicketIconBug = () => {
  return (
    <div className="d-flex align-items-center gap-1">
      <IconBug className={"align-baseline " + styles.iconBug} />
      Bug
    </div>
  );
};

export const TicketIconTask = () => {
  return (
    <div className="d-flex align-items-center gap-1">
      <IconWrenchAdjustable className={"align-baseline " + styles.iconTask} />
      Task
    </div>
  );
};

export const TicketIconStory = () => {
  return (
    <div className="d-flex align-items-center gap-1">
      <IconEarmarkFill className={"align-baseline " + styles.iconStory} />
      Story
    </div>
  );
};
