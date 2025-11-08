"use client";

import { FormEvent, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import FilterDropdown from "../../components/filter/filter-dropdown";
import { ProjectResponse, TicketStatusModel, UserResponse } from "@app/api";
import { UserName } from "../../user-name/user-name";

type Props = {
  initialSearchText?: string | null;
  initialSelectedLabels?: string[] | null;
  initialSelectedAssignees?: string[] | null;
  initialSelectedStatus?: string[] | null;
  initialSelectedProjects?: string[] | null;

  projectList: ProjectResponse[];
  userList: UserResponse[];
  ticketStatusList: TicketStatusModel[];

  onSearch: (
    searchText: string,
    status: string[],
    projects: string[],
    users: string[]
  ) => void;
};

export const SearchBar = ({
  initialSearchText,
  initialSelectedLabels,
  initialSelectedAssignees,
  initialSelectedStatus,
  initialSelectedProjects,

  ticketStatusList,
  projectList,
  userList,

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

  const [selectedProjects, setSelectedProjects] = useState(
    initialSelectedProjects ?? []
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchText, selectedStatus, selectedProjects, selectedAssignees);
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
              options={userList.map((i) => ({
                value: i.id.toString(),
                label: <UserName user={i} />,
              }))}
              selectedOptions={selectedAssignees}
              onSelect={(id) => {
                const newList = [...selectedAssignees, id];
                setSelectedAssignees(newList);
                onSearch(searchText, selectedStatus, selectedProjects, newList);
              }}
              onUnselect={(id) => {
                const newList = selectedAssignees.filter((i) => i !== id);
                setSelectedAssignees(newList);
                onSearch(searchText, selectedStatus, selectedProjects, newList);
              }}
            />
            <FilterDropdown
              title="Status"
              options={ticketStatusList.map((i) => ({
                value: i.id.toString(),
                label: i.name,
              }))}
              selectedOptions={selectedStatus}
              onSelect={(id) => {
                const newList = [...selectedStatus, id];
                setSelectedStatus(newList);
                onSearch(
                  searchText,
                  newList,
                  selectedProjects,
                  selectedAssignees
                );
              }}
              onUnselect={(id) => {
                const newList = selectedStatus.filter((i) => i !== id);
                setSelectedStatus(newList);
                onSearch(
                  searchText,
                  newList,
                  selectedProjects,
                  selectedAssignees
                );
              }}
            />
            <FilterDropdown
              title="Projekt"
              options={projectList.map((i) => ({
                value: i.id.toString(),
                label: i.title,
              }))}
              selectedOptions={selectedProjects}
              onSelect={(id) => {
                const newList = [...selectedProjects, id];
                setSelectedProjects(newList);
                onSearch(
                  searchText,
                  selectedStatus,
                  newList,
                  selectedAssignees
                );
              }}
              onUnselect={(id) => {
                const newList = selectedProjects.filter((i) => i !== id);
                setSelectedProjects(newList);
                onSearch(
                  searchText,
                  selectedStatus,
                  newList,
                  selectedAssignees
                );
              }}
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
