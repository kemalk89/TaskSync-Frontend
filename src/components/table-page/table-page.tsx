import { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { addItemToPagedResult } from "../../utils/pagination";
import { uuid } from "../../utils/uuid";
import { Pagination } from "../pagination/pagination";
import { ItemsTable } from "./items-table";

interface TablePageProps {
  pageTitle: string;
  itemForm: any;
  tableData: any;
  cacheKey: string;
  deleteItemApi: any;
  getItemsApi: any;
  saveItemApi: any;
  onViewItem: any;
}

export const TablePage = ({
  pageTitle,
  itemForm,
  tableData,
  cacheKey,
  deleteItemApi,
  getItemsApi,
  saveItemApi,
  onViewItem,
}: TablePageProps) => {
  const ItemForm = itemForm;
  const [itemToDelete, setItemToDelete] = useState<any>();
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [page, setPage] = useState({ pageNumber: 1, pageSize: 50 });
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
    mutationFn: (itemId) => deleteItemApi(itemId),
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

      <Modal isOpen={confirmDeleteModal} toggle={toggleConfirmDeleteModal}>
        <ModalHeader toggle={toggleConfirmDeleteModal}>
          Confirm delete
        </ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to delete project "{itemToDelete?.title}"?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => deleteItem.mutate(itemToDelete?.id)}
            disabled={deleteItem.isLoading}
          >
            Yes
          </Button>{" "}
          <Button color="primary" onClick={toggleConfirmDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <ItemsTable
        isLoading={isLoading}
        columns={tableData.columns}
        rows={data?.items}
        actions={actions}
      />

      {data && <Pagination paged={data} onPageSelected={onPageSelected} />}
    </div>
  );
};
