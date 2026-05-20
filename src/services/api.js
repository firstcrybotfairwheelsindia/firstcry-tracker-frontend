import axios from 'axios'

const API = axios.create({
  baseURL: 'https://api.fcbot.fairwheels.in/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default API