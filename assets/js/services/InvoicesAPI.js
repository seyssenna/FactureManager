import axios from "axios";
import {INVOICES_API_URL} from "../config";

function findAll()
{
    return axios
        .get(INVOICES_API_URL)
        .then(response => response.data["hydra:member"]);
};

function find(id)
{
    return axios.get(INVOICES_API_URL + "/" + id).then(response => response.data);
};

function deleteInvoice(id)
{
    return  axios.delete(INVOICES_API_URL + "/" + id);
};

function update(id, invoice)
{
    return axios.put(INVOICES_API_URL + "/" + id, {...invoice, customer: `/api/customers/${invoice.customer}`});
};

function create(invoice) 
{
    return axios.post(INVOICES_API_URL, {...invoice, customer: `/api/customers/${invoice.customer}`});
};

export default {
    findAll,
    find,
    update,
    create,
    delete: deleteInvoice
};