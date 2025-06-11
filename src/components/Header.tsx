import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Moon, Sun, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg group-hover:scale-105 transition-transform duration-200">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              CountdownBuilder
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <LayoutDashboard className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">Dashboard</span>
                </Link>
                
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors duration-200"
                  >
                    <Shield className="w-4 h-4 text-purple-700 dark:text-purple-300" />
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300 hidden sm:block">Admin</span>
                  </Link>
                )}
                
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <User className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">{user.name}</span>
                </div>
                
                <button
                  onClick={logout}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;