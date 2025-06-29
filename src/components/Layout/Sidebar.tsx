import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Pill, 
  ClipboardList, 
  FileText, 
  Activity, 
  Settings, 
  Users,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      roles: ['Admin', 'Pharmacist']
    },
    {
      name: 'Medicines',
      href: '/medicines',
      icon: Pill,
      roles: ['Admin', 'Pharmacist']
    },
    {
      name: 'Issue Medicine',
      href: '/issue',
      icon: ClipboardList,
      roles: ['Admin', 'Pharmacist']
    },
    {
      name: 'Issuances',
      href: '/issuances',
      icon: TrendingUp,
      roles: ['Admin', 'Pharmacist']
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: FileText,
      roles: ['Admin', 'Pharmacist']
    },
    {
      name: 'Alerts',
      href: '/alerts',
      icon: AlertTriangle,
      roles: ['Admin', 'Pharmacist']
    },
    {
      name: 'Activity Log',
      href: '/activities',
      icon: Activity,
      roles: ['Admin']
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      roles: ['Admin']
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: ['Admin']
    }
  ];

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 h-full">
      <nav className="px-4 py-6">
        <ul className="space-y-2">
          {filteredItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;