// import cache from "./cache";
import axios from "axios";
import {CUSTOMERS_API_URL} from "../config";

function findAll()
{
    return axios
        .get(CUSTOMERS_API_URL)
        .then(response => response.data["hydra:member"]);

// WITH CACHE W.I.P
    // const cachedCustomers = await cache.get("customers");
    // if (cachedCustomers) return cachedCustomers;
    // return axios
    //     .get("http://127.0.0.1:8000/api/customers")
    //     .then(response => {
    //         const customers = response.data["hydra:member"];
    //         cache.set("customers", customers);
    //         return customers;
    //     });
};

function find(id)
{
    return axios
        .get(CUSTOMERS_API_URL + "/" + id)
        .then(response => response.data);
}

function deleteCustomer(id)
{
    return  axios.delete(CUSTOMERS_API_URL + "/" + id)

// WITH CACHE W.I.P
    // return  axios
    //     .delete("http://127.0.0.1:8000/api/customers/" + id)
    //     .then(async response => {
    //         const cachedCustomers = await cache.get("customers");
    //         if (cachedCustomers) {
    //             cache.set("customers", cachedCustomers.filter(c => c.id !== id));
    //         };
    //         return response;
    //     })
};

function update(id, customer)
{
    return axios.put(CUSTOMERS_API_URL + "/" + id, customer);
};

function create(customer)
{
    return axios.post(CUSTOMERS_API_URL, customer);


};

export default {
    findAll,
    find,
    update,
    create,
    delete: deleteCustomer
};