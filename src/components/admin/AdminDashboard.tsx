import React, { useState, useEffect } from 'react';
import { Check, X, Mail, ExternalLink } from 'lucide-react';
import { useTickets } from '../../contexts/TicketContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const AdminDashboard: React.FC = () => {
    const { pendingTickets, verifiedTickets, verifyTicket, rejectTicket, fetchPendingTickets, fetchVerifiedTickets } = useTickets();
    const [localPendingTickets, setLocalPendingTickets] = useState(pendingTickets);
    const [localVerifiedTickets, setLocalVerifiedTickets] = useState(verifiedTickets);
    const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingTickets(); // Fetch pending tickets on component mount
        fetchVerifiedTickets(); // Fetch verified tickets on component mount
    }, []);
    
    useEffect(() => {
        setLocalPendingTickets(pendingTickets);
        setLocalVerifiedTickets(verifiedTickets);
    }, [pendingTickets, verifiedTickets]);

    const handleVerify = async (id: string) => {
        await verifyTicket(id);
        toast.success('Ticket verified and issued successfully');
        toast.success('Email notification sent to user');
        setLocalPendingTickets(localPendingTickets.filter(ticket => ticket._id !== id));
        const verifiedTicket = localPendingTickets.find(ticket => ticket._id === id);
        if (verifiedTicket) {
            setLocalVerifiedTickets([...localVerifiedTickets, verifiedTicket]);
        }
        setSelectedTicket(null);
    };

    const handleReject = async (id: string) => {
        try {
            await rejectTicket(id); // Ensure this function removes the ticket from the database
            toast.success('Ticket request rejected');
            setLocalPendingTickets(localPendingTickets.filter(ticket => ticket._id !== id));
            setSelectedTicket(null);
        } catch (error) {
            toast.error('Failed to reject the ticket');
            console.error('Error rejecting ticket:', error);
        }
    };

    const handleSendManualTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = form.email.value;
        const phone = form.phone.value;
        const name = form.name.value;
        const nic = form.nic.value;
    
        const data = {
            email,
            phone,
            name,
            nic,
        };
    
        try {
            const response = await axios.post('http://localhost:5000/ticket/purchase', data);
            if (response.status === 201) {
                toast.success(`Manual ticket sent to ${email}`);
                form.reset();
            } else {
                toast.error('Failed to issue manual ticket');
            }
        } catch (error) {
            toast.error('An error occurred while issuing the manual ticket');
            console.error('Error issuing manual ticket:', error);
        }
    };

    const selectedTicketDetails = localPendingTickets.find(t => t._id === selectedTicket);

    useEffect(() => {
        console.log('Selected Ticket:', selectedTicket);
        console.log('Selected Ticket Details:', selectedTicketDetails);
    }, [selectedTicket, selectedTicketDetails]);

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-indigo-700 mb-8">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-2">Pending Verifications</h2>
                    <div className="text-3xl font-bold text-indigo-600">{localPendingTickets.length}</div>
                    <p className="text-gray-600">Tickets awaiting verification</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-2">Verified Tickets</h2>
                    <div className="text-3xl font-bold text-green-600">{localVerifiedTickets.length}</div>
                    <p className="text-gray-600">Successfully issued tickets</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-2">Total Tickets</h2>
                    <div className="text-3xl font-bold text-blue-600">{localPendingTickets.length + localVerifiedTickets.length}</div>
                    <p className="text-gray-600">Out of 1,000,000 available</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-indigo-600 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Pending Ticket Verifications</h2>
                        </div>
                        
                        <div className="p-6">
                            {localPendingTickets.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No pending ticket verifications
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Contact
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    NIC
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {localPendingTickets.map((ticket) => (
                                                <tr key={ticket._id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">{ticket.name}</div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <div className="text-gray-500">{ticket.email}</div>
                                                        <div className="text-gray-500">{ticket.phone}</div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                                                        {ticket.nic}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                                                        {new Date(ticket.purchaseDate).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => setSelectedTicket(ticket._id)}
                                                                className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 px-3 py-1 rounded-md text-sm font-medium"
                                                            >
                                                                View
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                        <div className="bg-indigo-600 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Issue Manual Ticket</h2>
                        </div>
                        
                        <div className="p-6">
                            <form onSubmit={handleSendManualTicket}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                        User Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="user@example.com"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                        User Phone
                                    </label>
                                    <input
                                        type="phone"
                                        id="phone"
                                        name="phone"
                                        className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="01234567890"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                        User Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label htmlFor="nic" className="block text-gray-700 font-medium mb-2">
                                        NIC Number
                                    </label>
                                    <input
                                        type="text"
                                        id="nic"
                                        name="nic"
                                        className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="123456789X"
                                        required
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Issue Ticket
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Ticket Verification Modal */}
            {selectedTicket && selectedTicketDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
                        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Verify Ticket Purchase</h3>
                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="text-white hover:text-indigo-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <h4 className="font-medium text-gray-700 mb-1">User Information</h4>
                            <p className="text-gray-800 font-semibold">{selectedTicketDetails.name}</p>
                            <p className="text-gray-600">{selectedTicketDetails.email}</p>
                            <p className="text-gray-600">{selectedTicketDetails.phone}</p>
                            <p className="text-gray-600">NIC: {selectedTicketDetails.nic}</p>

                            <div className="mb-6">
                                <h4 className="font-medium text-gray-700 mb-2">Payment Screenshot</h4>
                                <div className="border border-gray-200 rounded-lg p-2">
                                    <div className="bg-gray-100 rounded flex items-center justify-center p-4">
                                        <img
                                            src={`http://localhost:5000/uploads/${selectedTicketDetails.paymentScreenshot}`}
                                            alt="Payment Screenshot"
                                            className="max-h-64 object-contain"
                                        />
                                    </div>
                                    <div className="mt-2 text-center">
                                        <a
                                            href={`http://localhost:5000/uploads/${selectedTicketDetails.paymentScreenshot}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center justify-center"
                                        >
                                            <ExternalLink className="h-3 w-3 mr-1" />
                                            View Full Size
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-4 mt-4">
                                <button
                                    onClick={() => handleVerify(selectedTicket)}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
                                >
                                    <Check className="h-5 w-5 mr-2" /> Verify & Issue Ticket
                                </button>

                                <button
                                    onClick={() => handleReject(selectedTicket)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
                                >
                                    <X className="h-5 w-5 mr-2" /> Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;