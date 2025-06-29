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
        <Col xs="auto">
          <div style={{ display: "flex", gap: "8px" }}>
            <Form.Control
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Suche nach Titel..."
            />
            <Button type="submit" variant="outline-primary">
              Suchen
            </Button>
          </div>
        </Col>
        <Col xs="auto"></Col>
      </Row>
    </Form>
  );
};
