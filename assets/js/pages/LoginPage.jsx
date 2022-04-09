import React, { useState, useContext } from 'react';
import AuthAPI from '../services/AuthAPI';
import AuthContext from '../contexts/AuthContext';
import Field from '../components/forms/Field';

const LoginPage = ({ history }) => {

    const { setIsAuthenticated } = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    
    // Manage inputs
    const handleChange = (event) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;
        setCredentials({...credentials, [name]: value})
    };

    // manage submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/customers");
        } catch (error) {
            setError("Aucun compte possède cette adresse ou alors les informations ne correspondent pas !")
        }
    };

    return ( 
        <>
            <h1>Connexion</h1>

            <form onSubmit={handleSubmit}>
                <Field 
                    label="Adresse email" 
                    name="username" 
                    value={credentials.username} 
                    onChange={handleChange} 
                    placeholder="Adresse email de connexion" 
                    error={error} 
                />
                <Field 
                    label="Mot de passe" 
                    name="password" 
                    value={credentials.password} 
                    onChange={handleChange} 
                    type="password"
                    error={error} 
                />
                
                <div className="form-group mt-3">
                    <button className="btn btn-success">Je me connecte</button>
                </div>
            </form>
        </> 
    );
}
 
export default LoginPage;