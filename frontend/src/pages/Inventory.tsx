import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Package, AlertTriangle, Plus, Edit, Trash2, TrendingUp } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// Inventory Item type
interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  status: 'good' | 'low' | 'critical';
  expiryDays: number;
  recommendation?: string;
}

// Backend response type
interface InventoryItemResponse {
  _id: string;
  name: string;
  quantity: number;
  unit: string;
  status: 'good' | 'low' | 'critical';
  expiryDays: number;
  recommendation?: string;
}

const Inventory = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '', expiryDays: '' });

  // Fetch inventory from backend
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/inventory`);
        const data: InventoryItemResponse[] = await res.json();
        const formatted: InventoryItem[] = data.map((item) => ({
          id: item._id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          status: item.status,
          expiryDays: item.expiryDays,
          recommendation: item.recommendation,
        }));
        setItems(formatted);
      } catch (err) {
        console.error('Error fetching inventory:', err);
      }
    };
    fetchInventory();
  }, []);

  // Add new item to backend
  const handleAddItem = async () => {
    try {
      const payload = {
        name: newItem.name,
        quantity: parseFloat(newItem.quantity),
        unit: newItem.unit,
        expiryDays: parseInt(newItem.expiryDays),
      };
      const res = await fetch(`${API_BASE_URL}/api/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const createdItem: InventoryItemResponse = await res.json();
      setItems([
        ...items,
        {
          id: createdItem._id,
          name: createdItem.name,
          quantity: createdItem.quantity,
          unit: createdItem.unit,
          status: createdItem.status,
          expiryDays: createdItem.expiryDays,
          recommendation: createdItem.recommendation,
        },
      ]);
      setNewItem({ name: '', quantity: '', unit: '', expiryDays: '' });
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error adding inventory item:', err);
    }
  };

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'good':
        return 'bg-green-600';
      case 'low':
        return 'bg-yellow-600';
      case 'critical':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 to-black border-b border-blue-800 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-white">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-blue-400">📦 Inventory Management</h1>
                <p className="text-sm text-blue-200">Track stock levels & reduce waste</p>
              </div>
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 text-white border-blue-700">
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Item Name</Label>
                    <Input
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="bg-gray-800 border-gray-700"
                      placeholder="e.g., Paneer"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                        className="bg-gray-800 border-gray-700"
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <Input
                        value={newItem.unit}
                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                        className="bg-gray-800 border-gray-700"
                        placeholder="kg"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Expiry (days)</Label>
                    <Input
                      type="number"
                      value={newItem.expiryDays}
                      onChange={(e) => setNewItem({ ...newItem, expiryDays: e.target.value })}
                      className="bg-gray-800 border-gray-700"
                      placeholder="7"
                    />
                  </div>
                  <Button onClick={handleAddItem} className="w-full bg-blue-600 hover:bg-blue-700">
                    Add Item
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-gray-900 to-black border-blue-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Items</p>
                <p className="text-3xl font-bold text-white">{items.length}</p>
              </div>
              <Package className="h-10 w-10 text-blue-400" />
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-gray-900 to-black border-blue-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Low Stock</p>
                <p className="text-3xl font-bold text-yellow-400">{items.filter((i) => i.status === 'low').length}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-yellow-400" />
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-gray-900 to-black border-blue-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Critical</p>
                <p className="text-3xl font-bold text-red-400">{items.filter((i) => i.status === 'critical').length}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-400" />
            </div>
          </Card>
        </div>

        {/* Smart Recommendations */}
        <Card className="bg-gradient-to-br from-purple-900/30 to-black border-purple-700 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            <h3 className="text-xl font-bold">Smart Recommendations</h3>
          </div>
          <ul className="space-y-2 text-gray-300">
            {items.filter((i) => i.recommendation).map((item) => (
              <li key={item.id}>💡 {item.name}: {item.recommendation}</li>
            ))}
          </ul>
        </Card>

        {/* Inventory List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="bg-gradient-to-br from-gray-900 to-black border-blue-700 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{item.name}</h3>
                  <p className="text-2xl font-bold text-blue-400 mt-1">{item.quantity} {item.unit}</p>
                </div>
                <Badge className={`${getStatusColor(item.status)} text-white`}>{item.status.toUpperCase()}</Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-400 mb-4">
                <p>⏰ Expires in {item.expiryDays} days</p>
                {item.recommendation && <p className="text-purple-400">💡 {item.recommendation}</p>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 border-blue-600 text-blue-400">
                  <Edit className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
