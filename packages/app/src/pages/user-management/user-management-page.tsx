import { UserResponse, api } from "@times/api";
import { ItemsTableColumn } from "../../components/table-page/items-table";
import { TableView } from "../../components/table-page/table-view";
import { useNavigate } from "react-router-dom";

export const UserManagementPage = () => {
  const navigate = useNavigate();

  const columns: ItemsTableColumn<UserResponse>[] = [
    { title: "ID", fieldName: "id" },
    { title: "Username", fieldName: "username" },
  ];

  return (
    <TableView<UserResponse>
      tableData={{ columns }}
      pageTitle="User Management"
      cacheKey="users"
      getItemsApi={api.fetchUsers}
      onViewItem={(item) => navigate(`/user-management/${item.id}`)}
      renderDeleteConfirmationModalBody={(item) => (
        <p>Are you sure you want to delete ticket "{item.username}"?</p>
      )}
    />
  );
};
