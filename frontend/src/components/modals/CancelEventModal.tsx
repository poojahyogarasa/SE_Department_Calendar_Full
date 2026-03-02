import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface CancelEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  eventTitle: string;
  eventDateTime: string;
}

export default function CancelEventModal({
  isOpen,
  onClose,
  onConfirm,
  eventTitle,
  eventDateTime
}: CancelEventModalProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content w-full max-w-md mx-4 animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Warning Icon — standalone, no circle */}
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-12 h-12 text-red-500" strokeWidth={1.5} />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Are you sure you want to cancel this event?
          </h2>

          <p className="text-gray-600 mb-1">{eventTitle}</p>
          <p className="text-sm text-gray-500">{eventDateTime}</p>
        </div>

        {/* Reason Input */}
        <div className="px-6 pb-4">
          <label className="input-label">Reason for cancellation (Optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please tell us why you are cancelling this event..."
            rows={3}
            className="input-field resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-2">
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
          >
            Yes, Cancel Event
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white text-gray-700 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            No, Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
