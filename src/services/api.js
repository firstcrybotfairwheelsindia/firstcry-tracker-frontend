import axios from 'axios'

const API = axios.create({
  baseURL: 'http://3.26.14.55:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default API