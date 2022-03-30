import React from 'react';

const Pagination = ({currentPage, itemsPerPage, length, onPageChanged}) => {

    const pagesCount = Math.ceil(length / itemsPerPage);
    const pages = [];

    for (let i = 1; i <= pagesCount; i++){
        pages.push(i) ;  
    }

    return ( 
        <div>
            <ul className="pagination pagination-sm">
                <li className={"page-item" + (currentPage === 1 && " disabled")}>
                    <button onClick={() => currentPage > 1 && onPageChanged(currentPage - 1)} className="page-link">&laquo;</button>
                </li>

                {pages.map(page => 
                    <li 
                        key={page} 
                        className={"page-item" + (currentPage === page && " active")}
                    > 
                        <button 
                            onClick={() => onPageChanged(page)} 
                            className="page-link"
                        >
                            {page}
                        </button> 
                    </li> 
                )}

                <li className={"page-item" + (currentPage === pagesCount && " disabled")}>
                    <button onClick={() => currentPage < pages.length && onPageChanged(currentPage + 1)} className="page-link" href="/#/customers">&raquo;</button>
                </li>
            </ul>
        </div> 
    );
}

Pagination.getData = (items, currentPage, itemsPerPage) => {
    // from where we start (start) for how long (itemsPerPage)
    const start = currentPage * itemsPerPage - itemsPerPage;
    // ex:            4       *      10      -      10  =  30 
      
    return items.slice(start, start + itemsPerPage);
}
 
export default Pagination;
