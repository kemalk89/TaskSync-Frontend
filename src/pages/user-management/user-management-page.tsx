import { api } from "../../api/api";
import { UserResponse } from "../../api/responses";
import { ItemsTableColumn } from "../../components/table-page/items-table";
import { TablePage } from "../../components/table-page/table-page";
import { useNavigate } from "react-router-dom";

export const UserManagementPage = () => {
  const navigate = useNavigate();

  const columns: ItemsTableColumn<UserResponse>[] = [
    { title: "ID", fieldName: "id" },
    { title: "Username", fieldName: "username" },
  ];

  return (
    <TablePage<UserResponse>
      tableData={{ columns }}
      pageTitle="User Management"
      cacheKey="users"
      getItemsApi={api.fetchUsers}
      onViewItem={(item) => navigate(`/user-management/${item.id}`)}
      renderDeleteConfirmationModalBody={(item) => <p>Are you sure you want to delete ticket "{item.username}"?</p>}
    />
  );
};
