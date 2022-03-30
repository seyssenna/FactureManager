import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesAPI from '../services/invoicesAPI';
import moment from 'moment';

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
};

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}

const InvoicesPage = (props) => {
   
    const [invoices, setinvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    const itemsPerPage = 10;

    // Retrive invoices
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll();
            setinvoices(data);
        } catch (error) {
            console.log(error);
        }
        
    }
    // Retrieve invoices on component loading
    useEffect(() => {
        fetchInvoices();
    }, []);

    // Delete invoice
    const handleDelete = async (id) => {
        const originalinvoices = [...invoices];

        // Approche optimiste
        setinvoices(invoices.filter(invoice => invoice.id !== id));

        // Approche pessimiste
        try{
            await InvoicesAPI.delete(id);
            console.log("ok");
        } catch (error) {
            console.log(error);
            console.log("ko");
            setinvoices(originalinvoices); 
        }
    };

    // Manage page changing
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Manage date format with "Moment" package
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    // Retrive input value to search for filter
    const handleSearch = event => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    };

    // Manage search filter
    const filteredInvoices = invoices.filter(
        i => 
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) || 
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.company.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            i.chrono.toString().includes(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

     // Manage data pagination
     const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage);

    return ( 
        <>
            <h1>Liste des factures</h1>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher. . ."/>
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numero</th>
                        <th>Client</th>
                        <th>Entreprise</th>
                        <th className="text-center">Date</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedInvoices.map(invoice => <tr key={invoice.id}>
                        <td>{invoice.chrono}</td>
                        <td><a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a></td>
                        <td>{invoice.customer.company}</td>
                        <td className="text-center">{formatDate(invoice.sentAt)}</td>
                        <td className="text-center"><span className={"badge bg-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span></td>
                        <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                        <td>
                            <button className="btn btn-sm btn-primary me-1">Editer</button>
                            <button onClick={() => handleDelete(invoice.id)} className="btn btn-sm btn-danger">Supprimer</button>
                        </td>
                    </tr>)}
                    
                </tbody>
            </table>
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handlePageChange} length={filteredInvoices.length} />
        </> 
    );
}
 
export default InvoicesPage;