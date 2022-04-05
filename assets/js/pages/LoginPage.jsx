import React, { useState, useContext } from 'react';
import AuthAPI from '../services/AuthAPI';
import AuthContext from '../contexts/AuthContext';

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
                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input 
                        value={credentials.username} 
                        onChange={handleChange}
                        type="email" 
                        name="username"
                        className={"form-control" + (error && " is-invalid")}
                        placeholder="Adresse email de connexion" 
                        id="username" 
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password"></label>
                    <input 
                        value={credentials.password} 
                        onChange={handleChange}
                        type="password" 
                        name="password"
                        className="form-control" 
                        placeholder="Mot de passe" 
                        id="password" 
                    />
                </div>
                <div className="form-group">
                    <button className="btn btn-success">Je me connecte</button>
                </div>
            </form>
        </> 
    );
}
 
export default LoginPage;