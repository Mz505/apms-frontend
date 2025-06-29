import React, { useState, useEffect } from 'react';
import { Activity, Filter, Calendar, User } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { activityAPI } from '../services/api';
import { ActivityLog } from '../types';
import { format } from 'date-fns';

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    actionType: '',
    entityType: '',
    startDate: '',
    endDate: ''
  });

  const actionTypes = ['Add', 'Update', 'Delete', 'Issue', 'Login', 'Logout'];
  const entityTypes = ['Medicine', 'User', 'Issuance', 'System'];

  useEffect(() => {
    fetchActivities();
  }, []);

  // const fetchActivities = async () => {
  //   try {
  //     const response = await activityAPI.getAll(filters);
  //     setActivities(response.activities || []);
  //   } catch (error) {
  //     console.error('Failed to fetch activities:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const getActiveFilters = () => {
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
  );
  return Object.keys(activeFilters).length > 0 ? activeFilters : null;
};

 const fetchActivities = async () => {
  try {
    setLoading(true);
    const activeFilters = getActiveFilters();

    const response = await activityAPI.getAll(activeFilters || {});
    setActivities(response.activities || []);
  } catch (error) {
    console.error('Failed to fetch activities:', error);
  } finally {
    setLoading(false);
  }
};



  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setLoading(true);
    fetchActivities();
  };

  const getActionBadgeVariant = (actionType: string) => {
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
          Activity Log
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor all system activities and user actions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Action Type
              </label>
              <select
                name="actionType"
                value={filters.actionType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Actions</option>
                {actionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Entity Type
              </label>
              <select
                name="entityType"
                value={filters.entityType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Entities</option>
                {entityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex items-end">
              <Button onClick={applyFilters} className="w-full flex items-center justify-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Apply</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activities ({activities.length})
            </h3>
          </div>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex-shrink-0">
                    <Badge variant={getActionBadgeVariant(activity.actionType) as any}>
                      {activity.actionType}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                       <span>{activity.performedBy?.name || 'Unknown User'}</span>

                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                      </div>
                      <Badge variant="default" size="sm">
                        {activity.entityType}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No activities found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                No activities match your current filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Activities;