import React, { useState, useEffect } from 'react';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import { Link } from 'react-router-dom';
import CustomersAPI from '../services/CustomersAPI';
import axios from 'axios';
import InvoicesAPI from '../services/invoicesAPI';

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

    const [editing, setEditing] = useState(false)

    // Retrieve customers list
    const fetchCustomers = async ()=> {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            if (!invoice.customer && id === "new") {
                setInvoice({...invoice, customer: data[0].id});
            }
        } catch (error) {
            console.log(error.response);
        };
    };

    // Retrive invoice to updtate
    const fetchInvoice = async (id) => {
        try {
            const data = await axios.get("http://localhost:8000/api/invoices/" + id).then(response => response.data);   
            // const data = await InvoicesAPI.find(id);
            const { amount, status, customer } = data;
            setInvoice({ amount, status, customer: customer.id });
        } catch (error) {
            console.log(error.response)
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
                const response = await axios.put("http://localhost:8000/api/invoices/" + id, {...invoice, customer: `/api/customers/${invoice.customer}`});
                // await InvoicesAPI.update(id, invoice);
                // TODO : success flash notification
                console.log(response);
            } else {
                const response = await axios.post("http://localhost:8000/api/invoices", {...invoice, customer: `/api/customers/${invoice.customer}`});
                // await InvoicesAPI.create(invoice);
                // TODO : success flash notification
                props.history.replace("/invoices");
            }
        } catch (error) {
            if (error.response.data.violations) {
                const apiErrors = {};
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
                // TODO : errors flash notifcation
            };
        }
    }

    return ( 
        <>
            {editing ? <h1>Modification du client</h1> : <h1>Création d'une facture</h1>}
            <form onSubmit={handleSubmit}>
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
            </form>   
        </> 
    );
}
 
export default InvoicePage;