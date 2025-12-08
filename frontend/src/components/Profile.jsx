import React, { useState, useEffect } from 'react';
import IndianRupee from './icons/IndianRupee';
import { useAuth } from '../context/AuthContext';
import { transactionAPI } from '../services/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
  Edit,
  Save,
  X,

  TrendingUp,
  Target,
  Award,
  Loader,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile, updatePassword } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
    fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [statsRes, transactionsRes] = await Promise.all([
        transactionAPI.getStats(),
        transactionAPI.getAll(),
      ]);

      setStats(statsRes.data || {});
      setRecentTransactions((transactionsRes.data || []).slice(0, 5));
    } catch (err) {
      console.error('Error fetching profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  const getJoinDate = () => {
    if (!user?.createdAt) return 'Recently';
    const date = new Date(user.createdAt);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await updateUserProfile(profileData);
      setSuccess('Profile updated successfully!');
      setIsEditingProfile(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccess('Password updated successfully!');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const accountStats = [
    {
      id: 1,
      title: 'Total Worth',
      value: `$${(stats?.netWorth || 0).toLocaleString()}`,
      change: 'Net Worth',
      icon: IndianRupee,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'Active Investments',
      value: stats?.totalInvestment ? `$${stats.totalInvestment.toLocaleString()}` : '$0',
      change: 'Total Invested',
      icon: TrendingUp,
      color: 'from-violet-500 to-purple-500'
    },
    {
      id: 3,
      title: 'Total Transactions',
      value: stats?.transactionCount || 0,
      change: 'All Time',
      icon: Target,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 4,
      title: 'Member Level',
      value: user?.role === 'admin' ? 'Admin' : 'User',
      change: user?.isEmailVerified ? 'Verified' : 'Unverified',
      icon: Award,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 flex items-center justify-center">
        <Loader className="w-16 h-16 text-violet-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50">
      <div className="lg:ml-72 transition-all duration-500 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 mt-16 lg:mt-0">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
              My Profile 👤
            </h1>
            <p className="text-violet-600/70">Manage your account settings and preferences</p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-700 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-rose-100 border border-rose-300 rounded-xl text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-violet-200/50 mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 h-32"></div>
            <div className="px-6 pb-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
                <div className="flex items-end gap-4">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
                    {getUserInitials()}
                  </div>
                  <div className="mb-2">
                    <h2 className="text-2xl font-bold text-violet-800">{user?.name}</h2>
                    <p className="text-violet-600/70 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user?.email}
                    </p>
                    <p className="text-sm text-violet-600/70 flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4" />
                      Member since {getJoinDate()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  {isEditingProfile ? <X className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
                  {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {/* Profile Form */}
              {isEditingProfile ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4 bg-violet-50/50 p-6 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-violet-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 bg-white border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-violet-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 bg-white border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-violet-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 bg-white border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-violet-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 bg-white border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <Save className="w-5 h-5" />
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-violet-50/50 rounded-xl">
                    <Phone className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="text-sm text-violet-600/70">Phone</p>
                      <p className="font-semibold text-violet-800">{user?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-violet-50/50 rounded-xl">
                    <MapPin className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="text-sm text-violet-600/70">Address</p>
                      <p className="font-semibold text-violet-800">{user?.address || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-violet-50/50 rounded-xl">
                    <Shield className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="text-sm text-violet-600/70">Role</p>
                      <p className="font-semibold text-violet-800 capitalize">{user?.role || 'user'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-violet-50/50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="text-sm text-violet-600/70">Email Status</p>
                      <p className="font-semibold text-violet-800">
                        {user?.isEmailVerified ? 'Verified ✓' : 'Not Verified'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {accountStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.id}
                  className={`relative overflow-hidden bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
                >
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                  </div>
                  <div className="relative z-10">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl w-fit mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-white/80 text-sm mb-2">{stat.title}</p>
                    <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                    <p className="text-sm text-white/80">{stat.change}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Security Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-violet-200/50 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-violet-800 mb-1">Security Settings</h3>
                <p className="text-sm text-violet-600/70">Manage your password and security preferences</p>
              </div>
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Lock className="w-5 h-5" />
                {isChangingPassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {isChangingPassword && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 bg-violet-50/50 p-6 rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-violet-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 bg-white border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-600 hover:text-violet-800"
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-violet-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 bg-white border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-600 hover:text-violet-800"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-violet-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 bg-white border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-600 hover:text-violet-800"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Save className="w-5 h-5" />
                  Update Password
                </button>
              </form>
            )}
          </div>

          {/* Recent Activity */}
          {recentTransactions.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-violet-200/50 p-6">
              <h3 className="text-xl font-bold text-violet-800 mb-6">Recent Activity</h3>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 bg-violet-50/50 rounded-xl hover:bg-violet-50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-violet-800">{transaction.merchant}</p>
                      <p className="text-sm text-violet-600/70">
                        {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className={`font-bold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
