import Link from "next/link";
import { Alert } from "react-bootstrap";
import { IconInfoCircle } from "../../icons/icons";

export const TabContentActiveSprint = () => {
  return (
    <Alert variant="info">
      <p>
        <IconInfoCircle /> Zur Zeit läuft kein aktiver Sprint.
      </p>
      <p>
        Bitte zum Reiter <Link href="?tab=backlog">Backlog</Link> wechseln, um
        einen Sprint zu planen und zu starten.
      </p>
    </Alert>
  );
};
