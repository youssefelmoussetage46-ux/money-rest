import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Banknote,
  PiggyBank,
  Calendar,
  Plus,
  Edit,
  Trash2,
  CreditCard,
  Settings as SettingsIcon,
  RefreshCw,
  User,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';

interface IconProps {
  name: 'trending-up' | 'trending-down' | 'banknote' | 'piggy-bank' | 'calendar' | 'plus' | 'edit' | 'trash-2' | 'credit-card' | 'settings' | 'refresh-cw' | 'user' | 'moon' | 'sun' | 'menu' | 'x';
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className = '' }) => {
  const icons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    'trending-up': TrendingUp,
    'trending-down': TrendingDown,
    'banknote': Banknote,
    'piggy-bank': PiggyBank,
    'calendar': Calendar,
    'plus': Plus,
    'edit': Edit,
    'trash-2': Trash2,
    'credit-card': CreditCard,
    'settings': SettingsIcon,
    'refresh-cw': RefreshCw,
    'user': User,
    'moon': Moon,
    'sun': Sun,
    'menu': Menu,
    'x': X
  };

  const IconComponent = icons[name] || TrendingUp; // Default to trending-up

  return <IconComponent className={className} />;
};

export default Icon;