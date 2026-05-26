import axios from "axios";
const mainData = "https://studies.cs.helsinki.fi/restcountries/api/all";
const getData = (url = mainData) => axios.get(url).then((d) => d.data);

export default { getData };
