import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { useMakerspace } from '../contexts/MakerspaceContext';

export default function Reservations() {
  const { reservations } = useMakerspace();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Calendar className="w-8 h-8" />
          Equipment Reservations
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage equipment bookings
        </p>
      </div>

      <div className="space-y-4">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="makrcave-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-makrx-blue/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-makrx-blue" />
                </div>
                <div>
                  <h3 className="font-semibold">{reservation.equipmentName}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {reservation.userName}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(reservation.startTime).toLocaleString()} - 
                  {new Date(reservation.endTime).toLocaleTimeString()}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    reservation.status === 'approved' ? 'bg-green-100 text-green-800' :
                    reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {reservation.status}
                  </span>
                  {reservation.status === 'pending' && (
                    <div className="flex gap-1">
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {reservation.purpose && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Purpose:</strong> {reservation.purpose}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
