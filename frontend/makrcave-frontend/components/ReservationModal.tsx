import { useState } from 'react';
import { X, Calendar, Clock, User, Save } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  type: string;
  hourlyRate?: number;
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment | null;
}

export default function ReservationModal({ isOpen, onClose, equipment }: ReservationModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');

  if (!isOpen || !equipment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating reservation:', {
      equipmentId: equipment.id,
      date: selectedDate,
      startTime,
      endTime,
      purpose
    });
    // Here you would call the reservation creation API
    onClose();
  };

  const calculateDuration = () => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2024-01-01T${startTime}`);
    const end = new Date(`2024-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
  };

  const duration = calculateDuration();
  const estimatedCost = duration * (equipment.hourlyRate || 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card p-6 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Reserve Equipment</h3>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <h4 className="font-medium">{equipment.name}</h4>
          <p className="text-sm text-muted-foreground capitalize">{equipment.type.replace('_', ' ')}</p>
          {equipment.hourlyRate && (
            <p className="text-xs text-muted-foreground">${equipment.hourlyRate}/hour</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date *</label>
            <input
              type="date"
              required
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Time *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Time *</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Purpose/Project Name *</label>
            <input
              type="text"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
              placeholder="e.g., Prototype housing, Custom bracket"
            />
          </div>

          {duration > 0 && equipment.hourlyRate && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Duration:</span>
                <span>{duration.toFixed(1)} hours</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Estimated Cost:</span>
                <span>${estimatedCost.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 makrcave-btn-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              Reserve
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
