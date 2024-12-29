import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DOTS = '...';

const range = (start, end) => {
  return [...Array(end - start + 1).keys()].map((i) => i + start);
};

const Pagination = ({
  totalCount,
  pageSize,
  currentPage,
  setCurrentPage,
  limit,
  setLimit,
}) => {
  const totalPageCount = Math.ceil(totalCount / pageSize);
  const siblingCount = 1; // Number of page siblings to show
  const nodeEnv = process.env.NODE_ENV !== 'production';

  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return (
    <div className="flex items-center md:justify-between flex-col md:flex-row justify-center">
      {totalPageCount > 1 && (
        <div className="flex w-full flex-wrap gap-y-2 mt-5 ">
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="flex items-center p-2 pl-[0.15rem] bg-white hover:bg-gray-300 dark:bg-gray-800 rounded-l dark:hover:bg-gray-700 transition-all text-sm border border-r-0  dark:border-gray-700 "
            >
              <ChevronLeft size={18} /> Prev
            </button>
          )}

          {paginationRange.map((pageNumber, index) => (
            <button
              key={index}
              onClick={() => pageNumber !== DOTS && setCurrentPage(pageNumber)}
              className={`rounded-none h-10 w-10 bg-white  dark:bg-gray-800 border     dark:border-gray-700  transition-all text-sm ${
                currentPage === pageNumber
                  ? 'text-primary border font-bold   '
                  : 'hover:bg-gray-300 dark:hover:bg-gray-700'
              } ${index === 0 && currentPage === 1 ? 'rounded-tl rounded-bl' : ''} ${index === paginationRange.length - 1 && currentPage === totalPageCount ? 'rounded-tr rounded-br  ' : 'border-r-0'}`}
            >
              {pageNumber === DOTS ? DOTS : pageNumber}
            </button>
          ))}
          {currentPage !== totalPageCount && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="flex items-center p-2 pr-[0.15rem] bg-white dark:bg-gray-800 rounded-r  dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all text-sm  border   "
            >
              Next <ChevronRight size={18} />
            </button>
          )}
        </div>
      )}
      {totalCount / limit > 1 && (
        <div className="flex items-center gap-2 justify-end w-full">
          <span>Show/Page :</span>
          <select
            onChange={(e) => setLimit(Number(e.target.value))}
            value={limit}
            className="bg-white border dark:border-gray-700 pl-2 my-4 rounded dark:bg-gray-800 focus:outline-primary cursor-pointer hover:border-primary dark:hover:border-primary transition-colors"
          >
            {nodeEnv && (
              <>
                <option value={1}>1</option>
                <option value={5}>5</option>
              </>
            )}
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination;
