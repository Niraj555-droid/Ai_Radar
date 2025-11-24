import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Star, TrendingUp, TrendingDown, MessageSquare, ThumbsUp, ThumbsDown, Filter, Download, QrCode, Smartphone } from 'lucide-react';

const Reviews = () => {
  const navigate = useNavigate();

  const [showQRCode, setShowQRCode] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showMobileLink, setShowMobileLink] = useState(false);
  const [sentimentData, setSentimentData] = useState<{
    overall: {
      positive: number,
      neutral: number,
      negative: number,
      total: number,
      averageRating: number | null,
    },
    trends: {
      positive: number,
      neutral: number,
      negative: number,
    },
    categories: Array<{
      name: string,
      positive: number,
      neutral: number,
      negative: number,
      trend: number,
    }>,
    citywideData: Array<{
      city?: string,
      positive: number,
      neutral: number,
      negative: number,
      total: number,
    }>,
  } | null>(null);

  // Mock recent reviews kept unchanged
  const recentReviews = [
    {
      id: 1,
      customer: 'Rajesh Kumar',
      rating: 5,
      date: '2 hours ago',
      comment: 'Amazing food! The paneer tikka was perfectly cooked and the service was super fast. Will definitely come back!',
      sentiment: 'positive',
      category: 'Food Quality'
    },
    {
      id: 2,
      customer: 'Priya Sharma',
      rating: 4,
      date: '5 hours ago',
      comment: 'Good food but a bit expensive. The taste was great but portion size could be better.',
      sentiment: 'neutral',
      category: 'Value for Money'
    },
    {
      id: 3,
      customer: 'Amit Singh',
      rating: 2,
      date: '1 day ago',
      comment: 'Very slow service today. Had to wait 45 minutes for my order. Food was cold when it arrived.',
      sentiment: 'negative',
      category: 'Service Speed'
    },
    {
      id: 4,
      customer: 'Sneha Patel',
      rating: 5,
      date: '1 day ago',
      comment: 'Excellent hygiene and cleanliness. The staff was very polite and helpful. Food was delicious!',
      sentiment: 'positive',
      category: 'Staff Behavior'
    },
    {
      id: 5,
      customer: 'Vikram Joshi',
      rating: 3,
      date: '2 days ago',
      comment: 'Average experience. Nothing special but nothing bad either. Decent food for the price.',
      sentiment: 'neutral',
      category: 'Food Quality'
    }
  ];

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

