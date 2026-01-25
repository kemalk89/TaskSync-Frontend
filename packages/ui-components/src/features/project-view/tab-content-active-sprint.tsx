import Link from "next/link";
import { Alert } from "react-bootstrap";
import { IconInfoCircle } from "../../icons/icons";

export const TabContentActiveSprint = () => {
  return (
    <Alert variant="info">
      <p>
        <IconInfoCircle /> Zur Zeit gibt es kein aktives Board.
      </p>
      <p>
        Bitte zum Reiter <Link href="?tab=backlog">Backlog</Link> wechseln, um
        einen Board zu planen und zu aktivieren.
      </p>
    </Alert>
  );
};
