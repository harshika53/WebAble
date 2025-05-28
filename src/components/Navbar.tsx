import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/scan', label: 'New Scan' },
    { to: '/history', label: 'History' }
  ];

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <CheckCircle2 className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">WebAble</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors hover:text-primary-600',
                    isActive ? 'text-primary-600' : 'text-gray-600'
                  )
                }
                end={item.to === '/'}
              >
                {item.label}
              </NavLink>
            ))}
            <button className="btn btn-primary">Sign In</button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-2 rounded-md text-base font-medium',
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )
                  }
                  end={item.to === '/'}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <button 
                className="btn btn-primary mx-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};