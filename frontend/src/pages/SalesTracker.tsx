import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart,
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar,
  BarChart3,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SalesEntry {
  id: string;
  date: string;
  cashSales: number;
  onlineSales: number;
  totalSales: number;
  expenses: number;
  profit: number;
  peakHours: string[];
}

interface ExpenseEntry {
  id: string;
  date: string;
  category: string;
  item: string;
  amount: number;
  description: string;
}

const SalesTracker = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'today' | 'history' | 'insights'>('today');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddSalesOpen, setIsAddSalesOpen] = useState(false);
  
  const [salesData, setSalesData] = useState<SalesEntry[]>([
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      cashSales: 8500,
      onlineSales: 3200,
      totalSales: 11700,
      expenses: 4500,
      profit: 7200,
      peakHours: ['12:00-14:00', '19:00-21:00']
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      cashSales: 9200,
      onlineSales: 2800,
      totalSales: 12000,
      expenses: 4800,
      profit: 7200,
      peakHours: ['12:00-14:00', '19:00-21:00']
    }
  ]);

  const [expenses, setExpenses] = useState<ExpenseEntry[]>([
    { id: '1', date: new Date().toISOString().split('T')[0], category: 'Ingredients', item: 'Paneer', amount: 1200, description: '20 kg fresh paneer' },
    { id: '2', date: new Date().toISOString().split('T')[0], category: 'Ingredients', item: 'Vegetables', amount: 800, description: 'Mixed vegetables' },
    { id: '3', date: new Date().toISOString().split('T')[0], category: 'Other', item: 'Gas Cylinder', amount: 950, description: 'LPG refill' },
    { id: '4', date: new Date().toISOString().split('T')[0], category: 'Ingredients', item: 'Spices', amount: 550, description: 'Various spices' },
  ]);

  const [formData, setFormData] = useState({
    cashSales: '',
    onlineSales: '',
    expenseCategory: 'Ingredients',
    expenseItem: '',
    expenseAmount: '',
    expenseDescription: ''
  });

  const todaySales = salesData.find(s => s.date === new Date().toISOString().split('T')[0]);
  const todayExpenses = expenses.filter(e => e.date === new Date().toISOString().split('T')[0]);
  const totalTodayExpenses = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const insights = {
    avgDailySales: salesData.reduce((sum, s) => sum + s.totalSales, 0) / salesData.length,
    avgDailyProfit: salesData.reduce((sum, s) => sum + s.profit, 0) / salesData.length,
    risingCosts: expenses.filter(e => e.category === 'Ingredients').length > 0,
    peakHours: ['12:00-14:00', '19:00-21:00']
  };

  const handleAddSales = () => {
    const cash = parseFloat(formData.cashSales) || 0;
    const online = parseFloat(formData.onlineSales) || 0;
    const total = cash + online;
    const expenses = totalTodayExpenses;
    const profit = total - expenses;

    const newEntry: SalesEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      cashSales: cash,
      onlineSales: online,
      totalSales: total,
      expenses: expenses,
      profit: profit,
      peakHours: insights.peakHours
    };

    setSalesData([newEntry, ...salesData]);
    setIsAddSalesOpen(false);
    setFormData({ ...formData, cashSales: '', onlineSales: '' });
    
    toast({
      title: 'Sales recorded!',
      description: `Total sales: ₹${total.toLocaleString()}`,
    });
  };

  const handleAddExpense = () => {
    if (!formData.expenseItem || !formData.expenseAmount) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const newExpense: ExpenseEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      category: formData.expenseCategory,
      item: formData.expenseItem,
      amount: parseFloat(formData.expenseAmount),
      description: formData.expenseDescription
    };

    setExpenses([newExpense, ...expenses]);
    setIsAddExpenseOpen(false);
    setFormData({ ...formData, expenseItem: '', expenseAmount: '', expenseDescription: '' });
    
    toast({
      title: 'Expense recorded!',
      description: `₹${newExpense.amount} added for ${newExpense.item}`,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-green-900 to-black border-b border-green-800 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <DollarSign className="h-8 w-8 text-green-400" />
          <div>
            <h1 className="text-2xl font-bold text-green-400">Daily Sales & Expense Tracker</h1>
            <p className="text-sm text-green-200">Track your daily finances effortlessly</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Today's Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-green-900/50 to-black border-green-600 border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-green-300">Total Sales</p>
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                ₹{todaySales ? todaySales.totalSales.toLocaleString() : '0'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-black border-blue-600 border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-blue-300">Expenses</p>
                <ShoppingCart className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                ₹{totalTodayExpenses.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-black border-purple-600 border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-purple-300">Profit</p>
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                ₹{todaySales ? (todaySales.totalSales - totalTodayExpenses).toLocaleString() : '0'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/50 to-black border-orange-600 border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-orange-300">Peak Hours</p>
                <Clock className="h-6 w-6 text-orange-400" />
              </div>
              <p className="text-lg font-bold text-white">
                {insights.peakHours[0]}
              </p>
              <p className="text-sm text-orange-200">{insights.peakHours[1]}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'today' | 'history' | 'insights')} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-green-700">
            <TabsTrigger value="today" className="data-[state=active]:bg-green-600">📊 Today</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-green-600">📅 History</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-green-600">💡 Insights</TabsTrigger>
          </TabsList>

          {/* Today Tab */}
          <TabsContent value="today" className="space-y-4">
            {/* Quick Expense Buttons */}
            <Card className="bg-gradient-to-br from-gray-900 to-black border-green-600 border-2">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Add Expense</CardTitle>
                <CardDescription className="text-green-300">Tap to add common expenses quickly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    { name: 'Paneer', amount: 1200, category: 'Ingredients', icon: '🧀' },
                    { name: 'Vegetables', amount: 800, category: 'Ingredients', icon: '🥬' },
                    { name: 'Gas Cylinder', amount: 950, category: 'Other', icon: '🔥' },
                    { name: 'Spices', amount: 550, category: 'Ingredients', icon: '🌶️' },
                  ].map((quickExpense, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 border-green-600 hover:bg-green-900/30"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          expenseItem: quickExpense.name,
                          expenseAmount: quickExpense.amount.toString(),
                          expenseCategory: quickExpense.category,
                          expenseDescription: `Quick add: ${quickExpense.name}`
                        });
                        setIsAddExpenseOpen(true);
                      }}
                    >
                      <span className="text-2xl">{quickExpense.icon}</span>
                      <span className="text-xs font-semibold text-white">{quickExpense.name}</span>
                      <span className="text-xs text-green-400">₹{quickExpense.amount}</span>
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Dialog open={isAddSalesOpen} onOpenChange={setIsAddSalesOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700 flex-1 text-lg py-6">
                        <DollarSign className="h-5 w-5 mr-2" />
                        Add Sales
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 text-white border-green-600 border-2">
                      <DialogHeader>
                        <DialogTitle className="text-xl text-green-400">Record Today's Sales</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold text-green-300 mb-2 block">Cash Sales (₹)</label>
                          <Input
                            type="number"
                            value={formData.cashSales}
                            onChange={(e) => setFormData({ ...formData, cashSales: e.target.value })}
                            placeholder="Enter cash amount"
                            className="bg-gray-800 border-green-600 text-white text-lg py-3"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-green-300 mb-2 block">Online Sales (₹)</label>
                          <Input
                            type="number"
                            value={formData.onlineSales}
                            onChange={(e) => setFormData({ ...formData, onlineSales: e.target.value })}
                            placeholder="Enter online amount"
                            className="bg-gray-800 border-green-600 text-white text-lg py-3"
                          />
                        </div>
                        <Button onClick={handleAddSales} className="w-full bg-green-600 hover:bg-green-700 text-lg py-3">
                          ✓ Record Sales
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-green-600 text-green-400 hover:bg-green-900/30 flex-1 text-lg py-6">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add Expense
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 text-white border-green-600 border-2">
                      <DialogHeader>
                        <DialogTitle className="text-xl text-green-400">Record Expense</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold text-green-300 mb-2 block">Category</label>
                          <select
                            value={formData.expenseCategory}
                            onChange={(e) => setFormData({ ...formData, expenseCategory: e.target.value })}
                            className="w-full bg-gray-800 border border-green-600 text-white rounded-md px-3 py-3 text-lg"
                          >
                            <option value="Ingredients">🧀 Ingredients</option>
                            <option value="Equipment">🔧 Equipment</option>
                            <option value="Rent">🏠 Rent</option>
                            <option value="Other">📦 Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-green-300 mb-2 block">Item Name *</label>
                          <Input
                            value={formData.expenseItem}
                            onChange={(e) => setFormData({ ...formData, expenseItem: e.target.value })}
                            placeholder="e.g., Paneer, Gas, Vegetables"
                            className="bg-gray-800 border-green-600 text-white text-lg py-3"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-green-300 mb-2 block">Amount (₹) *</label>
                          <Input
                            type="number"
                            value={formData.expenseAmount}
                            onChange={(e) => setFormData({ ...formData, expenseAmount: e.target.value })}
                            placeholder="Enter amount"
                            className="bg-gray-800 border-green-600 text-white text-lg py-3"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-green-300 mb-2 block">Description (Optional)</label>
                          <Input
                            value={formData.expenseDescription}
                            onChange={(e) => setFormData({ ...formData, expenseDescription: e.target.value })}
                            placeholder="Additional details..."
                            className="bg-gray-800 border-green-600 text-white text-lg py-3"
                          />
                        </div>
                        <Button onClick={handleAddExpense} className="w-full bg-green-600 hover:bg-green-700 text-lg py-3">
                          ✓ Record Expense
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Today's Expenses */}
            <Card className="bg-gradient-to-br from-gray-900 to-black border-green-600 border-2">
              <CardHeader>
                <CardTitle className="text-white text-xl">Today's Expenses</CardTitle>
                <CardDescription className="text-green-300">Track your daily spending</CardDescription>
              </CardHeader>
              <CardContent>
                {todayExpenses.length > 0 ? (
                  <div className="space-y-3">
                    {todayExpenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-green-600 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center text-xl">
                            {expense.category === 'Ingredients' ? '🧀' : expense.category === 'Equipment' ? '🔧' : expense.category === 'Rent' ? '🏠' : '📦'}
                          </div>
                          <div>
                            <p className="font-bold text-white text-lg">{expense.item}</p>
                            <p className="text-sm text-green-300">{expense.category} • {expense.description}</p>
                          </div>
                        </div>
                        <p className="text-xl font-bold text-red-400">₹{expense.amount.toLocaleString()}</p>
                      </div>
                    ))}
                    <div className="mt-4 p-4 bg-green-900/20 rounded-lg border border-green-600">
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold text-green-300">Total Expenses Today:</p>
                        <p className="text-2xl font-bold text-white">₹{totalTodayExpenses.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-lg mb-2">No expenses recorded today</p>
                    <p className="text-green-300 text-sm">Click "Add Expense" to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card className="bg-gradient-to-br from-gray-900 to-black border-green-600 border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-xl">Sales History</CardTitle>
                    <CardDescription className="text-green-300">View past sales and expenses</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="border-green-600 text-green-400 hover:bg-green-900/30">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {salesData.map((sale) => (
                    <Card key={sale.id} className="bg-gray-800/50 border-green-600 border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-bold text-white text-lg">{new Date(sale.date).toLocaleDateString()}</p>
                            <p className="text-sm text-green-300">Peak: {sale.peakHours.join(', ')}</p>
                          </div>
                          <Badge className="bg-green-600 text-white text-sm px-3 py-1">₹{sale.profit.toLocaleString()} profit</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-green-300 font-semibold">Cash</p>
                            <p className="text-white font-bold text-lg">₹{sale.cashSales.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-green-300 font-semibold">Online</p>
                            <p className="text-white font-bold text-lg">₹{sale.onlineSales.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-green-300 font-semibold">Total</p>
                            <p className="text-green-400 font-bold text-lg">₹{sale.totalSales.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-blue-900/50 to-black border-blue-600 border-2">
                <CardHeader>
                  <CardTitle className="text-blue-300 flex items-center gap-2 text-lg">
                    <BarChart3 className="h-6 w-6" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-blue-300">Average Daily Sales</p>
                    <p className="text-3xl font-bold text-white">₹{insights.avgDailySales.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-300">Average Daily Profit</p>
                    <p className="text-3xl font-bold text-green-400">₹{insights.avgDailyProfit.toFixed(0)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-900/50 to-black border-orange-600 border-2">
                <CardHeader>
                  <CardTitle className="text-orange-300 flex items-center gap-2 text-lg">
                    <AlertCircle className="h-6 w-6" />
                    Cost Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {insights.risingCosts ? (
                    <div className="space-y-3">
                      <p className="text-base font-semibold text-orange-200">⚠️ Ingredient costs are rising</p>
                      <p className="text-sm text-orange-300">Consider bulk purchasing or finding alternative suppliers</p>
                    </div>
                  ) : (
                    <p className="text-sm text-green-300">✓ No cost alerts at this time</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/50 to-black border-purple-600 border-2 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-purple-300 flex items-center gap-2 text-lg">
                    <Clock className="h-6 w-6" />
                    Peak Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-3">
                    {insights.peakHours.map((hour, index) => (
                      <Badge key={index} className="bg-purple-600 text-white px-6 py-2 text-base">
                        {hour}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-purple-200">
                    💡 Focus on marketing and staffing during these peak hours for maximum revenue
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SalesTracker;

