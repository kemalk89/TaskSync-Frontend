import { Page } from "@app/utils";
import BsPagination from "react-bootstrap/Pagination";

interface PaginationProps {
  paged: any;
  onPageSelected: (pageNumber: number) => void;
}

export const Pagination = ({ paged, onPageSelected }: PaginationProps) => {
  const totalPages = Math.ceil(paged.total / paged.pageSize);

  const renderPages = () => {
    const elements = [];
    for (let i = 0; i < totalPages; i++) {
      elements.push(
        <BsPagination.Item
          key={`page-${i}`}
          onClick={() => onPageSelected(i + 1)}
          active={paged.pageNumber === i + 1}
        >
          {i + 1}
        </BsPagination.Item>
      );
    }
    return elements;
  };

  const onFirstPageSelected = () => {
    onPageSelected(1);
  };

  const onLastPageSelected = () => {
    onPageSelected(totalPages);
  };

  const onPreviousPageSelected = () => {
    let pageNumber = paged.pageNumber;
    if (pageNumber > 1) {
      pageNumber--;
    }

    onPageSelected(pageNumber);
  };

  const onNextPageSelected = () => {
    let pageNumber = paged.pageNumber;
    if (pageNumber < totalPages) {
      pageNumber++;
    }

    onPageSelected(pageNumber);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <BsPagination>
      <BsPagination.First onClick={onFirstPageSelected} />
      <BsPagination.Prev onClick={onPreviousPageSelected} />

      {renderPages()}

      <BsPagination.Next onClick={onNextPageSelected} />
      <BsPagination.Last onClick={onLastPageSelected} />
    </BsPagination>
  );
};
