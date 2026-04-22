"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
// import Modal from "../ui/Modal";
import Modal from "components/ui/Modal";
import Button from "components/ui/Button";

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (confirmText !== "DELETE") {
      setError('Please type "DELETE" to confirm');
      return;
    }
    setError("");
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Account" size="md">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800 dark:text-red-300">
              Warning: This action cannot be undone
            </h4>
            <p className="text-sm text-red-700 dark:text-red-400 mt-1">
              Deleting your account will permanently remove all your data,
              including shared items, exchanges, messages, and reviews.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              DELETE
            </span>{" "}
            to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE here"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700"
            autoFocus
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {isDeleting ? "Deleting..." : "Permanently Delete Account"}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
