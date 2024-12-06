import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  MessageSquare, 
  FileText, 
  LayoutDashboard,
  Vote,
  ShoppingBag,
  Settings,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useTheme } from '../lib/theme';

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
}

interface ExternalLink {
  label: string;
  href: string;
  description: string;
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Vote, label: 'Decision Hub', href: '/decisions' },
  { icon: MessageSquare, label: 'Forums', href: '/forums' },
  { icon: Calendar, label: 'Events', href: '/events' },
  { icon: ShoppingBag, label: 'Bazaar', href: '/bazaar' },
  { icon: Building2, label: 'Services', href: '/services' },
  { icon: FileText, label: 'Resources', href: '/resources' },
  { icon: Settings, label: 'Settings', href: '/settings' }
];

const externalLinks: ExternalLink[] = [
  { 
    label: 'Auroville Foundation', 
    href: 'http://www.aurovillefoundation.org.in/',
    description: 'Official Foundation Website'
  },
  { 
    label: 'Directory', 
    href: 'https://directory.auroville.services/',
    description: 'Community Directory'
  },
  { 
    label: 'Media Portal', 
    href: 'https://auroville.media/',
    description: 'News and Media'
  },
  { 
    label: 'Wiki', 
    href: 'https://wiki.auroville.org.in/wiki/Welcome',
    description: 'Community Knowledge Base'
  }
];

export default function Sidebar() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();

  return (
    <div className="h-screen w-64 flex flex-col bg-white dark:bg-[#1a1a1a] border-r border-gray-200 dark:border-[#2a2a2a]">
      <div className="p-6 border-b border-gray-200 dark:border-[#2a2a2a]">
        <Link to="/" className="flex items-center">
          <img 
            src={theme === 'dark' ? "/logodark.png" : "/logolight.png"}
            alt="Auroville Community" 
            className="h-8 w-auto"
          />
        </Link>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <div className="px-4 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#FDF1EC] dark:bg-[#E27B58]/20 text-[#E27B58]'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      isActive 
                        ? 'text-[#E27B58]' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="px-4 pt-4 pb-2">
          <h3 className="px-4 text-xs font-semibold uppercase tracking-wider mb-3 text-gray-500 dark:text-gray-400">
            External Resources
          </h3>
          <ul className="space-y-1">
            {externalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
              >
                <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <span className="block text-sm font-medium">{link.label}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {link.description}
                  </span>
                </div>
              </a>
            ))}
          </ul>
        </div>
      </nav>

      {isAuthenticated && user && (
        <div className="p-4 border-t border-gray-200 dark:border-[#2a2a2a]">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E27B58&color=fff`}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Community Member
              </p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}