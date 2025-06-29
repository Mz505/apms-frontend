import React, { useState } from 'react';
import { Settings as SettingsIcon, Database, Shield, Bell, Palette, Save, Download, Upload } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [loading, setLoading] = useState<string | null>(null);
  const [systemSettings, setSystemSettings] = useState({
    pharmacyName: 'AKRAMZADA Pharmacy',
    address: '123 Main Street, City, Country',
    phone: '+1 234 567 8900',
    email: 'info@akramzada.com',
    lowStockThreshold: '10',
    expiryWarningDays: '30'
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '24',
    passwordMinLength: '6',
    requireTwoFactor: false,
    allowMultipleSessions: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    lowStockAlerts: true,
    expiryAlerts: true,
    emailNotifications: true,
    systemAlerts: true
  });

  const handleSystemSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSystemSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSecuritySettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };

  const saveSettings = async (settingType: string) => {
    setLoading(settingType);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${settingType} settings saved successfully`);
    } catch (error) {
      toast.error(`Failed to save ${settingType} settings`);
    } finally {
      setLoading(null);
    }
  };

  const backupDatabase = async () => {
    setLoading('backup');
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock backup file
      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        data: 'Mock backup data...'
      };
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pharmacy_backup_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('Database backup completed successfully');
    } catch (error) {
      toast.error('Failed to backup database');
    } finally {
      setLoading(null);
    }
  };

  const restoreDatabase = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setLoading('restore');
        try {
          // Simulate restore process
          await new Promise(resolve => setTimeout(resolve, 2000));
          toast.success('Database restored successfully');
        } catch (error) {
          toast.error('Failed to restore database');
        } finally {
          setLoading(null);
        }
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          System Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure and manage system preferences
        </p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Appearance
            </h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Dark Mode
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Toggle between light and dark theme
              </p>
            </div>
            <Button
              onClick={toggleTheme}
              variant={isDark ? 'primary' : 'secondary'}
            >
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SettingsIcon className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                System Configuration
              </h3>
            </div>
            <Button 
              onClick={() => saveSettings('System')}
              loading={loading === 'System'}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Pharmacy Name"
              name="pharmacyName"
              value={systemSettings.pharmacyName}
              onChange={handleSystemSettingsChange}
            />
            <Input
              label="Phone Number"
              name="phone"
              value={systemSettings.phone}
              onChange={handleSystemSettingsChange}
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={systemSettings.email}
              onChange={handleSystemSettingsChange}
            />
            <Input
              label="Low Stock Threshold"
              name="lowStockThreshold"
              type="number"
              value={systemSettings.lowStockThreshold}
              onChange={handleSystemSettingsChange}
            />
            <Input
              label="Expiry Warning (Days)"
              name="expiryWarningDays"
              type="number"
              value={systemSettings.expiryWarningDays}
              onChange={handleSystemSettingsChange}
            />
          </div>
          <Input
            label="Address"
            name="address"
            value={systemSettings.address}
            onChange={handleSystemSettingsChange}
          />
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security Settings
              </h3>
            </div>
            <Button 
              onClick={() => saveSettings('Security')}
              loading={loading === 'Security'}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Session Timeout (Hours)"
              name="sessionTimeout"
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={handleSecuritySettingsChange}
            />
            <Input
              label="Password Minimum Length"
              name="passwordMinLength"
              type="number"
              value={securitySettings.passwordMinLength}
              onChange={handleSecuritySettingsChange}
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Two-Factor Authentication
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Require 2FA for all user logins
                </p>
              </div>
              <input
                type="checkbox"
                name="requireTwoFactor"
                checked={securitySettings.requireTwoFactor}
                onChange={handleSecuritySettingsChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Multiple Sessions
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Allow users to login from multiple devices
                </p>
              </div>
              <input
                type="checkbox"
                name="allowMultipleSessions"
                checked={securitySettings.allowMultipleSessions}
                onChange={handleSecuritySettingsChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notification Preferences
              </h3>
            </div>
            <Button 
              onClick={() => saveSettings('Notification')}
              loading={loading === 'Notification'}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Low Stock Alerts
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Notify when medicines are running low
                </p>
              </div>
              <input
                type="checkbox"
                name="lowStockAlerts"
                checked={notificationSettings.lowStockAlerts}
                onChange={handleNotificationSettingsChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Expiry Alerts
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Notify when medicines are expiring soon
                </p>
              </div>
              <input
                type="checkbox"
                name="expiryAlerts"
                checked={notificationSettings.expiryAlerts}
                onChange={handleNotificationSettingsChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Email Notifications
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Send notifications via email
                </p>
              </div>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onChange={handleNotificationSettingsChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  System Alerts
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Show system-wide notifications
                </p>
              </div>
              <input
                type="checkbox"
                name="systemAlerts"
                checked={notificationSettings.systemAlerts}
                onChange={handleNotificationSettingsChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Database Management
            </h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Backup Database
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create a backup of your pharmacy data
              </p>
              <Button 
                onClick={backupDatabase}
                loading={loading === 'backup'}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Create Backup
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Restore Database
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Restore data from a backup file
              </p>
              <Button 
                onClick={restoreDatabase}
                loading={loading === 'restore'}
                variant="secondary"
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Restore Backup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            System Information
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Application Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Version:</span>
                  <span className="text-gray-900 dark:text-white">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Environment:</span>
                  <span className="text-gray-900 dark:text-white">Development</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                  <span className="text-gray-900 dark:text-white">Today</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Database Status
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Connection:</span>
                  <span className="text-green-600 dark:text-green-400">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="text-gray-900 dark:text-white">MongoDB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last Backup:</span>
                  <span className="text-gray-900 dark:text-white">Never</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;