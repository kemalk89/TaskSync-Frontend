import { ReactNode, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { addItemToPagedResult, uuid } from "@times/utils";
import { Pagination } from "../pagination/pagination";
import { ItemsTable, ItemsTableColumn } from "./items-table";

interface TableViewProps<T> {
  pageTitle: string;
  itemForm?: any;
  tableData: {
    columns: ItemsTableColumn<T>[];
  };
  cacheKey: string;
  deleteItemApi?: (item: T) => Promise<unknown>;
  getItemsApi: any;
  saveItemApi?: any;
  onViewItem: (item: T) => void;
  renderDeleteConfirmationModalBody?: (item: T) => ReactNode;
  initialPage?: { pageNumber: number; pageSize: number };
}

export function TableView<T>({
  pageTitle,
  itemForm,
  tableData,
  cacheKey,
  deleteItemApi,
  getItemsApi,
  saveItemApi,
  onViewItem,
  renderDeleteConfirmationModalBody,
  initialPage = { pageNumber: 1, pageSize: 50 },
}: TableViewProps<T>) {
  const ItemForm = itemForm;
  const [itemToDelete, setItemToDelete] = useState<T>();
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [page, setPage] = useState(initialPage);
  const queryClient = useQueryClient();
  const formId = uuid();

  const { isLoading, /* error, */ data, refetch } = useQuery(
    [cacheKey, page.pageNumber],
    () => getItemsApi(page),
    { keepPreviousData: true }
  );

  const { mutate, isLoading: isSubmitting } = useMutation(saveItemApi, {
    onSuccess: (newItem) => {
      queryClient.setQueriesData(cacheKey, (oldItems: any) => {
        setFormModal(false);

        return addItemToPagedResult(oldItems, newItem);
      });
    },
  });

  const deleteItem = useMutation({
    mutationFn: (item: T) => deleteItemApi!(item),
    onSuccess: () => refetch(),
  });

  const toggleFormModal = () => {
    setFormModal(!formModal);
  };

  const onPageSelected = (pageNumber: number) => {
    const clone = {
      ...page,
      pageNumber,
    };

    setPage(clone);
  };

  const confirmDelete = (item: any) => {
    setItemToDelete(item);
    setConfirmDeleteModal(true);
  };

  const toggleConfirmDeleteModal = () => {
    setConfirmDeleteModal(!confirmDeleteModal);
  };

  const renderDeleteItemModal = () => {
    if (!renderDeleteConfirmationModalBody || !itemToDelete) {
      return null;
    }

    return (
      <Modal isOpen={confirmDeleteModal} toggle={toggleConfirmDeleteModal}>
        <ModalHeader toggle={toggleConfirmDeleteModal}>
          Confirm delete
        </ModalHeader>
        <ModalBody>{renderDeleteConfirmationModalBody(itemToDelete)}</ModalBody>
        <ModalFooter>
          <Button
            onClick={() => deleteItem.mutate(itemToDelete)}
            disabled={deleteItem.isLoading}
          >
            Yes
          </Button>{" "}
          <Button color="primary" onClick={toggleConfirmDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const actions = [
    { label: "Edit", onClick: (/* item: any */) => null },
    { label: "View", onClick: (item: any) => onViewItem(item) },
    { label: "Delete", onClick: (item: any) => confirmDelete(item) },
  ];

  return (
    <div>
      <h1>{pageTitle}</h1>
      <Button color="primary" onClick={toggleFormModal}>
        Create
      </Button>

      <Modal isOpen={formModal} toggle={toggleFormModal}>
        <ModalHeader toggle={toggleFormModal}>New</ModalHeader>
        <ModalBody>
          <ItemForm formId={formId} saveHandler={(data: any) => mutate(data)} />
        </ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            form={formId}
            color="primary"
            disabled={isSubmitting}
          >
            Save
          </Button>{" "}
          <Button color="secondary" onClick={toggleFormModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {renderDeleteItemModal()}

      <ItemsTable
        isLoading={isLoading}
        columns={tableData.columns}
        rows={data?.items}
        actions={actions}
      />

      {data && <Pagination paged={data} onPageSelected={onPageSelected} />}
    </div>
  );
}
