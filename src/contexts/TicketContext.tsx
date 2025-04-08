// filepath: /Users/apple/Downloads/project 4 copy/frontend/src/contexts/TicketContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';

interface Ticket {
  id: string;
  name: string;
  phone: string;
  email: string;
  nic: string;
  paymentScreenshot: string;
  status: string;
  ticketNumber: string;
  purchaseDate: Date;
}

interface TicketContextType {
  tickets: Ticket[];
  pendingTickets: Ticket[];
  verifiedTickets: Ticket[];
  purchaseTicket: (ticketData: FormData) => Promise<void>;
  verifyTicket: (id: string) => Promise<void>;
  rejectTicket: (id: string) => Promise<void>;
  fetchPendingTickets: () => Promise<void>;
  fetchVerifiedTickets: () => Promise<void>;
  getRandomWinners: (count: number) => Promise<Ticket[]>;
  selectFinalWinner: (finalists: Ticket[]) => Promise<Ticket | null>;
  issueManualTicket: (ticketData: { name: string; email: string; phone: string; nic: string }) => Promise<void>;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [verifiedTickets, setVerifiedTickets] = useState<Ticket[]>([]);

  const fetchPendingTickets = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/pending-tickets');
      if (!response.ok) {
        throw new Error('Failed to fetch pending tickets');
      }
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching pending tickets:', error);
    }
  };

  const purchaseTicket = async (ticketData: FormData) => {
    try {
      const response = await fetch('http://localhost:5000/ticket/purchase', {
        method: 'POST',
        body: ticketData,
      });

      if (!response.ok) {
        throw new Error('Failed to purchase ticket');
      }

      const data = await response.json();
      setTickets((prevTickets) => [...prevTickets, data]);
      fetchPendingTickets();
    } catch (error) {
      console.error('Error purchasing ticket:', error);
    }
  };

  const verifyTicket = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/verify-ticket/${id}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to verify ticket');
      }

      const data = await response.json();
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === id ? { ...ticket, status: 'verified' } : ticket
        )
      );
      fetchVerifiedTickets();
    } catch (error) {
      console.error('Error verifying ticket:', error);
    }
  };

  const rejectTicket = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/reject-ticket/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to reject the ticket');
      }
    } catch (error) {
      console.error('Error rejecting ticket:', error);
      throw error;
    }
  };

  const fetchVerifiedTickets = async () => {
    try {
      const response = await fetch('http://localhost:5000/ticket/verified-tickets');
      if (!response.ok) {
        throw new Error('Failed to fetch verified tickets');
      }
      const data = await response.json();
      setVerifiedTickets(data);
    } catch (error) {
      console.error('Error fetching verified tickets:', error);
    }
  };

  const getRandomWinners = async (count: number) => {
    try {
      const response = await fetch(`http://localhost:5000/ticket/random-winners?count=${count}`);
      if (!response.ok) {
        throw new Error('Failed to fetch random winners');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching random winners:', error);
      return [];
    }
  };

  const selectFinalWinner = async (finalists: Ticket[]): Promise<Ticket | null> => {
    try {
      const response = await fetch('http://localhost:5000/ticket/select-final-winner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ finalists }),
      });

      if (!response.ok) {
        throw new Error('Failed to select final winner');
      }

      const winner = await response.json();
      return winner;
    } catch (error) {
      console.error('Error selecting final winner:', error);
      return null;
    }
  };

  const issueManualTicket = async (ticketData: { name: string; email: string; nic: string }) => {
    try {
      const response = await fetch('http://localhost:5000/admin/issue-manual-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        throw new Error('Failed to issue manual ticket');
      }

      const data = await response.json();
      setTickets((prevTickets) => [...prevTickets, data]);
      fetchVerifiedTickets();
    } catch (error) {
      console.error('Error issuing manual ticket:', error);
    }
  };

  useEffect(() => {
    fetchVerifiedTickets();
  }, []);

  const pendingTickets = tickets.filter((ticket) => ticket.status === 'pending');
  const verifiedTicketsFromTickets = tickets.filter((ticket) => ticket.status === 'verified');

  return (
    <TicketContext.Provider
      value={{
        tickets,
        pendingTickets,
        verifiedTickets: verifiedTickets.length ? verifiedTickets : verifiedTicketsFromTickets,
        purchaseTicket,
        verifyTicket,
        rejectTicket,
        fetchPendingTickets,
        fetchVerifiedTickets,
        getRandomWinners,
        selectFinalWinner,
        issueManualTicket,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};