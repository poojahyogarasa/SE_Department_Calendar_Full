import { useState, useMemo } from 'react';
import {
  Mail,
  Calendar,
  CheckCircle,
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  Shield,
  ChevronDown,
  Bell,
  X,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { useEventStore } from '../../stores/useEventStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { canApproveEvents } from '../../utils/permissions';
import type { Event } from '../../types';

export default function ApprovalsPage() {
  const { events, updateEvent } = useEventStore();
  const { user } = useAuthStore();

  // Rejection reason dialog state
  const [rejectTarget, setRejectTarget] = useState<Event | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const canApprove = canApproveEvents(user);

  // Derive pending events from the real event store
  const pendingEvents = useMemo(
    () => events.filter(e => e.status === 'PENDING'),
    [events]
  );

  const approvedEvents = useMemo(
    () => events.filter(e => e.status === 'APPROVED'),
    [events]
  );

  const rejectedEvents = useMemo(
    () => events.filter(e => e.status === 'REJECTED'),
    [events]
  );

  const [activeView, setActiveView] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const handleApprove = (event: Event) => {
    updateEvent(event.id, { status: 'APPROVED', rejectionReason: undefined });
  };

  const openRejectDialog = (event: Event) => {
    setRejectTarget(event);
    setRejectionReason('');
    setReasonError('');
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      setReasonError('Please provide a reason for rejection.');
      return;
    }
    if (rejectTarget) {
      updateEvent(rejectTarget.id, { status: 'REJECTED', rejectionReason: rejectionReason.trim() });
    }
    setRejectTarget(null);
    setRejectionReason('');
    setReasonError('');
  };

  const cancelReject = () => {
    setRejectTarget(null);
    setRejectionReason('');
    setReasonError('');
  };

  const sidebarLinks = [
    { id: 'pending', icon: Mail, label: 'Pending', count: pendingEvents.length },
    { id: 'approved', icon: CheckCircle, label: 'Approved', count: approvedEvents.length },
    { id: 'rejected', icon: FileText, label: 'Rejected', count: rejectedEvents.length },
    { id: 'reports', icon: BarChart3, label: 'Reports', count: 0 },
    { id: 'settings', icon: Settings, label: 'Settings', count: 0 },
  ];

  const displayedEvents =
    activeView === 'pending' ? pendingEvents :
    activeView === 'approved' ? approvedEvents :
    rejectedEvents;

  const totalEvents = events.length;
  const approvalRate = totalEvents > 0
    ? Math.round((approvedEvents.length / totalEvents) * 100)
    : 0;

  const getCategoryLabel = (cat: string) =>
    cat.charAt(0) + cat.slice(1).toLowerCase();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Rejection Reason Dialog */}
      {rejectTarget && (
        <div className="modal-overlay" onClick={cancelReject}>
          <div
            className="modal-content w-full max-w-md mx-4 animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-gray-900">Reject Event</h2>
              <button onClick={cancelReject} className="ml-auto p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-1">
                Rejecting: <span className="font-semibold">{rejectTarget.title}</span>
              </p>
              <p className="text-sm text-gray-500 mb-4">
                The requester will be notified with the reason below.
              </p>
              <label className="input-label">Reason for Rejection *</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  if (e.target.value.trim()) setReasonError('');
                }}
                placeholder="Explain why this event is being rejected..."
                rows={4}
                className={`input-field resize-none ${reasonError ? 'border-red-500' : ''}`}
              />
              {reasonError && <p className="input-error mt-1">{reasonError}</p>}
            </div>
            <div className="flex gap-3 p-4 border-t border-gray-200 justify-end">
              <button onClick={cancelReject} className="btn-secondary">Cancel</button>
              <button onClick={confirmReject} className="btn-danger">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex-shrink-0">
        {/* User Info */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {user?.name?.charAt(0) ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{user?.name ?? 'Unknown'}</p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role?.replace('_', ' ').toLowerCase() ?? ''}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  if (['pending', 'approved', 'rejected'].includes(link.id)) {
                    setActiveView(link.id as 'pending' | 'approved' | 'rejected');
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium flex-1">{link.label}</span>
                {link.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {link.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Links */}
        <div className="absolute bottom-4 left-4 space-y-3">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
            <HelpCircle className="w-4 h-4" />
            Help & Support
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
            <Shield className="w-4 h-4" />
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Approval Dashboard</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white rounded-lg border border-gray-200">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-white rounded-lg border border-gray-200">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {user?.name?.charAt(0) ?? '?'}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-gray-500">Total Pending Approvals</p>
            <p className="text-4xl font-bold text-gray-900 my-1">{pendingEvents.length}</p>
            <p className="text-sm text-gray-400">Events awaiting your decision</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-sm text-gray-500">Events Today</p>
            <p className="text-4xl font-bold text-gray-900 my-1">
              {events.filter(e => {
                const d = new Date(e.start);
                const t = new Date();
                return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
              }).length}
            </p>
            <p className="text-sm text-gray-400">Scheduled for today</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500">Approval Rate (Monthly)</p>
            <p className="text-4xl font-bold text-gray-900 my-1">{approvalRate}%</p>
            <p className="text-sm text-gray-400">Compared to last month</p>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 capitalize">
              {activeView} Event Requests
            </h2>
            <span className="text-sm text-gray-500">{displayedEvents.length} items</span>
          </div>

          {displayedEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No {activeView} events</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Event Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Requested By</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  {activeView === 'rejected' && (
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rejection Reason</th>
                  )}
                  {canApprove && activeView === 'pending' && (
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {displayedEvents.map((event) => (
                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <span className="font-medium text-gray-900">{event.title}</span>
                      {event.courseCode && (
                        <span className="ml-2 text-xs text-gray-400">{event.courseCode}</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {format(new Date(event.start), 'yyyy-MM-dd hh:mm aa')}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {event.createdBy || '—'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {getCategoryLabel(event.category)}
                    </td>
                    <td className="px-4 py-4">
                      {event.status === 'PENDING' && (
                        <span className="status-pending">Pending</span>
                      )}
                      {event.status === 'APPROVED' && (
                        <span className="status-scheduled">Approved</span>
                      )}
                      {event.status === 'REJECTED' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Rejected</span>
                      )}
                    </td>
                    {activeView === 'rejected' && (
                      <td className="px-4 py-4 text-sm text-red-600 max-w-xs">
                        {event.rejectionReason || '—'}
                      </td>
                    )}
                    {canApprove && activeView === 'pending' && (
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(event)}
                            className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectDialog(event)}
                            className="px-3 py-1.5 bg-white text-red-600 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-50"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Department Calendar Management System. All rights reserved.
        </div>
      </div>
    </div>
  );
}
