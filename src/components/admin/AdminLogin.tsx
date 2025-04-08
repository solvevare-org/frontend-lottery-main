import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import toast from 'react-hot-toast';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeRequired, setIsCodeRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, verifyCode } = useAdmin(); // Add verifyCode from AdminContext
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isCodeRequired) {
      try {
        const response = await verifyCode({ username, code: verificationCode });

        if (response && response.token) {
          localStorage.setItem('adminToken', response.token);
          toast.success('Verification successful');
          navigate('/admin/lucky-draw'); // Redirect to LuckyDraw page
        } else {
          toast.error('Invalid verification code. Please try again.');
        }
      } catch (error) {
        console.error('Error verifying code:', error);
        toast.error('An error occurred while verifying the code. Please try again.');
      }
    } else {
      try {
        const response = await login({ username, password });

        if (response) {
          if (response.token) {
            localStorage.setItem('adminToken', response.token);
            toast.success('Login successful');
            navigate('/admin/lucky-draw'); // Redirect to LuckyDraw page
          } else {
            toast.success('Verification code sent to your email. Please enter the code.');
            setIsCodeRequired(true);
          }
        } else {
          toast.error('Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        toast.error('An error occurred during login. Please try again.');
      }
    }

    setIsLoading(false);
  };

  const requestVerificationCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/auth/request-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }), // Use the entered username dynamically
      });

      if (response.ok) {
        toast.success('Verification code sent to your email');
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData); // Debugging log
        toast.error(`Failed to send verification code: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error requesting verification code:', error); // Debugging log
      toast.error('Failed to send verification code. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Admin Login</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {!isCodeRequired && (
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            )}

            {isCodeRequired && (
              <div className="mb-6">
                <label htmlFor="verificationCode" className="block text-gray-700 font-medium mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter the verification code"
                  required
                />
                <button
                  type="button"
                  onClick={requestVerificationCode}
                  className="mt-2 text-indigo-600 hover:underline"
                >
                  Resend Code
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Processing...' : isCodeRequired ? 'Verify' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;