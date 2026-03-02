import { useState } from 'react';
import { X } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'outlook'>('pdf');
  const [startDate, setStartDate] = useState('2023-11-15');
  const [endDate, setEndDate] = useState('2023-12-15');

  const handleExport = () => {
    console.log('Exporting:', { format: exportFormat, startDate, endDate });
    onClose();
  };

  if (!isOpen) return null;

  const formatOptions = [
    { value: 'pdf' as const,     label: 'Export as PDF' },
    { value: 'excel' as const,   label: 'Export as Excel' },
    { value: 'outlook' as const, label: 'Export to Outlook' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content w-full max-w-md mx-4 animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Export Calendar</h2>
            <p className="text-sm text-gray-500 mt-0.5">Select options and date range for your export.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <label className="input-label mb-2">Export as:</label>
            <div className="space-y-2">
              {formatOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="exportFormat"
                    value={option.value}
                    checked={exportFormat === option.value}
                    onChange={() => setExportFormat(option.value)}
                    className="w-4 h-4 text-primary focus:ring-primary accent-primary"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="input-label mb-2">Date Range:</label>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field flex-1"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field flex-1"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleExport} className="btn-primary">Export</button>
        </div>
      </div>
    </div>
  );
}
