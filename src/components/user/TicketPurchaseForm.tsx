import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TicketPurchaseForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        nic: '',
    });
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPaymentScreenshot(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!paymentScreenshot) {
            toast.error('Please upload a payment screenshot');
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('nic', formData.nic);
        data.append('paymentScreenshot', paymentScreenshot);

        try {
            const response = await axios.post('http://localhost:5000/api/ticket/purchase', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Ticket purchased successfully');
        } catch (error) {
            toast.error('Failed to purchase ticket');
            console.error('Error purchasing ticket:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                    Phone
                </label>
                <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="nic" className="block text-gray-700 font-medium mb-2">
                    NIC
                </label>
                <input
                    type="text"
                    id="nic"
                    name="nic"
                    value={formData.nic}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="paymentScreenshot" className="block text-gray-700 font-medium mb-2">
                    Payment Screenshot
                </label>
                <input
                    type="file"
                    id="paymentScreenshot"
                    name="paymentScreenshot"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
            >
                Purchase Ticket
            </button>
        </form>
    );
};

export default TicketPurchaseForm;