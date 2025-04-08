// filepath: /Users/apple/Downloads/project 4 copy/frontend/src/components/admin/LuckyDraw.tsx
import React, { useState } from 'react';
import { Trophy, Users, RefreshCw, Award } from 'lucide-react';
import { useTickets } from '../../contexts/TicketContext';
import toast from 'react-hot-toast';

const LuckyDraw: React.FC = () => {
  const { verifiedTickets, getRandomWinners, selectFinalWinner } = useTickets();
  const [finalists, setFinalists] = useState<any[]>([]);
  const [winner, setWinner] = useState<any | null>(null);
  const [isGeneratingFinalists, setIsGeneratingFinalists] = useState(false);
  const [isSelectingWinner, setIsSelectingWinner] = useState(false);

  const handleGenerateFinalists = async () => {
    setIsGeneratingFinalists(true);
    setWinner(null);
    
    // Fetch random winners from the backend
    const selectedFinalists = await getRandomWinners(100);
    setFinalists(selectedFinalists);
    setIsGeneratingFinalists(false);
    
    if (selectedFinalists.length === 0) {
      toast.error('No verified tickets available for the draw');
    } else if (selectedFinalists.length < 100) {
      toast.success(`Generated ${selectedFinalists.length} finalists (all available tickets)`);
    } else {
      toast.success('Successfully generated 100 finalists');
    }
  };

  const handleSelectWinner = async () => {
    if (finalists.length === 0) {
      toast.error('Please generate finalists first');
      return;
    }
    
    setIsSelectingWinner(true);
    
    // Call the backend API to select the final winner
    const selectedWinner = await selectFinalWinner(finalists);
    setWinner(selectedWinner);
    setIsSelectingWinner(false);
    
    if (selectedWinner) {
      toast.success('Winner has been selected!');
    } else {
      toast.error('Failed to select a winner');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Lucky Draw System</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Total Participants</h2>
          <div className="text-3xl font-bold text-indigo-600">{verifiedTickets.length}</div>
          <p className="text-gray-600">Verified tickets eligible for draw</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Finalists</h2>
          <div className="text-3xl font-bold text-amber-600">{finalists.length}</div>
          <p className="text-gray-600">Selected for final draw</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Prize Pool</h2>
          <div className="text-3xl font-bold text-green-600">$1,000,000</div>
          <p className="text-gray-600">Grand prize for the winner</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Draw Controls</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Step 1: Generate Finalists</h3>
                <p className="text-gray-600 mb-4">
                  This will randomly select 100 participants from all verified tickets.
                </p>
                <button
                  onClick={handleGenerateFinalists}
                  disabled={isGeneratingFinalists || verifiedTickets.length === 0}
                  className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center ${
                    (isGeneratingFinalists || verifiedTickets.length === 0) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isGeneratingFinalists ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Generating Finalists...
                    </>
                  ) : (
                    <>
                      <Users className="h-5 w-5 mr-2" />
                      Generate 100 Finalists
                    </>
                  )}
                </button>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Step 2: Select Winner</h3>
                <p className="text-gray-600 mb-4">
                  This will randomly select the final winner from the 100 finalists.
                </p>
                <button
                  onClick={handleSelectWinner}
                  disabled={isSelectingWinner || finalists.length === 0}
                  className={`w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center ${
                    (isSelectingWinner || finalists.length === 0) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSelectingWinner ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Selecting Winner...
                    </>
                  ) : (
                    <>
                      <Trophy className="h-5 w-5 mr-2" />
                      Select Final Winner
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Winner Announcement</h2>
          </div>
          
          <div className="p-6">
            {winner ? (
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-block bg-amber-100 p-4 rounded-full">
                    <Trophy className="h-16 w-16 text-amber-600" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-indigo-700 mb-2">
                  Congratulations!
                </h3>
                
                <div className="bg-indigo-50 rounded-lg p-6 mb-4">
                  <p className="text-xl font-semibold text-indigo-800">{winner.name}</p>
                  <p className="text-gray-600">Ticket #: {winner.ticketNumber}</p>
                  <p className="text-gray-600">Email: {winner.email}</p>
                  <p className="text-gray-600">Phone: {winner.phone}</p>
                </div>
                
                <p className="text-green-600 font-semibold text-lg">
                  Has won the grand prize of $1,000,000!
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {finalists.length > 0
                    ? "Ready to select the winner! Click 'Select Final Winner' to proceed."
                    : "No winner selected yet. First generate the finalists, then select the winner."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {finalists.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Finalists ({finalists.length})</h2>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket #
                    </th>
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
                      Purchase Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {finalists.map((finalist) => (
                    <tr key={finalist.id} className={`hover:bg-gray-50 ${winner && winner.id === finalist.id ? 'bg-amber-50' : ''}`}>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                        {finalist.ticketNumber}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{finalist.name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-500">{finalist.email}</div>
                        <div className="text-gray-500">{finalist.phone}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                        {finalist.nic}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                        {new Date(finalist.purchaseDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyDraw;