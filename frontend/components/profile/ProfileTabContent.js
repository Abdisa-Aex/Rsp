"use client";

import ItemsGrid from "./ItemsGrid";
import ActivityLog from "./ActivityLog";
import ReviewList from "./ReviewList";
import SettingsPanel from "./SettingsPanel";
import WishlistGrid from "./WishlistGrid";
import ExchangesList from "./ExchangesList";
import NotificationsList from "./NotificationsList";
import AnalyticsOverview from "./AnalyticsOverview";

const ProfileTabContent = ({
  activeTab,
  searchQuery,
  setSearchQuery,
  itemsFilter,
  setItemsFilter,
  setShowAddItemModal,
  filteredItems,
  activityLog,
  savedSearches,
  borrowedItems,
  reviews,
  analytics,
  notifications,
  setNotifications,
  handleNotificationToggle,
  privacy,
  setPrivacy,
  showPassword,
  setShowPassword,
  setShowDeleteModal,
  setShowLogoutModal,
  handleExportData,
  handleQuickAction,
  addToast,
  wishlist,
  onRemoveFromWishlist,
  onMoveToRequest,
  exchanges,
  onReturn,
  onRate,
  notificationsData,
  onMarkAsRead,
  onMarkAllRead,
  onDeleteNotification,
  onClearAllNotifications,
}) => {
  switch (activeTab) {
    case "items":
      return (
        <ItemsGrid
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          itemsFilter={itemsFilter}
          setItemsFilter={setItemsFilter}
          setShowAddItemModal={setShowAddItemModal}
          filteredItems={filteredItems}
        />
      );

    case "activity":
      return (
        <ActivityLog activityLog={activityLog} savedSearches={savedSearches} />
      );

    case "borrowed":
      return (
        <div>
          <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Currently Borrowed
          </h3>
          <div className="space-y-4">
            {borrowedItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      From: {item.from}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Return by
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {item.returnDate}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.status === "Active"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {item.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Extend Rental
                    </button>
                    <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Message Owner
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "reviews":
      return <ReviewList reviews={reviews} />;

    case "wishlist":
      return (
        <WishlistGrid
          wishlist={wishlist}
          onRemove={onRemoveFromWishlist}
          onMoveToRequest={onMoveToRequest}
        />
      );

    case "exchanges":
      return (
        <ExchangesList
          exchanges={exchanges}
          onReturn={onReturn}
          onRate={onRate}
        />
      );

    case "notifications":
      return (
        <NotificationsList
          notifications={notificationsData}
          onMarkAsRead={onMarkAsRead}
          onMarkAllRead={onMarkAllRead}
          onDelete={onDeleteNotification}
          onClearAll={onClearAllNotifications}
        />
      );

    case "analytics":
      return <AnalyticsOverview analytics={analytics} />;

    case "settings":
      return (
        <SettingsPanel
          notifications={notifications}
          setNotifications={setNotifications}
          handleNotificationToggle={handleNotificationToggle}
          privacy={privacy}
          setPrivacy={setPrivacy}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          setShowDeleteModal={setShowDeleteModal}
          setShowLogoutModal={setShowLogoutModal}
          handleQuickAction={handleQuickAction}
        />
      );

    default:
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Select a tab to view content
          </p>
        </div>
      );
  }
};

export default ProfileTabContent;
