import React, { useState, useEffect } from 'react';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import { Link } from 'react-router-dom';
import CustomersAPI from '../services/CustomersAPI';
import axios from 'axios';
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';
import { INVOICES_API_URL } from '../config';

const InvoicePage = (props) => {

    const { id = "new" } = props.match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });

    const [customers, setCustomers] = useState([]);

    const [editing, setEditing] = useState(false);

    const [loading, setLoading] = useState(true);

    // Retrieve customers list
    const fetchCustomers = async ()=> {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false);
            if (!invoice.customer && id === "new") {
                setInvoice({...invoice, customer: data[0].id});
            }
        } catch (error) {
            toast.error("Une erreur est survenue, impossible de charger les clients");
            props.history.replace("/invoices");
        };
    };

    // Retrive invoice to updtate
    const fetchInvoice = async (id) => {
        try {
            const data = await axios.get( INVOICES_API_URL + "/" + id).then(response => response.data);   
            // const data = await InvoicesAPI.find(id);
            const { amount, status, customer } = data;
            setInvoice({ amount, status, customer: customer.id });
            setLoading(false);
        } catch (error) {
            toast.error("Une erreur est survenue, impossible de charger la facture demandée");
            props.history.replace("/invoices");
        }
    }

    // Retrive customers list on component loading
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Retrieve the invoice to update on component loading depend on url params (/new) or (/:id)
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id])

    // Manage inputs onChange
    const handleChange = (event) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;
        setInvoice({...invoice, [name]: value});
    };

    // Manage form submit on updating or creating a new invoice
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (editing) {
                const response = await axios.put(INVOICES_API_URL + "/" + id, {...invoice, customer: `/api/customers/${invoice.customer}`});
                // await InvoicesAPI.update(id, invoice);
                toast.success("La facture a bien été modifiée");
            } else {
                const response = await axios.post(INVOICES_API_URL, {...invoice, customer: `/api/customers/${invoice.customer}`});
                // await InvoicesAPI.create(invoice);
                toast.success("La facture a bien été enregistrée");
                props.history.replace("/invoices");
            }
        } catch (error) {
            if (error.response.data.violations) {
                const apiErrors = {};
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
                toast.error("Des erreurs dans votre formulaire");
            };
        }
    }

    return ( 
        <>
            {editing ? <h1>Modification du client</h1> : <h1>Création d'une facture</h1>}

            {loading && <TableLoader />}

            {!loading && <form onSubmit={handleSubmit}>
                <Field name="amount" type="number" placeholder="Montant de la facture" label="Montant" onChange={handleChange} value={invoice.amount} error={errors.amount} />

                <Select name="customer" label="Client" value={invoice.customer} error={errors.customer} onChange={handleChange}>
                    {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>
                    ))}
                </Select>

                <Select name="status" label="Statut" value={invoice.status} error={errors.status} onChange={handleChange}>
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/invoices" className="btn btn-link" >Retour aux factures</Link>
                </div>
            </form> }  
        </> 
    );
}
 
export default InvoicePage;