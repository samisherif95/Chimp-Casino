import axios from 'axios';

export const fetchTopTen = () => {
    return axios.get("/api/users/topten")
}

export const fetchUser = userId => {
    return axios.get(`/api/users/${userId}`)
}