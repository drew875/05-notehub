import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
    pageCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    pageCount,
    currentPage,
    onPageChange,
}: PaginationProps) {
    return (
        <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed={1}
            marginPagesDisplayed={1}
            forcePage={currentPage - 1}
            onPageChange={({ selected }) => onPageChange(selected + 1)}
            containerClassName={css.pagination}
            pageClassName={css.pageItem}
            pageLinkClassName={css.pageLink}
            activeClassName={css.active}
            previousLabel="←"
            nextLabel="→"
            previousClassName={css.navItem}
            nextClassName={css.navItem}
            breakLabel="..."
            breakClassName={css.pageItem}
            breakLinkClassName={css.pageLink}
        />
    );
}