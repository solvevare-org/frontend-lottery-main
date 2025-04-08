import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:5000",
});

export const purchaseTicket = async (data) => {
    const response = await api.post('/ticket/purchase', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const getTickets = async () => {
    const response = await api.get('/ticket/tickets');
    return response.data;
};

export const verifyTicket = async (ticketId) => {
    const response = await api.patch(`/admin/verify-ticket/${ticketId}`);
    return response.data;
};

export const verifyTicket = async (ticketId) => {
    const response = await api.delete(`/admin/reject-ticket/${ticketId}`);
    return response.data;
};

