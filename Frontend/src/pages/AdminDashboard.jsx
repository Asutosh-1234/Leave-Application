import { useState, useEffect } from "react";
import api from "../lib/axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering
  const [filterStatus, setFilterStatus] = useState("all");

  // Action State
  const [updatingId, setUpdatingId] = useState(null);
  const [remarks, setRemarks] = useState({});

  // Modal State
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leave/admin/all");
      setLeaves(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleRemarkChange = (id, value) => {
    setRemarks(prev => ({ ...prev, [id]: value }));
  };

  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.put(`/leave/admin/${id}`, { status, remark: remarks[id] });
      setRemarks(prev => {
        const newRemarks = { ...prev };
        delete newRemarks[id];
        return newRemarks;
      });
      // if updating from modal, we should also close it or refresh it. Let's just close it.
      setSelectedLeave(null);
      fetchLeaves();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewDetails = async (id) => {
    setLoadingDetails(true);
    // Even though we have the object in the list, we fetch the fresh single application details as requested
    try {
      const res = await api.get(`/leave/admin/${id}`);
      setSelectedLeave(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredLeaves = leaves.filter(l => filterStatus === "all" || l.status === filterStatus);

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">All Leave Requests</h1>
        
        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Filter by Status:</label>
          <select 
            className="h-9 px-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading requests...</td></tr>
              ) : filteredLeaves.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No leave requests found for this filter.</td></tr>
              ) : (
                filteredLeaves.map(leave => (
                  <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{leave.user?.name}</div>
                      <div className="text-slate-500 text-xs">{leave.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {new Date(leave.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-medium text-slate-900 truncate">{leave.reason}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                        ${leave.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          leave.status === 'canceled' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleViewDetails(leave.id)}
                          disabled={loadingDetails}
                        >
                          View Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Details Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Leave Application Details</h2>
                  <p className="text-sm text-slate-500 mt-1">Application ID: <span className="font-mono text-xs">{selectedLeave.id}</span></p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                  ${selectedLeave.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    selectedLeave.status === 'canceled' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'}`}>
                  {selectedLeave.status}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase">Employee Name</label>
                    <div className="font-medium text-slate-900 mt-1">{selectedLeave.user?.name}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase">Employee Email</label>
                    <div className="font-medium text-slate-900 mt-1">{selectedLeave.user?.email}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase">Leave Date</label>
                    <div className="font-medium text-slate-900 mt-1">
                      {new Date(selectedLeave.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase">Applied On</label>
                    <div className="font-medium text-slate-900 mt-1">
                      {new Date(selectedLeave.createdAt || selectedLeave.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Reason</label>
                  <div className="text-slate-900 font-medium bg-white border border-slate-200 p-3 rounded-md">
                    {selectedLeave.reason}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Additional Details</label>
                  <div className="text-slate-700 bg-white border border-slate-200 p-3 rounded-md min-h-[60px] whitespace-pre-wrap">
                    {selectedLeave.details || <span className="italic text-slate-400">No additional details provided.</span>}
                  </div>
                </div>
              </div>

              {selectedLeave.status === 'pending' ? (
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Admin Action</label>
                  <Input 
                    placeholder="Provide an optional remark before approving or denying..." 
                    className="w-full mb-3"
                    value={remarks[selectedLeave.id] || ""}
                    onChange={(e) => handleRemarkChange(selectedLeave.id, e.target.value)}
                  />
                  <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setSelectedLeave(null)} disabled={updatingId === selectedLeave.id}>
                      Close
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      disabled={updatingId === selectedLeave.id}
                      onClick={() => handleUpdateStatus(selectedLeave.id, 'canceled')}
                    >
                      Deny Request
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={updatingId === selectedLeave.id}
                      onClick={() => handleUpdateStatus(selectedLeave.id, 'approved')}
                    >
                      Approve Request
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-medium text-slate-700">Processed</span>
                      {selectedLeave.remark && <span className="text-slate-500 ml-2 italic">Remark: "{selectedLeave.remark}"</span>}
                    </div>
                    <Button variant="ghost" onClick={() => setSelectedLeave(null)}>Close</Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
