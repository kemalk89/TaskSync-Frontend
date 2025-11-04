"use client";

import { FormEvent, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import FilterDropdown from "../../components/filter/filter-dropdown";
import { TicketStatusModel } from "@app/api";

type Props = {
  initialSearchText?: string | null;
  initialSelectedLabels?: string[] | null;
  initialSelectedAssignees?: string[] | null;
  initialSelectedStatus?: string[] | null;
  ticketStatusList: TicketStatusModel[];
  onSearch: (searchText: string) => void;
};

export const SearchBar = ({
  initialSearchText,
  initialSelectedLabels,
  initialSelectedAssignees,
  initialSelectedStatus,
  ticketStatusList,
  onSearch,
}: Props) => {
  const [searchText, setSearchText] = useState(initialSearchText ?? "");
  const [selectedLabels, setSelectedLabels] = useState(
    initialSelectedLabels ?? []
  );
  const [selectedAssignees, setSelectedAssignees] = useState(
    initialSelectedAssignees ?? []
  );

  const [selectedStatus, setSelectedStatus] = useState(
    initialSelectedStatus ?? []
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchText);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Col>
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "space-between",
          }}
        >
          <div className="d-flex gap-2">
            <Form.Control
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Suche nach Titel..."
            />
            <Button type="submit" variant="outline-primary">
              Suchen
            </Button>
          </div>

          <div className="d-flex gap-2">
            <FilterDropdown
              title="Bearbeiter"
              options={[
                { value: "1", label: "Awaiting Deployment" },
                { value: "2", label: "Pair Programming" },
                { value: "3", label: "Quick Win" },
                { value: "4", label: "Functional Requirement" },
                { value: "5", label: "Needs Design" },
              ]}
              selectedOptions={selectedAssignees}
              onSelect={(id) =>
                setSelectedAssignees([...selectedAssignees, id])
              }
              onUnselect={(id) =>
                setSelectedAssignees(selectedAssignees.filter((i) => i !== id))
              }
            />
            <FilterDropdown
              title="Status"
              options={ticketStatusList.map((i) => ({
                value: i.id.toString(),
                label: i.name,
              }))}
              selectedOptions={selectedStatus}
              onSelect={(id) => setSelectedStatus([...selectedStatus, id])}
              onUnselect={(id) =>
                setSelectedStatus(selectedStatus.filter((i) => i !== id))
              }
            />
            <FilterDropdown
              title="Labels"
              options={[
                { value: "1", label: "Awaiting Deployment" },
                { value: "2", label: "Pair Programming" },
                { value: "3", label: "Quick Win" },
                { value: "4", label: "Functional Requirement" },
                { value: "5", label: "Needs Design" },
              ]}
              selectedOptions={selectedLabels}
              onSelect={(id) => setSelectedLabels([...selectedLabels, id])}
              onUnselect={(id) =>
                setSelectedLabels(selectedLabels.filter((i) => i !== id))
              }
            />
          </div>
        </div>
      </Col>
      <Col xs="auto"></Col>
    </Form>
  );
};
