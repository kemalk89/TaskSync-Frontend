import { ReactNode } from "react";
import BsPagination from "react-bootstrap/Pagination";
import styles from "./styles.module.css";

interface PaginationProps {
  paged: { total: number; pageSize: number; pageNumber: number };
  onPageSelected: (pageNumber: number) => void;
}

export const Pagination = ({ paged, onPageSelected }: PaginationProps) => {
  const totalPages = Math.ceil(paged.total / paged.pageSize);

  const createPaginationItem = (pageNumber: number) => {
    return (
      <BsPagination.Item
        key={`page-${pageNumber}`}
        className={styles.paginationItem}
        onClick={() => onPageSelected(pageNumber)}
        active={paged.pageNumber === pageNumber}
      >
        {pageNumber}
      </BsPagination.Item>
    );
  };

  const renderPages = () => {
    const SLOTS = 7;
    const MAX_GAP_TO_START = 4;
    const MAX_GAP_TO_END = 2;

    // means, user see all pages "1, 2, 3, 4, 5, 6, 7"
    const canSeeAllPages = totalPages <= SLOTS;
    // means, user see pages "1, 2, 3, 4, 5, ..., 100"
    const startingAtBeginning = paged.pageNumber <= MAX_GAP_TO_START;
    // means, user see pages "1, ..., 96, 97, 98, 99, 100"
    const startingAtEnd = totalPages - paged.pageNumber <= MAX_GAP_TO_END;
    // means, user see pages "1, ..., 46, 47, 48, ..., 100"
    const centeredView =
      totalPages - paged.pageNumber > MAX_GAP_TO_END &&
      paged.pageNumber > MAX_GAP_TO_START;

    const elements: ReactNode[] = [];
    if (canSeeAllPages) {
      Array.from({ length: SLOTS }).forEach((_, i) => {
        elements.push(createPaginationItem(i + 1));
      });
    } else if (centeredView) {
      elements.push(createPaginationItem(1));
      elements.push(
        <BsPagination.Item key={`dots-1`} className={styles.dots}>
          ...
        </BsPagination.Item>
      );
      elements.push(createPaginationItem(paged.pageNumber - 1));
      elements.push(createPaginationItem(paged.pageNumber));
      elements.push(createPaginationItem(paged.pageNumber + 1));
      elements.push(
        <BsPagination.Item key={`dots-2`} className={styles.dots}>
          ...
        </BsPagination.Item>
      );
      elements.push(createPaginationItem(totalPages));
    } else if (startingAtBeginning) {
      Array.from({ length: SLOTS }).forEach((_, i) => {
        const isLastPage = i === SLOTS - 1;
        if (isLastPage) {
          elements.push(createPaginationItem(totalPages));
        } else if (i === SLOTS - 2) {
          elements.push(
            <BsPagination.Item key={`dots`} className={styles.dots}>
              ...
            </BsPagination.Item>
          );
        } else {
          elements.push(createPaginationItem(i + 1));
        }
      });
    } else if (startingAtEnd) {
      Array.from({ length: SLOTS }).forEach((_, i) => {
        if (i === 0) {
          elements.push(createPaginationItem(1));
        } else if (i === 1) {
          elements.push(
            <BsPagination.Item className={styles.dots} key={`dots`}>
              ...
            </BsPagination.Item>
          );
        } else {
          elements.push(createPaginationItem(totalPages - SLOTS + 1 + i));
        }
      });
    }

    return elements;
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div className={styles.totalResults}>{paged.total} Ergebnisse gefunden</div>
      <BsPagination>
        <BsPagination.Prev onClick={onPreviousPageSelected} />
        {renderPages()}
        <BsPagination.Next onClick={onNextPageSelected} />
      </BsPagination>
    </div>
  );
};
