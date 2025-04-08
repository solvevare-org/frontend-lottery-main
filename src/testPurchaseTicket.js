const testPurchaseTicket = async () => {
    const data = new FormData();
    data.append('name', 'Test User');
    data.append('phone', '1234567890');
    data.append('email', 'testuser@example.com');
    data.append('nic', '123456789V');
    // Assuming a test image file is available in the uploads directory
    const file = new File([''], 'test-screenshot.png', { type: 'image/png' });
    data.append('paymentScreenshot', file);

    try {
        const response = await fetch('http://localhost:5000/ticket/purchase', {
            method: 'POST',
            body: data,
        });

        const result = await response.json();
        console.log('Response:', result);
    } catch (error) {
        console.error('Error:', error);
    }
};

testPurchaseTicket();
