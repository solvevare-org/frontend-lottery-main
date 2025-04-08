// filepath: /Users/apple/Downloads/project 4 copy/frontend/src/components/CreateLotteryEvent.js
import React, { useState } from 'react';
import { createLotteryEvent } from '../api.d';

const CreateLotteryEvent = () => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { name, date };
            const response = await createLotteryEvent(data);
            console.log('Lottery Event Created:', response);
        } catch (error) {
            console.error('Error creating lottery event:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Event Name"
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <button type="submit">Create Event</button>
        </form>
    );
};

export default CreateLotteryEvent;