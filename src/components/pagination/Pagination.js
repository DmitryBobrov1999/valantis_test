import ReactPaginate from 'react-paginate';
import './Pagination.css';

export const Pagination = ({ handlePageClick, pageCount }) => {

	return (
		<ReactPaginate
			breakLabel='...'
			nextLabel='next >'
			onPageChange={handlePageClick}
			pageRangeDisplayed={3}
			pageCount={pageCount}
			previousLabel='< previous'
			renderOnZeroPageCount={null}
			containerClassName='pagination'
			pageLinkClassName='page-num'
			previousLinkClassName='page-num'
			nextLinkClassName='page-num'
			activeLinkClassName='active'
			breakLinkClassName='page-num'
		/>
	);
}; // компонент пагинации