useEffect(() => {
  const fetchSentimentData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/gap_analysis`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();

      if (json.status !== 'success') {
        throw new Error('API returned an error status');
      }

      const data = json.data ?? {};

      // Normalize backend data and provide fallbacks
      setSentimentData({
        overall: {
          positive: data.overall?.positive ?? 0,
          neutral: data.overall?.neutral ?? 0,
          negative: data.overall?.negative ?? 0,
          total: data.overall?.total ?? 0,
          averageRating: data.overall?.averageRating ?? null,
        },
        trends: {
          positive: data.trends?.positive ?? 0,
          neutral: data.trends?.neutral ?? 0,
          negative: data.trends?.negative ?? 0,
        },
        categories: Array.isArray(data.categories) ? data.categories : [],
        citywideData: Array.isArray(data.citywideData) ? data.citywideData : [],
      });
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
      setSentimentData(null);
    }
  };

  fetchSentimentData();
}, []);




  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-600';
      case 'negative': return 'bg-red-600';
      default: return 'bg-yellow-600';
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <div className="h-4 w-4" />;
  };

  const handleFilter = () => setShowFilter(!showFilter);

  const handleExport = () => {
    if (!sentimentData) return;

    const csvData = [
      ['Category', 'Positive %', 'Neutral %', 'Negative %', 'Trend'],
      ...sentimentData.categories.map(cat => [
        cat.name,
        cat.positive,
        cat.neutral,
        cat.negative,
        cat.trend
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentiment-analysis-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleMobileLink = () => setShowMobileLink(!showMobileLink);

  if (sentimentData === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading sentiment data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 to-black border-b border-blue-800 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-blue-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-bold">Customer Reviews & Feedback</h1>
              <p className="text-xs text-blue-200">Sentiment Analysis Dashboard</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-blue-700 text-white hover:bg-blue-800"
                onClick={handleFilter}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-blue-700 text-white hover:bg-blue-800"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-900/20 to-black border-emerald-700">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Positive Reviews</p>
                <p className="text-2xl font-bold text-emerald-400">{sentimentData.overall.positive}%</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(sentimentData.trends.positive)}
                  <span className="text-xs text-emerald-400 ml-1">+{sentimentData.trends.positive}%</span>
                </div>
              </div>
              <ThumbsUp className="h-8 w-8 text-emerald-400" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-900/20 to-black border-amber-700">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Neutral Reviews</p>
                <p className="text-2xl font-bold text-amber-400">{sentimentData.overall.neutral}%</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(sentimentData.trends.neutral)}
                  <span className="text-xs text-amber-400 ml-1">{sentimentData.trends.neutral}%</span>
                </div>
              </div>
              <MessageSquare className="h-8 w-8 text-amber-400" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-900/20 to-black border-rose-700">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Negative Reviews</p>
                <p className="text-2xl font-bold text-rose-400">{sentimentData.overall.negative}%</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(sentimentData.trends.negative)}
                  <span className="text-xs text-rose-400 ml-1">{sentimentData.trends.negative}%</span>
                </div>
              </div>
              <ThumbsDown className="h-8 w-8 text-rose-400" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-900/20 to-black border-indigo-700">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold text-indigo-400">
                  {sentimentData.overall.averageRating !== null ? sentimentData.overall.averageRating : '-'} / 5
                </p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-400 ml-1">{sentimentData.overall.total} reviews</span>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
            </CardContent>
          </Card>
        </div>

        {/* QR Code Feedback Collection Section */}
        <Card className="bg-gradient-to-br from-purple-900/15 to-black border-purple-700 mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <QrCode className="h-8 w-8 text-purple-400 mr-3" />
                  <h3 className="text-2xl font-bold text-white">Quick Feedback Collection</h3>
                </div>
                <p className="text-gray-300 mb-6">
                  Generate QR codes for easy customer feedback collection. Customers can scan and leave reviews instantly!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400">QR Codes Generated</div>
                    <div className="text-lg font-bold text-purple-400">24</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Scans This Week</div>
                    <div className="text-lg font-bold text-green-400">156</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Response Rate</div>
                    <div className="text-lg font-bold text-blue-400">68%</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => setShowQRCode(!showQRCode)}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    {showQRCode ? 'Hide QR Code' : 'Generate QR Code'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-purple-600 text-purple-400 hover:bg-purple-900"
                    onClick={handleMobileLink}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    View Mobile Link
                  </Button>
                </div>
              </div>
              <div className="ml-8 hidden lg:block">
                {showQRCode ? (
                  <div 
                    className="w-48 h-48 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      navigator.clipboard.writeText('https://rasoimitra.com/feedback');
                      // Optional toast notification here
                    }}
                  >
                    <div className="w-40 h-40 bg-gray-900 rounded-lg flex items-center justify-center">
                      <div className="text-white text-xs text-center">
                        <div className="mb-2">QR CODE</div>
                        <div className="text-xs">Scan to leave feedback</div>
                        <div className="text-xs mt-1">rasoimitra.com/feedback</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-6xl text-gray-600">📱</div>
                  </div>
                )}
                <p className="text-center text-sm text-gray-400 mt-2">
                  {showQRCode ? 'Click QR Code to Copy Link' : 'Generate QR Code to Display'}
                </p>
                {showMobileLink && (
                  <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                    <div className="text-xs text-gray-400 mb-2">Mobile Feedback Link:</div>
                    <div className="text-sm text-blue-400 break-all">https://rasoimitra.com/feedback/mobile</div>
                    <Button 
                      size="sm" 
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText('https://rasoimitra.com/feedback/mobile');
                        // Optional toast notification
                      }}
                    >
                      Copy Link
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Panel */}
        {showFilter && (
          <Card className="bg-gradient-to-br from-gray-900/80 to-black border-blue-700 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Filter Options</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-white"
                  onClick={() => setShowFilter(false)}
                >
                  ✕
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Time Period</label>
                  <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white">
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Sentiment</label>
                  <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white">
                    <option value="all">All Sentiments</option>
                    <option value="positive">Positive Only</option>
                    <option value="neutral">Neutral Only</option>
                    <option value="negative">Negative Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Category</label>
                  <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white">
                    <option value="all">All Categories</option>
                    <option value="food">Food Quality</option>
                    <option value="service">Service Speed</option>
                    <option value="cleanliness">Cleanliness</option>
                    <option value="value">Value for Money</option>
                    <option value="staff">Staff Behavior</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Apply Filters
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300">
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="sentiment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-blue-700">
            <TabsTrigger value="sentiment" className="data-[state=active]:bg-blue-600">Sentiment Analysis</TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-blue-600">City wide Category Breakdown</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-blue-600">Recent Reviews</TabsTrigger>
          </TabsList>

          {/* Sentiment Analysis Tab */}
          <TabsContent value="sentiment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart - Sentiment Distribution */}
              <Card className="bg-gradient-to-br from-gray-900/80 to-black border-blue-700">
                <CardHeader>
                  <CardTitle className="text-white">Sentiment Distribution</CardTitle>
                  <CardDescription className="text-gray-400">Overall customer sentiment breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-48 h-48">
                      {/* Pie Chart SVG */}
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Positive slice */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="8"
                          strokeDasharray={`${sentimentData.overall.positive * 2.51} 251`}
                          className="drop-shadow-lg"
                        />
                        {/* Neutral slice */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="8"
                          strokeDasharray={`${sentimentData.overall.neutral * 2.51} 251`}
                          strokeDashoffset={`-${sentimentData.overall.positive * 2.51}`}
                          className="drop-shadow-lg"
                        />
                        {/* Negative slice */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="8"
                          strokeDasharray={`${sentimentData.overall.negative * 2.51} 251`}
                          strokeDashoffset={`-${(sentimentData.overall.positive + sentimentData.overall.neutral) * 2.51}`}
                          className="drop-shadow-lg"
                        />
                      </svg>
                      {/* Center text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{sentimentData.overall.total}</div>
                          <div className="text-xs text-gray-400">Total Reviews</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-300">Positive</span>
                      </div>
                      <span className="text-sm font-semibold text-green-400">{sentimentData.overall.positive}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-300">Neutral</span>
                      </div>
                      <span className="text-sm font-semibold text-yellow-400">{sentimentData.overall.neutral}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-300">Negative</span>
                      </div>
                      <span className="text-sm font-semibold text-red-400">{sentimentData.overall.negative}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bar Chart - Citywise Sentiment */}
              <Card className="bg-gradient-to-br from-gray-900/80 to-black border-blue-700">
                <CardHeader>
                  <CardTitle className="text-white">Citywise Sentiment Breakdown</CardTitle>
                  <CardDescription className="text-gray-400">Sentiment distribution across cities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sentimentData.categories.slice(0, 6).map((city, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-white">{city.name || "Unknown"}</span>
                          <span className="text-xs text-gray-400">{city.positive + city.negative} reviews</span>
                        </div>
                        <div className="flex h-6 bg-gray-800 rounded-lg overflow-hidden">
                          <div 
                            className="bg-green-500 flex items-center justify-center"
                            style={{ width: `${city.positive}%` }}
                          >
                            <span className="text-xs font-bold text-white">{city.positive}%</span>
                          </div>
                          <div 
                            className="bg-yellow-500 flex items-center justify-center"
                            style={{ width: `${city.neutral}%` }}
                          >
                            <span className="text-xs font-bold text-white">{city.neutral}%</span>
                          </div>
                          <div 
                            className="bg-red-500 flex items-center justify-center"
                            style={{ width: `${city.negative}%` }}
                          >
                            <span className="text-xs font-bold text-white">{city.negative}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Citywide Category Breakdown Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Horizontal Bar Chart for Categories */}
              <Card className="bg-gradient-to-br from-gray-900/80 to-black border-blue-700">
                <CardHeader>
                  <CardTitle className="text-white">City wide Category Performance</CardTitle>
                  <CardDescription className="text-gray-400">Sentiment breakdown by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {sentimentData.categories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-white">{category.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Trend:</span>
                            {category.trend > 0 ? (
                              <span className="text-xs text-green-400">+{category.trend}% ↗️</span>
                            ) : (
                              <span className="text-xs text-red-400">{category.trend}% ↘️</span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          {/* Positive bar */}
                          <div className="flex items-center">
                            <div className="w-16 text-xs text-gray-400">Positive</div>
                            <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
                              <div 
                                className="bg-green-500 h-full flex items-center justify-end pr-2"
                                style={{ width: `${category.positive}%` }}
                              >
                                <span className="text-xs font-bold text-white">{category.positive}%</span>
                              </div>
                            </div>
                          </div>
                          {/* Neutral bar */}
                          <div className="flex items-center">
                            <div className="w-16 text-xs text-gray-400">Neutral</div>
                            <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
                              <div 
                                className="bg-yellow-500 h-full flex items-center justify-end pr-2"
                                style={{ width: `${category.neutral}%` }}
                              >
                                <span className="text-xs font-bold text-white">{category.neutral}%</span>
                              </div>
                            </div>
                          </div>
                          {/* Negative bar */}
                          <div className="flex items-center">
                            <div className="w-16 text-xs text-gray-400">Negative</div>
                            <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
                              <div 
                                className="bg-red-500 h-full flex items-center justify-end pr-2"
                                style={{ width: `${category.negative}%` }}
                              >
                                <span className="text-xs font-bold text-white">{category.negative}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Radar Chart for Category Comparison (simplified to bar here) */}
              <Card className="bg-gradient-to-br from-gray-900/80 to-black border-blue-700">
                <CardHeader>
                  <CardTitle className="text-white">Category Comparison</CardTitle>
                  <CardDescription className="text-gray-400">Positive sentiment across all categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sentimentData.categories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-white">{category.name}</span>
                          <span className="text-sm font-bold text-green-400">{category.positive}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-full flex items-center justify-end pr-3 transition-all duration-1000 ease-out"
                            style={{ width: `${category.positive}%` }}
                          >
                            <span className="text-xs font-bold text-white">{category.positive}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-sm text-gray-300 mb-2">Top Performing Categories:</div>
                    <div className="space-y-1">
                      {sentimentData.categories
                        .sort((a, b) => b.positive - a.positive)
                        .slice(0, 3)
                        .map((category, index) => (
                          <div key={index} className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">{index + 1}. {category.name}</span>
                            <span className="text-green-400 font-semibold">{category.positive}%</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recent Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <Card key={review.id} className="bg-gradient-to-br from-gray-900/80 to-black border-blue-700">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-semibold">
                            {review.customer.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{review.customer}</h4>
                          <p className="text-sm text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge className={`${getSentimentBg(review.sentiment)} text-white`}>
                          {review.sentiment}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center mr-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-400">({review.rating}/5)</span>
                      </div>
                      <Badge variant="outline" className="border-blue-600 text-blue-400">
                        {review.category}
                      </Badge>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reviews;
