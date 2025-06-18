import { FormEvent, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

type Props = {
  initialSearchText?: string | null;
  onSearch: (searchText: string) => void;
};

export const SearchBar = ({ initialSearchText, onSearch }: Props) => {
  const [searchText, setSearchText] = useState(initialSearchText ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchText);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col xs="auto">Multi_Select Bearbeiter, Multi_Select Typ</Col>
        <Col xs="auto">
          <Form.Control
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Suche nach Titel..."
          />
        </Col>
        <Col xs="auto">
          <Button type="submit" variant="outline-primary">
            Suchen
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
