function Pagination({ currentPage, totalPages, onPrevPage, onNextPage }) {
	return (
		<section className="panel pagination">
			<button onClick={onPrevPage} disabled={currentPage === 1}>
				Precedent
			</button>
			<span>
				Page {currentPage} / {totalPages}
			</span>
			<button onClick={onNextPage} disabled={currentPage === totalPages}>
				Suivant
			</button>
		</section>
	);
}

export default Pagination;
