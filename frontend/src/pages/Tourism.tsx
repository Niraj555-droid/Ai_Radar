import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MapPin } from 'lucide-react';

interface TouristSpot {
  "Name Place": string;
  Rating: number | string;
  Rank_in_City: number | string;
}

interface TourismData {
  City: string;
  State: string;
  Date: string;
  Festival_Day: boolean;
  Nearby_Festival_Day: boolean;
  Season: string;
  Holiday: boolean;
  "Temp(°C)": number | string;
  Conditions: string;
  Top_Tourist_Spots: TouristSpot[];
  AI_Insights: string;
}

const Tourism = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [tourismData, setTourismData] = useState<TourismData | null>(null);
  const [error, setError] = useState<string | null>(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  const fetchTourismData = async () => {
    if (!city || !state || !date) {
      setError('Please enter all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formattedDate = new Date(date).toISOString().split('T')[0];

      const response = await fetch(`${API_BASE_URL}/api/tourism`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, state, date: formattedDate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error occurred');
      }

      const data: TourismData = await response.json();
      setTourismData(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <header className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-5 w-5 text-blue-400" />
        </Button>
        <h1 className="text-3xl font-bold text-blue-300">🗺️ Tourism Insights</h1>
      </header>

      <Card className="p-6 mb-6 bg-gray-900 border border-blue-700 shadow-lg rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-gray-300">City</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" />
          </div>
          <div>
            <Label className="text-gray-300">State</Label>
            <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="Maharashtra" />
          </div>
          <div>
            <Label className="text-gray-300">Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <Button
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          onClick={fetchTourismData}
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'Get Insights'}
        </Button>
        {error && <p className="mt-3 text-red-400 font-medium">{error}</p>}
      </Card>

      {tourismData && (
        <div className="space-y-6">
          {/* General Info */}
          <Card className="p-6 bg-gray-900 border border-blue-700 shadow-lg rounded-2xl">
            <h2 className="text-xl font-semibold text-blue-300 mb-2">
              {tourismData.City}, {tourismData.State} – {tourismData.Date}
            </h2>
            <p className="text-gray-200 mb-1">
              🌟 <strong>Festival Day:</strong> {tourismData.Festival_Day ? 'Yes' : 'No'} | 
              <strong> Nearby Festival:</strong> {tourismData.Nearby_Festival_Day ? 'Yes' : 'No'} | 
              <strong> Season:</strong> {tourismData.Season} | 
              <strong> Holiday:</strong> {tourismData.Holiday ? 'Yes' : 'No'}
            </p>
            <p className="text-gray-200">
              🌤 <strong>Weather:</strong> {tourismData["Temp(°C)"]}°C, {tourismData.Conditions}
            </p>
          </Card>

          {/* Top Tourist Spots */}
          <Card className="p-6 bg-gray-900 border border-blue-700 shadow-lg rounded-2xl">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">🏛 Top Tourist Spots</h3>
            <div className="space-y-2">
              {tourismData.Top_Tourist_Spots.map((spot, idx) => (
                <div
                  key={idx}
                  className="flex justify-between bg-gray-800/70 rounded-xl px-3 py-2 hover:bg-gray-700/80 transition"
                >
                  <span className="text-gray-100">
                    {spot["Name Place"]} — <span className="text-yellow-400">⭐ {spot.Rating}</span> (Rank {spot.Rank_in_City})
                  </span>
                  <MapPin className="h-4 w-4 text-blue-400" />
                </div>
              ))}
            </div>
          </Card>

          {/* AI Insights */}
          <Card className="p-6 bg-gray-900 border border-blue-700 shadow-lg rounded-2xl">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">📊Insights</h3>
            <div className="bg-gray-800/80 rounded-xl p-4 text-gray-100 leading-relaxed whitespace-pre-wrap">
              {tourismData.AI_Insights}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Tourism;
