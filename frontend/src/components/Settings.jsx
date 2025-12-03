import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Link,
  Database,
  HelpCircle,
  ChevronRight,
  Mail,
  Smartphone,
  Lock,
  Eye,
  Globe,
  Moon,
  Sun,
  Zap,
  Download,
  Upload,
  Trash2,
  LogOut,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  Key,
  Fingerprint,
  QrCode
} from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    activityStatus: true,
    dataSharing: false
  });

  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('english');
  const [currency, setCurrency] = useState('usd');

  // Settings sections
  const settingsSections = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: User,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      color: 'from-violet-500 to-purple-500'
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: Shield,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'connected',
      title: 'Connected Accounts',
      icon: Link,
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'data',
      title: 'Data & Backup',
      icon: Database,
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  // Connected accounts
  const connectedAccounts = [
    {
      id: 1,
      name: 'Google',
      email: 'john.doe@gmail.com',
      connected: true,
      icon: Mail
    },
    {
      id: 2,
      name: 'Bank of America',
      account: '****4532',
      connected: true,
      icon: CreditCard
    },
    {
      id: 3,
      name: 'PayPal',
      email: 'john@example.com',
      connected: false,
      icon: Smartphone
    }
  ];

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacy = (key) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50">
      <div className="lg:ml-72 transition-all duration-500 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 mt-16 lg:mt-0">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2 animate-fade-in">
              Settings ⚙️
            </h1>
            <p className="text-violet-600/70">Manage your preferences and account settings</p>
          </div>

          {/* Quick Settings Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {settingsSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  className={`group relative overflow-hidden bg-gradient-to-br ${section.color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer`}
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 100}ms forwards`,
                    opacity: 0
                  }}
                >
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      <ChevronRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Account Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50 mb-6 animate-slide-up">
            <h3 className="text-xl font-bold text-violet-800 mb-6 flex items-center gap-2">
              <User className="w-6 h-6" />
              Account Settings
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-violet-50/50 rounded-xl hover:bg-violet-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <Mail className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-violet-800">Email Address</p>
                    <p className="text-sm text-violet-600/70">john.doe@example.com</p>
                  </div>
                </div>
                <button className="text-violet-600 hover:text-violet-700 font-medium text-sm">
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-violet-50/50 rounded-xl hover:bg-violet-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <Lock className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-violet-800">Password</p>
                    <p className="text-sm text-violet-600/70">Last changed 3 months ago</p>
                  </div>
                </div>
                <button className="text-violet-600 hover:text-violet-700 font-medium text-sm">
                  Update
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-violet-50/50 rounded-xl hover:bg-violet-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <Smartphone className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-violet-800">Phone Number</p>
                    <p className="text-sm text-violet-600/70">+1 (555) 123-4567</p>
                  </div>
                </div>
                <button className="text-violet-600 hover:text-violet-700 font-medium text-sm">
                  Edit
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-violet-50/50 rounded-xl hover:bg-violet-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <Globe className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-violet-800">Language & Region</p>
                    <p className="text-sm text-violet-600/70">English (US)</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-violet-600" />
              </div>
            </div>
          </div>

          {/* Notifications & Security */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Notifications */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <h3 className="text-xl font-bold text-violet-800 mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6" />
                Notification Preferences
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-violet-50/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="font-semibold text-violet-800">Email Notifications</p>
                      <p className="text-xs text-violet-600/70">Receive updates via email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('email')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      notifications.email ? 'bg-gradient-to-r from-blue-500 to-violet-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        notifications.email ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-violet-50/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="font-semibold text-violet-800">Push Notifications</p>
                      <p className="text-xs text-violet-600/70">Get alerts on your device</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('push')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      notifications.push ? 'bg-gradient-to-r from-blue-500 to-violet-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        notifications.push ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-violet-50/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="font-semibold text-violet-800">SMS Notifications</p>
                      <p className="text-xs text-violet-600/70">Text message alerts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('sms')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      notifications.sms ? 'bg-gradient-to-r from-blue-500 to-violet-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        notifications.sms ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-violet-50/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="font-semibold text-violet-800">Marketing Updates</p>
                      <p className="text-xs text-violet-600/70">Promotions and offers</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification('marketing')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      notifications.marketing ? 'bg-gradient-to-r from-blue-500 to-violet-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        notifications.marketing ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <h3 className="text-xl font-bold text-violet-800 mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Security & Privacy
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-violet-50/50 rounded-xl hover:bg-violet-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="font-semibold text-violet-800">Two-Factor Authentication</p>
                      <p className="text-xs text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Enabled
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-violet-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-violet-50/50 rounded-xl hover:bg-violet-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="font-semibold text-violet-800">Biometric Login</p>
                      <p className="text-xs text-violet-600/70">Use fingerprint or face ID</p>
                    </div>
                  </div>
                  <button
                    className="relative w-12 h-6 rounded-full bg-gradient-to-r from-blue-500 to-violet-600"
                  >
                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-violet-50/50 rounded-xl hover:bg-violet-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="font-semibold text-violet-800">Activity Status</p>
                      <p className="text-xs text-violet-600/70">Show when you're active</p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePrivacy('activityStatus')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      privacy.activityStatus ? 'bg-gradient-to-r from-blue-500 to-violet-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        privacy.activityStatus ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-violet-50/50 rounded-xl hover:bg-violet-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="font-semibold text-violet-800">Data Sharing</p>
                      <p className="text-xs text-violet-600/70">Share analytics data</p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePrivacy('dataSharing')}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      privacy.dataSharing ? 'bg-gradient-to-r from-blue-500 to-violet-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        privacy.dataSharing ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance & Connected Accounts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Appearance */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
              <h3 className="text-xl font-bold text-violet-800 mb-6 flex items-center gap-2">
                <Palette className="w-6 h-6" />
                Appearance
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-violet-800 mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === 'light'
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-violet-200 hover:border-violet-300'
                      }`}
                    >
                      <Sun className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                      <p className="text-xs font-medium text-violet-800">Light</p>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-violet-200 hover:border-violet-300'
                      }`}
                    >
                      <Moon className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                      <p className="text-xs font-medium text-violet-800">Dark</p>
                    </button>
                    <button
                      onClick={() => setTheme('auto')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === 'auto'
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-violet-200 hover:border-violet-300'
                      }`}
                    >
                      <Zap className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                      <p className="text-xs font-medium text-violet-800">Auto</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-violet-800 mb-3">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-3 bg-violet-50 border border-violet-200 rounded-xl text-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="usd">USD - US Dollar ($)</option>
                    <option value="eur">EUR - Euro (€)</option>
                    <option value="gbp">GBP - British Pound (£)</option>
                    <option value="jpy">JPY - Japanese Yen (¥)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Connected Accounts */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
              <h3 className="text-xl font-bold text-violet-800 mb-6 flex items-center gap-2">
                <Link className="w-6 h-6" />
                Connected Accounts
              </h3>

              <div className="space-y-3">
                {connectedAccounts.map((account) => {
                  const Icon = account.icon;
                  return (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 bg-violet-50/50 rounded-xl hover:bg-violet-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          <Icon className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-violet-800">{account.name}</p>
                          <p className="text-xs text-violet-600/70">
                            {account.email || account.account}
                          </p>
                        </div>
                      </div>
                      {account.connected ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <button className="text-rose-600 hover:text-rose-700 text-sm font-medium">
                            Disconnect
                          </button>
                        </div>
                      ) : (
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                          Connect
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Data & Backup */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50 mb-6">
            <h3 className="text-xl font-bold text-violet-800 mb-6 flex items-center gap-2">
              <Database className="w-6 h-6" />
              Data & Backup
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <Download className="w-6 h-6" />
                <div className="text-left">
                  <p className="font-semibold">Export Data</p>
                  <p className="text-xs text-white/80">Download your data</p>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 bg-gradient-to-br from-violet-500 to-purple-500 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <Upload className="w-6 h-6" />
                <div className="text-left">
                  <p className="font-semibold">Backup Data</p>
                  <p className="text-xs text-white/80">Create a backup</p>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 bg-gradient-to-br from-rose-500 to-pink-500 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <Trash2 className="w-6 h-6" />
                <div className="text-left">
                  <p className="font-semibold">Delete Account</p>
                  <p className="text-xs text-white/80">Permanently remove</p>
                </div>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-rose-800 mb-2">Danger Zone</h3>
                <p className="text-sm text-rose-600/80 mb-4">
                  These actions are irreversible. Please proceed with caution.
                </p>
                <div className="flex gap-3">
                  <button className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium">
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Sign Out
                  </button>
                  <button className="px-6 py-2 bg-white border-2 border-rose-600 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors font-medium">
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Settings;
