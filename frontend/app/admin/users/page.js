"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Star,
  AlertCircle,
  Loader2,
  MoreVertical,
  Trash2,
  Edit,
  Ban,
  RefreshCw,
  Download,
  Eye,
  Shield,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const UserRow = ({ user, onEdit, onBan, onDelete, onViewDetails, onRoleChange }) => {
  const [showActions, setShowActions] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin": return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Admin</span>;
      case "moderator": return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Moderator</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">User</span>;
    }
  };

  const getStatusBadge = () => {
    if (user.isBanned) return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Banned</span>;
    if (user.isVerified) return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Verified</span>;
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Pending</span>;
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
            {user.fullName?.charAt(0) || "U"}
          </div>
          <div>
            <p className="font-medium">{user.fullName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="relative">
          <button onClick={() => setShowRoleMenu(!showRoleMenu)} className="flex items-center gap-1 hover:opacity-80">
            {getRoleBadge(user.role)}
            <ChevronDown className="h-3 w-3" />
          </button>
          {showRoleMenu && (
            <div className="absolute z-50 mt-1 w-32 bg-white rounded-lg shadow-lg border py-1">
              <button onClick={() => { onRoleChange(user, "user"); setShowRoleMenu(false); }} className="w-full px-3 py-1 text-left text-sm hover:bg-gray-100">User</button>
              <button onClick={() => { onRoleChange(user, "moderator"); setShowRoleMenu(false); }} className="w-full px-3 py-1 text-left text-sm hover:bg-gray-100">Moderator</button>
              <button onClick={() => { onRoleChange(user, "admin"); setShowRoleMenu(false); }} className="w-full px-3 py-1 text-left text-sm hover:bg-gray-100">Admin</button>
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3">{getStatusBadge()}</td>
      <td className="px-4 py-3 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
      <td className="px-4 py-3 text-sm">{user.stats?.itemsShared || 0}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          <span>{user.rating || "New"}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="relative">
          <button onClick={() => setShowActions(!showActions)} className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
              <button onClick={() => { onViewDetails(user); setShowActions(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                <Eye className="h-4 w-4" /> View Details
              </button>
              <button onClick={() => { onEdit(user); setShowActions(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                <Edit className="h-4 w-4" /> Edit User
              </button>
              <button onClick={() => { onBan(user); setShowActions(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-orange-600">
                <Ban className="h-4 w-4" /> {user.isBanned ? "Unban User" : "Ban User"}
              </button>
              <button onClick={() => { onDelete(user); setShowActions(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600">
                <Trash2 className="h-4 w-4" /> Delete User
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default function AdminUsersPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, apiCall } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBanConfirm, setShowBanConfirm] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login?redirect=/admin/users"); return; }
    if (!isAdmin()) { router.push("/dashboard"); return; }
    loadUsers();
  }, [page, search, roleFilter, statusFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20, search, role: roleFilter, status: statusFilter });
      const data = await apiCall(`/admin/users?${params.toString()}`);
      if (data.success) {
        const mappedUsers = data.users.map(u => ({ ...u, id: u._id }));
        setUsers(mappedUsers);
        setTotalPages(data.pagination.pages);
        setTotalUsers(data.pagination.total);
      }
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleRoleChange = async (user, newRole) => {
    setActionLoading(true);
    try {
      const data = await apiCall(`/admin/users/${user._id}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      });
      if (data.success) {
        setMessage({ type: "success", text: `Role changed to ${newRole}` });
        loadUsers();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) { setMessage({ type: "error", text: "Failed to change role" }); }
    finally { setActionLoading(false); }
  };

  const handleBanUser = async (userData) => {
    if (!banReason.trim() && !userData.isBanned) {
      alert("Please provide a reason");
      return;
    }
    setActionLoading(true);
    try {
      const action = userData.isBanned ? "unban" : "ban";
      const data = await apiCall(`/admin/users/${userData._id}/${action}`, {
        method: "PUT", // Change from POST to PUT
        body: JSON.stringify({ reason: banReason }),
      });
      if (data.success) {
        setMessage({ type: "success", text: `User ${action}ned successfully` });
        loadUsers();
        setShowBanConfirm(false);
        setBanReason("");
      }
    } catch (error) { setMessage({ type: "error", text: "Failed to ban/unban user" }); }
    finally { setActionLoading(false); }
  };

  const handleDeleteUser = async () => {
    setActionLoading(true);
    try {
      const data = await apiCall(`/admin/users/${selectedUser._id}`, { method: "DELETE" });
      if (data.success) {
        setMessage({ type: "success", text: "User deleted successfully" });
        loadUsers();
        setShowDeleteConfirm(false);
      }
    } catch (error) { setMessage({ type: "error", text: "Failed to delete user" }); }
    finally { setActionLoading(false); }
  };

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 lg:px-8">
          {message && (
            <div className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
              {message.text}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="h-5 w-5" /></Link>
              <div><h1 className="text-3xl font-bold">Manage Users</h1><p className="text-gray-500">{totalUsers} total users</p></div>
            </div>
            <div className="flex gap-3">
              <button onClick={loadUsers} className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"><RefreshCw className="h-4 w-4" /> Refresh</button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                </div>
              </div>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
                <option value="all">All Roles</option><option value="user">User</option><option value="moderator">Moderator</option><option value="admin">Admin</option>
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
                <option value="all">All Status</option><option value="active">Active</option><option value="banned">Banned</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr><th className="px-4 py-3 text-left text-xs font-medium">User</th><th className="px-4 py-3 text-left text-xs font-medium">Role</th><th className="px-4 py-3 text-left text-xs font-medium">Status</th><th className="px-4 py-3 text-left text-xs font-medium">Joined</th><th className="px-4 py-3 text-left text-xs font-medium">Items</th><th className="px-4 py-3 text-left text-xs font-medium">Rating</th><th className="px-4 py-3 text-left text-xs font-medium">Actions</th></tr>
                </thead>
                <tbody>
                  {loading ? <tr><td colSpan={7} className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></td></tr> : users.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-gray-500">No users found</td></tr> : users.map((user) => (
                    <UserRow key={user._id} user={user} onViewDetails={(u) => router.push(`/admin/users/${u._id}`)} onEdit={(u) => router.push(`/admin/users/${u._id}/edit`)} onBan={(u) => { setSelectedUser(u); setShowBanConfirm(true); }} onDelete={(u) => { setSelectedUser(u); setShowDeleteConfirm(true); }} onRoleChange={handleRoleChange} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {showBanConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full"><h3 className="text-xl font-bold mb-4">{selectedUser.isBanned ? "Unban User" : "Ban User"}</h3><p className="mb-4">{selectedUser.isBanned ? `Unban ${selectedUser.fullName}?` : `Ban ${selectedUser.fullName}?`}</p>{!selectedUser.isBanned && <textarea value={banReason} onChange={(e) => setBanReason(e.target.value)} placeholder="Reason for banning..." className="w-full px-3 py-2 border rounded-lg mb-4" rows="3" />}<div className="flex gap-3"><button onClick={() => handleBanUser(selectedUser)} disabled={actionLoading} className="flex-1 py-2 bg-orange-500 text-white rounded-lg">{actionLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Confirm"}</button><button onClick={() => { setShowBanConfirm(false); setBanReason(""); }} className="flex-1 py-2 border rounded-lg">Cancel</button></div></div>
        </div>
      )}

      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full"><h3 className="text-xl font-bold mb-4">Delete User</h3><p className="mb-6">Delete {selectedUser.fullName}? This cannot be undone.</p><div className="flex gap-3"><button onClick={handleDeleteUser} disabled={actionLoading} className="flex-1 py-2 bg-red-500 text-white rounded-lg">{actionLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Delete"}</button><button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 border rounded-lg">Cancel</button></div></div>
        </div>
      )}
    </>
  );
}