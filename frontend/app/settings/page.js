"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Bell,
  Lock,
  CreditCard,
  Download,
  LogOut,
  HelpCircle,
  ExternalLink,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  Tablet,
  Watch,
  Headphones,
  Speaker,
  Mic,
  Camera,
  Shield,
  Key,
  Fingerprint,
  QrCode,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Save,
  X,
  Check,
  AlertTriangle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Menu,
  Settings as SettingsIcon,
  User as UserIcon,
  Bell as BellIcon,
  Lock as LockIcon,
  CreditCard as CreditCardIcon,
  Download as DownloadIcon,
  LogOut as LogOutIcon,
  HelpCircle as HelpCircleIcon,
  Trash2 as TrashIcon,
  Globe as GlobeIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
  Smartphone as SmartphoneIcon,
  Monitor as MonitorIcon,
  Tablet as TabletIcon,
  Watch as WatchIcon,
  Headphones as HeadphonesIcon,
  Speaker as SpeakerIcon,
  Mic as MicIcon,
  Camera as CameraIcon,
  Shield as ShieldIcon,
  Key as KeyIcon,
  Fingerprint as FingerprintIcon,
  QrCode as QrCodeIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Save as SaveIcon,
  X as XIcon,
  Check as CheckIcon,
  AlertTriangle as AlertTriangleIcon,
  Loader2 as Loader2Icon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { useToast } from "@/hooks/useToast";

