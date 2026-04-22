"use client";

import { LogOut, Loader2 } from "lucide-react";
// import Modal from "../ui/Modal";
import Modal from "components/ui/Modal";
import Button from "components/ui/Button";

const LogoutModal = ({ isOpen, onClose, onConfirm, isLoggingOut }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Logout" size="sm">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
          <LogOut className="h-6 w-6 text-gray-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Are you sure you want to logout?
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            You will need to sign in again to access your account.
          </p>
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="flex-1"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {isLoggingOut ? "Logging out..." : "Yes, Logout"}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;
