import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import CustomersAPI from '../services/CustomersAPI';
import { Link } from 'react-router-dom';

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    const itemsPerPage = 10;

    // Retrieve customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    // Retrieve customers on component loading
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Delete customer
    const handleDelete = async (id) => {
        const originalCustomers = [...customers];

        // Approche optimiste
        setCustomers(customers.filter(customer => customer.id !== id));
        
        // Approche pessimiste
        try{
            await CustomersAPI.delete(id);
        } catch (error) {
            setCustomers(originalCustomers); 
        }
    };

    // Manage page changing
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Retrive input value to search for filter
    const handleSearch = event => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    };

    // Manage search filter
    const filteredCustomers = customers.filter(
        customer => 
            customer.firstName.toLowerCase().includes(search.toLowerCase()) || 
            customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            customer.email.toLowerCase().includes(search.toLowerCase()) ||
            (customer.company && customer.company.toLowerCase().includes(search.toLowerCase()))
    );
    
    // Manage data pagination
    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPage);

    return ( 
        <>
            <div className="mb-3 div d-flex justify-content-between align-items-center">
                <h1>Liste des clients</h1>
                <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>
            </div>
            
            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher. . ."/>
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id.</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCustomers.map(customer => 
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td><a href="#">{customer.firstName} {customer.lastName}</a></td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center">{customer.invoices.length}</td>
                            <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                            <td>
                                <button 
                                    onClick={() => handleDelete(customer.id)} 
                                    disabled={customer.invoices.length > 0} 
                                    className="btn btn-sm btn-danger"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    )}
                    
                </tbody>
            </table>
            
            { itemsPerPage < filteredCustomers.length && <Pagination 
                currentPage={currentPage} 
                itemsPerPage={itemsPerPage} 
                length={filteredCustomers.length} 
                onPageChanged={handlePageChange} />
            }
            
        </> 
    );
}
 
export default CustomersPage;