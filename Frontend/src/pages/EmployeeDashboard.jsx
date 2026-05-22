import { useState, useEffect } from "react";
import api from "../lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function EmployeeDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form visibility and modes
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leave");
      setLeaves(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeaves();
  }, []);

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setDate("");
    setReason("");
    setDetails("");
    setError(null);
  };

  const handleNewRequestClick = () => {
    if (showForm && !editingId) {
      resetForm();
    } else {
      resetForm();
      setShowForm(true);
    }
  };

  const handleEditClick = (leave) => {
    setEditingId(leave.id);
    // Format date string to YYYY-MM-DD for the input
    const formattedDate = new Date(leave.date).toISOString().split('T')[0];
    setDate(formattedDate);
    setReason(leave.reason);
    setDetails(leave.details || "");
    setShowForm(true);
    // scroll to top where form is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pending request?")) return;
    
    try {
      await api.delete(`/leave/${id}`);
      fetchLeaves();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete request");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        // Update existing leave
        await api.put(`/leave/${editingId}`, { date, reason, details });
      } else {
        // Create new leave
        await api.post("/leave", { date, reason, details });
      }
      resetForm();
      fetchLeaves(); // Refresh list after successful creation/update
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editingId ? 'update' : 'submit'} request`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">My Leave Requests</h1>
        <Button onClick={handleNewRequestClick}>
          {showForm && !editingId ? "Cancel" : "New Request"}
        </Button>
      </div>

      {showForm && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{editingId ? "Edit Leave Request" : "Submit a Leave Request"}</CardTitle>
            {editingId && (
              <Button variant="ghost" size="sm" onClick={resetForm}>Cancel Edit</Button>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              {error && <div className="text-destructive text-sm font-medium">{error}</div>}
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Date</label>
                <Input type="date" required value={date} onChange={e => setDate(e.target.value)} disabled={submitting} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Reason (Short)</label>
                <Input type="text" required placeholder="E.g., Sick Leave" value={reason} onChange={e => setReason(e.target.value)} disabled={submitting} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Details (Optional)</label>
                <Input type="text" placeholder="Additional details..." value={details} onChange={e => setDetails(e.target.value)} disabled={submitting} />
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (editingId ? "Updating..." : "Submitting...") : (editingId ? "Update Request" : "Submit Request")}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Admin Remark</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading requests...</td></tr>
              ) : leaves.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No leave requests found. Enjoy your work!</td></tr>
              ) : (
                leaves.map(leave => (
                  <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {new Date(leave.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900">{leave.reason}</div>
                      {leave.details && <div className="text-slate-500 text-xs mt-1">{leave.details}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                        ${leave.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          leave.status === 'canceled' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 italic max-w-[200px] truncate" title={leave.remark}>
                      {leave.remark ? `"${leave.remark}"` : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {leave.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => handleEditClick(leave)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDeleteClick(leave.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
