import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Award, DollarSign } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">Welcome to the Lottery System</h1>
        <p className="text-xl text-gray-600">Your chance to win big with just one ticket!</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">How It Works</h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Ticket className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Purchase a Ticket</h3>
              <p className="text-gray-600">Fill out your details, make a payment, and upload proof of payment.</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Get Verified</h3>
              <p className="text-gray-600">Admin verifies your payment and issues your lottery ticket.</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Win Big</h3>
              <p className="text-gray-600">On draw day, 100 finalists are selected, and one lucky winner is chosen!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Current Lottery</h2>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Grand Prize: $1,000,000</h3>
            <p className="text-gray-600 mb-4">Don't miss your chance to become a millionaire!</p>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="font-medium text-indigo-800">Draw Date: December 31, 2025</p>
              <p className="text-indigo-600">Tickets Available: 1,000,000</p>
            </div>
          </div>
          <div className="text-center">
            <Link
              to="/buy-ticket"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Buy Your Ticket Now
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Previous Winners</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <p className="font-medium">John Doe</p>
              <p className="text-gray-600">Won $750,000 on November 15, 2024</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <p className="font-medium">Jane Smith</p>
              <p className="text-gray-600">Won $500,000 on October 1, 2024</p>
            </div>
            <div>
              <p className="font-medium">Robert Johnson</p>
              <p className="text-gray-600">Won $1,200,000 on August 20, 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;