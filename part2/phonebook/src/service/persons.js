import axios from "axios";
const dataUrl = "http://localhost:3012/persons";

const getAllData = () => axios.get(dataUrl).then((r) => r.data);
const postData = (data) => axios.post(dataUrl, data).then((r) => r.data);
const putData = (data, id) => axios.put(`${dataUrl}/${id}`, data).then((r) => r.data);
const deleteData = (id) => axios.delete(`${dataUrl}/${id}`).then((r) => r.data);

export default { getAllData, postData, putData, deleteData };
