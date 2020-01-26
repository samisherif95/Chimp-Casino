import axios from 'axios';

export const fetchChatrooms = () => {
    return axios.post('/api/chatrooms');
};
