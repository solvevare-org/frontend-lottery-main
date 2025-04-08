import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, User, LogOut } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Ticket className="h-6 w-6" />
            <span className="text-xl font-bold">Lottery System</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/buy-ticket" className="hover:text-indigo-200 transition-colors">
              Buy Ticket
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/admin/dashboard" className="hover:text-indigo-200 transition-colors">
                  Admin Dashboard
                </Link>
                <Link to="/admin/lucky-draw" className="hover:text-indigo-200 transition-colors">
                  Lucky Draw
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-indigo-200 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/admin/login" className="flex items-center space-x-1 hover:text-indigo-200 transition-colors">
                <User className="h-4 w-4" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;