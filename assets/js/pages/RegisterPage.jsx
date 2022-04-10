import React, { useState } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import axios from 'axios';
import UsersAPI from '../services/UsersAPI';
import { toast } from 'react-toastify';

const RegisterPage = (props) => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    // Manage inputs onChange
    const handleChange = (event) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;
        setUser({...user, [name]: value});
    };

    // Manage form submit on creating new user
    const handleSubmit = async (event) => {
        event.preventDefault();
        const apiErrors = {};
        if (user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm = "Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original";
            setErrors(apiErrors);
            toast.error("Des erreurs dans votre formulaire");
            return;
        }

        try {
            await UsersAPI.register(user);
            setErrors({});
            toast.success("Vous êtes désormais inscrit, vous pouvez vous connecter !");
            props.history.replace('/login');
        } catch (error) {
            console.log(error.response);
            if (error.response.data.violations) {
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
                toast.error("Des erreurs dans votre formulaire");
            };
        }
    }

return ( <>
        <h1>Inscription</h1>   

        <form onSubmit={handleSubmit}>
            <Field name="firstName" label="Prénom" placeholder="Votre prénom" error={errors.firstName} value={user.firstName} onChange={handleChange} />
            <Field name="lastName" label="Nom" placeholder="Votre nom" error={errors.lastName} value={user.lastName} onChange={handleChange} />
            <Field name="email" label="Email" placeholder="Votre Adresse email" type="email" error={errors.email} value={user.email} onChange={handleChange} />
            <Field name="password" label="Mot de passe" placeholder="Votre mot de passe" type="password" error={errors.password} value={user.password} onChange={handleChange} />
            <Field name="passwordConfirm" label="Confirmation" placeholder="Confirmez votre mot de passe" type="password" error={errors.passwordConfirm} value={user.passwordConfirm} onChange={handleChange} />

            <div className="form-group">
                <button type="submit" className="btn btn-success">Confirmation</button>
                <Link to="/login" className="btn btn-link" >J'ai déja un compte</Link>
            </div>
        </form>
    </> );
};
 
export default RegisterPage;