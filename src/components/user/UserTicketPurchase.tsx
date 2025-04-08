import React, { useState } from 'react';
import { Upload, CreditCard, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTickets } from '../../contexts/TicketContext';

const UserTicketPurchase: React.FC = () => {
  const { purchaseTicket } = useTickets(); // Use the purchaseTicket from context
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nic, setNic] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<number>(1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentScreenshot(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', name);
      data.append('phone', phone);
      data.append('email', email);
      data.append('nic', nic);
      if (paymentScreenshot) {
        data.append('paymentScreenshot', paymentScreenshot);
      }

      const response = await purchaseTicket(data); // Ensure response is declared
      console.log('Ticket purchased:', response); // Log the response

      toast.success('Ticket purchase request submitted successfully');
      toast.success('Admin will verify your payment and issue your ticket');

      // Reset form
      setName('');
      setPhone('');
      setEmail('');
      setNic('');
      setPaymentScreenshot(null);
      setStep(1);
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      toast.error('Error purchasing ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!name || !phone || !email || !nic)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Purchase Lottery Ticket</h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Ticket Purchase Form</h2>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <div className="text-center w-10">Personal Info</div>
              <div className="text-center w-10">Payment</div>
              <div className="text-center w-10">Confirmation</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {step === 1 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">User Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="nic" className="block text-gray-700 font-medium mb-2">
                      NIC Number
                    </label>
                    <input
                      type="text"
                      id="nic"
                      value={nic}
                      onChange={(e) => setNic(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your NIC number"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>

                <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-indigo-800 mb-2">Bank Transfer Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Payment Instructions:</p>
                      <p className="font-medium">Please upload your payment screenshot for verification.</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Upload Payment Screenshot
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {paymentScreenshot ? (
                        <div className="mb-2">
                          <img
                            src={URL.createObjectURL(paymentScreenshot)}
                            alt="Payment Screenshot"
                            className="max-h-48 mx-auto object-contain"
                          />
                        </div>
                      ) : (
                        <div className="py-8">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-gray-400 text-sm">PNG, JPG or JPEG (max. 5MB)</p>
                        </div>
                      )}
                      <input
                        type="file"
                        id="paymentScreenshot"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full cursor-pointer"
                        required={!paymentScreenshot}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!paymentScreenshot}
                      className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors ${
                        !paymentScreenshot ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Confirm Your Purchase</h3>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Purchase Summary</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">Full Name:</p>
                      <p className="font-medium">{name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Phone Number:</p>
                      <p className="font-medium">{phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Email Address:</p>
                      <p className="font-medium">{email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">NIC Number:</p>
                      <p className="font-medium">{nic}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Ticket Price:</span>
                      <span className="font-bold">$10.00</span>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <CreditCard className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-indigo-800">Payment Verification</h4>
                      <p className="text-sm text-indigo-700 mt-1">
                        Your payment screenshot has been uploaded and will be verified by our admin team.
                        Once verified, your lottery ticket will be issued and sent to your email.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Confirm Purchase
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserTicketPurchase;
