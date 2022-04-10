import axios from "axios";
import { USERS_API_URL } from "../config";

function register(user)
{
    return axios.post(USERS_API_URL, user);
};

export default {
    register
};