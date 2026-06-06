import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, CheckCircle2, Sun, Moon } from 'lucide-react';
import { cn } from '../utils/cn';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/scan', label: 'New Scan' },
    { to: '/history', label: 'History' },
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        buttonRef.current?.focus();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-800/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md p-1"
            >
              <CheckCircle2 className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                WebAble
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'text-sm font-medium transition-colors hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md px-2 py-1',
                      isActive
                        ? 'text-primary-600'
                        : 'text-gray-600 dark:text-gray-300 '
                    )
                  }
                  end={item.to === '/'}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center justify-center p-2 rounded-md border border-gray-300 dark:border-gray-700"
              aria-label="Toggle Theme"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>

          <button
            ref={buttonRef}
            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'md:hidden fixed inset-0 top-16 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-200 ease-in-out',
          isMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
        aria-hidden="true"
      />

      <div
        id="mobile-menu"
        ref={menuRef}
        className={cn(
          'md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-800  border-b border-gray-200 dark:border-gray-700 shadow-lg px-4 py-4 transition-all duration-300 ease-in-out origin-top z-40 transform-gpu',
          isMenuOpen
            ? 'opacity-100 translate-y-0 scale-y-100'
            : 'opacity-0 -translate-y-4 scale-y-95 pointer-events-none'
        )}
      >
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'block w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                )
              }
              end={item.to === '/'}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="mt-2 flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300"
          >
            {darkMode ? (
              <>
                <Sun className="h-5 w-5" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="h-5 w-5" />
                Dark Mode
              </>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};