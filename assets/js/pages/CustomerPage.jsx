import React, { useState, useEffect } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import CustomersAPI from '../services/CustomersAPI';

const CustomerPage = (props) => {

    const { id = "new" } = props.match.params;

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [editing, setEditing] = useState(false);

    // Retrieve customer to update using id
    const fetchCustomer = async id => {
        try {
            const { firstName, lastName, email, company } = await CustomersAPI.find(id)
            setCustomer({ firstName, lastName, email, company});
        } catch (error) {
            console.log(error.response);
            // TODO : errors flash notification
            props.history.replace("/customers");
        }    
    }

    // Load customer to update on component loading
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        };
    }, [id]);

    // Manage inputs onChange
    const handleChange = (event) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;
        setCustomer({...customer, [name]: value})
    };

    // Manage fom submit on create or update customer
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (editing) {
                await CustomersAPI.update(id, customer);
                console.log(response.data);
            } else {
                await CustomersAPI.create(customer);
                // TODO : success flash notification
                props.history.replace("/customer");
            }
            setErrors({});
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

    return ( <>
        {(!editing ? <h1>Création d'un client</h1> : <h1>Modification d'un client</h1>)}

        <form onSubmit={handleSubmit}>
            <Field name="lastName" label="Nom de famille" placeholder="Nom de famille du client" value={customer.lastName} onChange={handleChange} error={errors.lastName} />
            <Field name="firstName" label="Prénom" placeholder="Prénom du client" value={customer.firstName} onChange={handleChange} error={errors.firstName} />
            <Field name="email" label="Email" placeholder="Adresse email" type="email" value={customer.email} onChange={handleChange} error={errors.email} />
            <Field name="company" label="Entreprise" placeholder="Entreprise du client" value={customer.company} onChange={handleChange} error={errors.company} />

            <div className="div form-">
                <button type="submit" className="btn btn-success">Enregistrer</button>
                <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
            </div>
        </form>
    </> );
}
 
export default CustomerPage;