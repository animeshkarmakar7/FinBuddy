import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  TrendingUp,
  DollarSign,
  Target,
  Edit,
  Camera,
  Shield,
  CheckCircle,
  Clock,
  Star,
  Trophy,
  Zap,
  Activity,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  // Format join date
  const getJoinDate = () => {
    if (!user?.createdAt) return 'Recently';
    const date = new Date(user.createdAt);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };


  // Account statistics
  const accountStats = [
    {
      id: 1,
      title: 'Total Worth',
      value: '$86,700',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'Active Investments',
      value: '28',
      change: '+3 this month',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-violet-500 to-purple-500'
    },
    {
      id: 3,
      title: 'Goals Achieved',
      value: '12/15',
      change: '80% complete',
      trend: 'up',
      icon: Target,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 4,
      title: 'Member Level',
      value: 'Gold',
      change: 'Premium',
      trend: 'up',
      icon: Award,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  // Activity timeline
  const activities = [
    {
      id: 1,
      type: 'investment',
      title: 'Purchased Bitcoin',
      description: 'Invested $5,000 in BTC',
      time: '2 hours ago',
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Achievement Unlocked',
      description: 'Earned "Diversified Investor" badge',
      time: '5 hours ago',
      icon: Trophy,
      color: 'amber'
    },
    {
      id: 3,
      type: 'transaction',
      title: 'Dividend Received',
      description: 'Received $1,250 dividend payment',
      time: '1 day ago',
      icon: DollarSign,
      color: 'blue'
    },
    {
      id: 4,
      type: 'goal',
      title: 'Goal Completed',
      description: 'Reached $50,000 savings milestone',
      time: '2 days ago',
      icon: Target,
      color: 'violet'
    },
    {
      id: 5,
      type: 'investment',
      title: 'Sold Apple Stock',
      description: 'Sold 25 shares of AAPL for $4,462',
      time: '3 days ago',
      icon: Activity,
      color: 'rose'
    }
  ];

  // Achievements/Badges
  const achievements = [
    {
      id: 1,
      name: 'Early Bird',
      description: 'Made first investment',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      earned: true,
      date: 'Jan 2023'
    },
    {
      id: 2,
      name: 'Diversified Investor',
      description: 'Invested in 4+ categories',
      icon: Trophy,
      color: 'from-blue-500 to-cyan-500',
      earned: true,
      date: 'Mar 2023'
    },
    {
      id: 3,
      name: 'High Roller',
      description: 'Portfolio value over $50k',
      icon: Star,
      color: 'from-violet-500 to-purple-500',
      earned: true,
      date: 'Jun 2023'
    },
    {
      id: 4,
      name: 'Consistent Saver',
      description: 'Saved for 6 months straight',
      icon: Target,
      color: 'from-emerald-500 to-teal-500',
      earned: true,
      date: 'Aug 2023'
    },
    {
      id: 5,
      name: 'Risk Taker',
      description: 'Invested in high-risk assets',
      icon: Activity,
      color: 'from-rose-500 to-pink-500',
      earned: false,
      date: 'Locked'
    },
    {
      id: 6,
      name: 'Millionaire',
      description: 'Reach $1M portfolio value',
      icon: Award,
      color: 'from-purple-500 to-indigo-500',
      earned: false,
      date: 'Locked'
    }
  ];

  // Portfolio growth data
  const portfolioGrowth = [
    { month: 'Jan', value: 45000 },
    { month: 'Feb', value: 48000 },
    { month: 'Mar', value: 52000 },
    { month: 'Apr', value: 58000 },
    { month: 'May', value: 64000 },
    { month: 'Jun', value: 72000 },
    { month: 'Jul', value: 76000 },
    { month: 'Aug', value: 81000 },
    { month: 'Sep', value: 86700 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50">
      <div className="lg:ml-72 transition-all duration-500 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 mt-16 lg:mt-0">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2 animate-fade-in">
              My Profile 👤
            </h1>
            <p className="text-violet-600/70">Manage your account and view your progress</p>
          </div>

          {/* Profile Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-violet-200/50 mb-8 animate-slide-up">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-violet-500/30">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    getUserInitials()
                  )}
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                  <Camera className="w-4 h-4 text-violet-600" />
                </button>
                {user?.isEmailVerified && (
                  <div className="absolute -top-2 -right-2 p-2 bg-emerald-500 rounded-full shadow-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold text-violet-800">{user?.name || 'User'}</h2>
                      {user?.isEmailVerified && (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-violet-600/70 mb-4">
                      {user?.bio || 'Passionate about financial freedom and smart investing. Building wealth one investment at a time.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-violet-50/50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg">
                      <Mail className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs text-violet-600/70">Email</p>
                      <p className="font-semibold text-violet-800">{user?.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-violet-50/50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg">
                      <Phone className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs text-violet-600/70">Phone</p>
                      <p className="font-semibold text-violet-800">{user?.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-violet-50/50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg">
                      <MapPin className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs text-violet-600/70">Location</p>
                      <p className="font-semibold text-violet-800">
                        {user?.address?.city && user?.address?.state 
                          ? `${user.address.city}, ${user.address.state}` 
                          : 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-violet-50/50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg">
                      <User className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs text-violet-600/70">Role</p>
                      <p className="font-semibold text-violet-800 capitalize">{user?.role || 'User'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-violet-600/70">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {getJoinDate()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {accountStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.id}
                  className={`relative overflow-hidden bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer`}
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 100}ms forwards`,
                    opacity: 0
                  }}
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
                    <p className="text-sm text-white/90">{stat.change}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Portfolio Growth & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Portfolio Growth Chart */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
              <h3 className="text-xl font-bold text-violet-800 mb-6">Portfolio Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={portfolioGrowth}>
                  <defs>
                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                  <XAxis dataKey="month" stroke="#8b5cf6" />
                  <YAxis stroke="#8b5cf6" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #c4b5fd',
                      borderRadius: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#growthGradient)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
              <h3 className="text-xl font-bold text-violet-800 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex gap-3 group cursor-pointer"
                      style={{
                        animation: `slideInRight 0.5s ease-out ${index * 100}ms forwards`,
                        opacity: 0
                      }}
                    >
                      <div className={`p-2 rounded-lg bg-${activity.color}-100 text-${activity.color}-600 h-fit group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-violet-800 text-sm">{activity.title}</p>
                        <p className="text-xs text-violet-600/70 mb-1">{activity.description}</p>
                        <div className="flex items-center gap-1 text-xs text-violet-600/50">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-200/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-violet-800 mb-1">Achievements</h3>
                <p className="text-sm text-violet-600/70">Your milestones and badges</p>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold">
                4/6 Unlocked
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                      achievement.earned
                        ? `bg-gradient-to-br ${achievement.color} text-white`
                        : 'bg-gray-100 text-gray-400'
                    }`}
                    style={{
                      animation: `fadeIn 0.5s ease-out ${index * 80}ms forwards`,
                      opacity: 0
                    }}
                  >
                    {achievement.earned && (
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -translate-y-12 translate-x-12" />
                      </div>
                    )}

                    <div className="relative z-10">
                      <div className={`p-3 rounded-xl w-fit mb-4 ${
                        achievement.earned ? 'bg-white/20 backdrop-blur-sm' : 'bg-gray-200'
                      }`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h4 className="font-bold text-lg mb-2">{achievement.name}</h4>
                      <p className={`text-sm mb-3 ${achievement.earned ? 'text-white/80' : 'text-gray-500'}`}>
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="w-3 h-3" />
                        {achievement.date}
                      </div>
                    </div>
                  </div>
                );
              })}
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

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

export default Profile;
