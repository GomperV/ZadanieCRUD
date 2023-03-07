import axios from 'axios';

const baza = axios.create({
  baseURL: 'http://localhost:8091',
});

export default baza;