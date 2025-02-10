import axios from 'axios';
// 2.15: Phonebook step7
const url = '/api/persons';

const getAll = async () => {
    const res = axios.get(url);
    return res.then(res => res.data);
};

const getById = async (id) => {
    const res = axios.get(`${url}/${id}`);
    return res.then(res => res.data);
};

const create = async (newContact) => {
    const res = axios.post(url, newContact);
    return res.then(res => res.data);
};

const update = async (id, newContact) => {
    const res = axios.put(`${url}/${id}`, newContact);
    return res.then(res => res.data);
};

const remove = async (id) => {
    const res = axios.delete(`${url}/${id}`);
    return res.then(res => res.status);
};

export default { getAll, getById, create, update, remove };