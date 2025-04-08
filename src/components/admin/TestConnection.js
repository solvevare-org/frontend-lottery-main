// filepath: /Users/apple/Downloads/project 4 copy/frontend/src/components/TestConnection.js
import React, { useEffect, useState } from 'react';
import { testConnection } from '../api';

const TestConnection = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const response = await testConnection();
                setMessage(response.message);
            } catch (error) {
                console.error('Error fetching message:', error);
                setMessage('Error connecting to backend');
            }
        };

        fetchMessage();
    }, []);

    return (
        <div>
            <h1>Backend Connection Test</h1>
            <p>{message}</p>
        </div>
    );
};

export default TestConnection;