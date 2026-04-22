"use client";

import { useState, useEffect } from "react";
import {
  X,
  Bookmark,
  AlertCircle,
  CheckCircle,
  Tag,
  Calendar,
  Filter,
} from "lucide-react";
// import Modal from "../ui/Modal";
import Modal from "components/ui/Modal";
// import Button from "../ui/Button";
import Button from "components/ui/Button";

const SaveSearchModal = ({
  isOpen,
  onClose,
  searchName,
  setSearchName,
  onSave,
  resultCount,
}) => {
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (searchName.length > 2) {
      const mockSuggestions = [
        `${searchName} tools`,
        `${searchName} equipment`,
        `${searchName} rental`,
        `best ${searchName}`,
      ];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions(mockSuggestions.slice(0, 3));
    } else {
      setSuggestions([]);
    }
  }, [searchName]);

  const handleSave = () => {
    if (!searchName.trim()) {
      setError("Please enter a name for this search");
      return;
    }
    if (searchName.length > 50) {
      setError("Search name must be less than 50 characters");
      return;
    }
    onSave();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save This Search" size="md">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Name
          </label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="e.g., 'Power Tools in Downtown'"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 ${
              error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
            autoFocus
          />
          {error && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {error}
            </p>
          )}
        </div>

        {suggestions.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setSearchName(suggestion)}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Filter className="h-4 w-4 text-green-500" />
            Search Criteria:
          </h4>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Tag className="h-3 w-3" />
              <span>{resultCount} matching items</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>Saved on {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="primary"
            onClick={handleSave}
            className="flex-1"
            icon={<Bookmark className="h-4 w-4" />}
          >
            Save Search
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Your saved searches will appear in your dashboard. You can manage them
          anytime.
        </p>
      </div>
    </Modal>
  );
};

export default SaveSearchModal;
