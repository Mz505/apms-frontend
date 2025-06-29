import React, { useState, useEffect } from 'react';
import {
  Pill,
  Users,
  AlertTriangle,
  Calendar,
  TrendingUp,
  DollarSign,
  Activity,
  Clock
} from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import { dashboardAPI } from '../services/api';
import { DashboardStats, ActivityLog } from '../types';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const formatPriceToPKR = (price: number) => {
    return price.toLocaleString('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };


  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, activitiesData] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRecentActivities()
      ]);

      setStats(statsData);
      setRecentActivities(activitiesData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case 'Add': return '+';
      case 'Update': return '✓';
      case 'Delete': return '×';
      case 'Issue': return '→';
      case 'Login': return '↩';
      case 'Logout': return '↪';
      default: return '·';
    }
  };

  const getActivityColor = (actionType: string) => {
    switch (actionType) {
      case 'Add': return 'success';
      case 'Update': return 'info';
      case 'Delete': return 'danger';
      case 'Issue': return 'warning';
      case 'Login': case 'Logout': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to AKRAMZADA Pharmacy Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Pill className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Medicines
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalMedicines || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Low Stock Alerts
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.lowStockMedicines || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Expiring Soon
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.expiringMedicines || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalStockValue ? formatPriceToPKR(stats.totalStockValue) : formatPriceToPKR(0)}
              </p>

              {/* <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats?.totalStockValue?.toLocaleString() || 0}
              </p> */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Today's Issuances
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.todayIssuances || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900">
              <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Monthly Issuances
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.monthlyIssuances || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900">
              <Users className="w-6 h-6 text-teal-600 dark:text-teal-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalUsers || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activities
            </h3>
          </div>
        </CardHeader>
        <CardContent>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-start space-x-3 py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex-shrink-0">
                    <Badge
                      variant={getActivityColor(activity.actionType) as any}
                      size="sm"
                    >
                      {getActivityIcon(activity.actionType)}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        by {activity.performedBy.name}
                      </p>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{format(new Date(activity.createdAt), 'MMM dd, HH:mm')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No recent activities
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;