export default function SettingsPage() {
  const router = useRouter();
  const { user, updateProfile, changePassword, logout, apiCall } = useAuth();
  const { addToast } = useToast();
  
  const [activeSection, setActiveSection] = useState('account');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Account Settings
  const [accountForm, setAccountForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: ''
  });
  
  // Security Settings
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    messageNotifications: true,
    requestNotifications: true,
    returnNotifications: true,
    reviewNotifications: true,
    promotionNotifications: false,
    systemNotifications: true
  });
  
  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    showLastSeen: true,
    showPoints: true,
    showBadges: true,
    allowMessages: true,
    allowRequests: true
  });
  
  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'system',
    fontSize: 'medium',
    compactView: false,
    animations: true,
    soundEffects: true,
    language: 'en'
  });
  
  // Data Settings
  const [dataSettings, setDataSettings] = useState({
    autoSaveDrafts: true,
    autoDownloadMedia: false,
    clearSearchHistory: false,
    clearChatHistory: false
  });
  
  // Load user data
  useEffect(() => {
    if (user) {
      setAccountForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || ''
      });
      
      if (user.preferences) {
        setNotificationSettings({
          emailNotifications: user.preferences.notifications?.email ?? true,
          pushNotifications: user.preferences.notifications?.push ?? true,
          smsNotifications: user.preferences.notifications?.sms ?? false,
          messageNotifications: user.preferences.notifications?.messages ?? true,
          requestNotifications: user.preferences.notifications?.requests ?? true,
          returnNotifications: user.preferences.notifications?.returns ?? true,
          reviewNotifications: user.preferences.notifications?.reviews ?? true,
          promotionNotifications: user.preferences.notifications?.promotions ?? false,
          systemNotifications: user.preferences.notifications?.system ?? true
        });
        
        setPrivacySettings({
          profileVisibility: user.preferences.privacy?.profileVisibility || 'public',
          showEmail: user.preferences.privacy?.showEmail ?? false,
          showPhone: user.preferences.privacy?.showPhone ?? false,
          showLocation: user.preferences.privacy?.showLocation ?? true,
          showLastSeen: user.preferences.privacy?.showLastSeen ?? true,
          showPoints: user.preferences.privacy?.showPoints ?? true,
          showBadges: user.preferences.privacy?.showBadges ?? true,
          allowMessages: user.preferences.privacy?.allowMessages ?? true,
          allowRequests: user.preferences.privacy?.allowRequests ?? true
        });
        
        setAppearanceSettings({
          theme: user.preferences.appearance?.theme || 'system',
          fontSize: user.preferences.appearance?.fontSize || 'medium',
          compactView: user.preferences.appearance?.compactView ?? false,
          animations: user.preferences.appearance?.animations ?? true,
          soundEffects: user.preferences.appearance?.soundEffects ?? true,
          language: user.preferences.language || 'en'
        });
      }
    }
  }, [user]);
  
  // Handle account update
  const handleAccountUpdate = async () => {
    setSaving(true);
    try {
      const result = await updateProfile({
        fullName: accountForm.fullName,
        phone: accountForm.phone,
        location: accountForm.location
      });
      if (result.success) {
        addToast('Account settings updated successfully', 'success');
      } else {
        addToast(result.error || 'Failed to update account settings', 'error');
      }
    } catch (error) {
      addToast('An error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle password change
  const handlePasswordChange = async () => {
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }
    
    if (securityForm.newPassword.length < 8) {
      addToast('Password must be at least 8 characters', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const result = await changePassword(securityForm.currentPassword, securityForm.newPassword);
      if (result.success) {
        addToast('Password changed successfully', 'success');
        setSecurityForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        addToast(result.error || 'Failed to change password', 'error');
      }
    } catch (error) {
      addToast('An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle notification settings update
  const handleNotificationUpdate = async () => {
    setSaving(true);
    try {
      const result = await apiCall('/users/me/preferences', {
        method: 'PUT',
        body: JSON.stringify({
          notifications: notificationSettings
        })
      });
      if (result.success) {
        addToast('Notification settings updated', 'success');
      } else {
        addToast(result.error || 'Failed to update notification settings', 'error');
      }
    } catch (error) {
      addToast('An error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle privacy settings update
  const handlePrivacyUpdate = async () => {
    setSaving(true);
    try {
      const result = await apiCall('/users/me/preferences', {
        method: 'PUT',
        body: JSON.stringify({
          privacy: privacySettings
        })
      });
      if (result.success) {
        addToast('Privacy settings updated', 'success');
      } else {
        addToast(result.error || 'Failed to update privacy settings', 'error');
      }
    } catch (error) {
      addToast('An error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle appearance settings update
  const handleAppearanceUpdate = async () => {
    setSaving(true);
    try {
      const result = await apiCall('/users/me/preferences', {
        method: 'PUT',
        body: JSON.stringify({
          appearance: {
            theme: appearanceSettings.theme,
            fontSize: appearanceSettings.fontSize,
            compactView: appearanceSettings.compactView,
            animations: appearanceSettings.animations,
            soundEffects: appearanceSettings.soundEffects
          },
          language: appearanceSettings.language
        })
      });
      if (result.success) {
        addToast('Appearance settings updated', 'success');
        // Apply theme immediately
        if (appearanceSettings.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (appearanceSettings.theme === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      } else {
        addToast(result.error || 'Failed to update appearance settings', 'error');
      }
    } catch (error) {
      addToast('An error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle data settings update
  const handleDataUpdate = async () => {
    setSaving(true);
    try {
      // Apply settings
      if (dataSettings.clearSearchHistory) {
        localStorage.removeItem('recentSearches');
        addToast('Search history cleared', 'success');
      }
      if (dataSettings.clearChatHistory) {
        await apiCall('/messages/history', { method: 'DELETE' });
        addToast('Chat history cleared', 'success');
      }
      
      addToast('Data settings updated', 'success');
      setDataSettings({
        ...dataSettings,
        clearSearchHistory: false,
        clearChatHistory: false
      });
    } catch (error) {
      addToast('An error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle export data
  const handleExportData = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/users/me/export');
      if (response.success) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = `resourcehub-data-${new Date().toISOString()}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        addToast('Data exported successfully', 'success');
      } else {
        addToast('Failed to export data', 'error');
      }
    } catch (error) {
      addToast('An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete account
  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setLoading(true);
      try {
        await apiCall('/users/me', { method: 'DELETE' });
        logout();
        router.push('/');
        addToast('Account deleted successfully', 'success');
      } catch (error) {
        addToast('Failed to delete account', 'error');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const sections = [
    { id: 'account', label: 'Account', icon: UserIcon },
    { id: 'security', label: 'Security', icon: LockIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'privacy', label: 'Privacy', icon: ShieldIcon },
    { id: 'appearance', label: 'Appearance', icon: SunIcon },
    { id: 'data', label: 'Data', icon: DownloadIcon }
  ];
  
  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-80">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
                </div>
                <nav className="p-2">
                  {sections.map(section => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          activeSection === section.id
                            ? 'bg-green-50 text-green-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${
                          activeSection === section.id ? 'text-green-600' : 'text-gray-500'
                        }`} />
                        <span className="font-medium">{section.label}</span>
                        <ChevronRightIcon className="h-4 w-4 ml-auto text-gray-400" />
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              {/* Account Section */}
              {activeSection === 'account' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={accountForm.fullName}
                        onChange={(e) => setAccountForm({ ...accountForm, fullName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={accountForm.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={accountForm.phone}
                        onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={accountForm.location}
                        onChange={(e) => setAccountForm({ ...accountForm, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="City, State"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <button
                        onClick={handleAccountUpdate}
                        disabled={saving}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Security Section */}
              {activeSection === 'security' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Change Password</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              value={securityForm.currentPassword}
                              onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={securityForm.newPassword}
                              onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={securityForm.confirmPassword}
                              onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <button
                          onClick={handlePasswordChange}
                          disabled={loading || !securityForm.currentPassword || !securityForm.newPassword}
                          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                          {loading ? 'Changing...' : 'Change Password'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        Enable 2FA
                      </button>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Active Sessions</h4>
                      <p className="text-sm text-gray-500 mb-4">
                        View and manage devices where youre logged in.
                      </p> 
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        Manage Sessions
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {key === 'emailNotifications' && 'Receive notifications via email'}
                            {key === 'pushNotifications' && 'Receive push notifications on your device'}
                            {key === 'smsNotifications' && 'Receive SMS notifications'}
                            {key === 'messageNotifications' && 'Get notified when you receive a new message'}
                            {key === 'requestNotifications' && 'Get notified when someone requests your item'}
                            {key === 'returnNotifications' && 'Get notified when an item is due for return'}
                            {key === 'reviewNotifications' && 'Get notified when you receive a review'}
                            {key === 'promotionNotifications' && 'Receive promotional offers and updates'}
                            {key === 'systemNotifications' && 'Receive system updates and announcements'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    ))}
                    
                    <div className="pt-4">
                      <button
                        onClick={handleNotificationUpdate}
                        disabled={saving}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {saving ? 'Saving...' : 'Save Preferences'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Privacy Section */}
              {activeSection === 'privacy' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Privacy Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['public', 'private', 'contacts'].map(option => (
                          <button
                            key={option}
                            onClick={() => setPrivacySettings({ ...privacySettings, profileVisibility: option })}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                              privacySettings.profileVisibility === option
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {privacySettings.profileVisibility === 'public' && 'Anyone can view your profile'}
                        {privacySettings.profileVisibility === 'private' && 'Only you can view your profile'}
                        {privacySettings.profileVisibility === 'contacts' && 'Only people you have interacted with can view your profile'}
                      </p>
                    </div>
                    
                    {Object.entries(privacySettings).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {key === 'showEmail' && 'Show your email address on your profile'}
                            {key === 'showPhone' && 'Show your phone number on your profile'}
                            {key === 'showLocation' && 'Show your location on your profile'}
                            {key === 'showLastSeen' && 'Show when you were last active'}
                            {key === 'showPoints' && 'Show your points on your profile'}
                            {key === 'showBadges' && 'Show your achievements on your profile'}
                            {key === 'allowMessages' && 'Allow other users to message you'}
                            {key === 'allowRequests' && 'Allow other users to request your items'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setPrivacySettings({ ...privacySettings, [key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    ))}
                    
                    <div className="pt-4">
                      <button
                        onClick={handlePrivacyUpdate}
                        disabled={saving}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {saving ? 'Saving...' : 'Save Privacy Settings'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Appearance Section */}
              {activeSection === 'appearance' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Appearance Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['light', 'dark', 'system'].map(option => (
                          <button
                            key={option}
                            onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: option })}
                            className={`px-4 py-3 rounded-lg text-sm font-medium capitalize ${
                              appearanceSettings.theme === option
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {option === 'light' && <Sun className="h-4 w-4 inline mr-2" />}
                            {option === 'dark' && <Moon className="h-4 w-4 inline mr-2" />}
                            {option === 'system' && <Monitor className="h-4 w-4 inline mr-2" />}
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['small', 'medium', 'large'].map(option => (
                          <button
                            key={option}
                            onClick={() => setAppearanceSettings({ ...appearanceSettings, fontSize: option })}
                            className={`px-4 py-3 rounded-lg text-sm font-medium ${
                              appearanceSettings.fontSize === option
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {option === 'small' && 'Small'}
                            {option === 'medium' && 'Medium'}
                            {option === 'large' && 'Large'}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-900">Compact View</p>
                        <p className="text-sm text-gray-500">Show more items per page</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={appearanceSettings.compactView}
                          onChange={(e) => setAppearanceSettings({ ...appearanceSettings, compactView: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-900">Animations</p>
                        <p className="text-sm text-gray-500">Enable smooth animations throughout the app</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={appearanceSettings.animations}
                          onChange={(e) => setAppearanceSettings({ ...appearanceSettings, animations: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-900">Sound Effects</p>
                        <p className="text-sm text-gray-500">Play sounds for notifications and actions</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={appearanceSettings.soundEffects}
                          onChange={(e) => setAppearanceSettings({ ...appearanceSettings, soundEffects: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={appearanceSettings.language}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, language: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                        <option value="ja">Japanese</option>
                      </select>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        onClick={handleAppearanceUpdate}
                        disabled={saving}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {saving ? 'Saving...' : 'Save Appearance Settings'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Data Section */}
              {activeSection === 'data' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Data Management</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-900">Auto-save Drafts</p>
                        <p className="text-sm text-gray-500">Automatically save your message drafts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dataSettings.autoSaveDrafts}
                          onChange={(e) => setDataSettings({ ...dataSettings, autoSaveDrafts: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-900">Auto-download Media</p>
                        <p className="text-sm text-gray-500">Automatically download images and videos in messages</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dataSettings.autoDownloadMedia}
                          onChange={(e) => setDataSettings({ ...dataSettings, autoDownloadMedia: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    
                    <div>
                      <button
                        onClick={() => setDataSettings({ ...dataSettings, clearSearchHistory: true })}
                        className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-left flex items-center justify-between"
                      >
                        <span>Clear Search History</span>
                        <TrashIcon className="h-4 w-4 text-gray-500" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1">Remove all your recent searches</p>
                    </div>
                    
                    <div>
                      <button
                        onClick={() => setDataSettings({ ...dataSettings, clearChatHistory: true })}
                        className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-left flex items-center justify-between"
                      >
                        <span>Clear Chat History</span>
                        <TrashIcon className="h-4 w-4 text-gray-500" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1">Delete all your conversations</p>
                    </div>
                    
                    <div>
                      <button
                        onClick={handleExportData}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-left flex items-center justify-between"
                      >
                        <span>Export All Data</span>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      </button>
                      <p className="text-xs text-gray-500 mt-1">Download a copy of your data</p>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <button
                        onClick={handleDataUpdate}
                        disabled={saving}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {saving ? 'Saving...' : 'Save Data Settings'}
                      </button>
                    </div>
                    
                    <div className="pt-6 border-t">
                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-red-800">Danger Zone</h4>
                            <p className="text-sm text-red-700 mt-1">
                              Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <button
                              onClick={handleDeleteAccount}
                              disabled={loading}
                              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                            >
                              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrashIcon className="h-4 w-4" />}
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}