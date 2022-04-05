import axios from'axios';
import jwtDecode from 'jwt-decode';

/**
 * Logout (delete token on LocalStorage and Axios)
 */
function logout()
{
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Authentification HTTP request and stock token in LocalStorage and Axios
 * @param {object} credentials  
 */
function authenticate(credentials)
{
    return axios
        .post('http://localhost:8000/api/login_check', credentials)
        .then(response => response.data.token)
        .then(token => {
            // stock token in localStorage
            window.localStorage.setItem("authToken", token);
            // tells Axios that we have now a default header on all of our future HTTP request 
            setAxiosToken(token);
        })
}

/**
 * Put JWT token on Axios
 * @param {string} token JWT
 */
function setAxiosToken(token)
{
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Setup on the application loading
 */
function setup()
{
    // check if we have a token
    const token = window.localStorage.getItem("authToken");
    // check if token is valid
    if (token) {
        const jwtData = jwtDecode(token);
        if (jwtData.exp * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        }
    }
}

/**
 * check if we are authenticate or not
 * @returns boolean
 */
function isAuthenticated()
{
    // check if we have a token
    const token = window.localStorage.getItem("authToken");
    // check if token is valid
    if (token) {
        const jwtData = jwtDecode(token);
        if (jwtData.exp * 1000 > new Date().getTime()) {
            setAxiosToken(token);
            return true;
        }
        return false;
    }
    return false;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};