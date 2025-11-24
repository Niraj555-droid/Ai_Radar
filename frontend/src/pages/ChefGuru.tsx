import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Send, Mic, TrendingUp, Calendar, Package, BarChart3, ChefHat, Eye, Heart, MessageSquare } from 'lucide-react';
import aiAssistantImage from '@/assets/ai-assistant.jpg';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  buttons?: Array<{ label: string; value: string; icon?: string }>;
}

interface ChatFlowData {
  dishName?: string;
  date?: string;
  optionType?: 'topping' | 'addon' | 'both';
  language?: 'english' | 'marathi';
  step: number;
}

interface PopularityData {
  dish_name: string;
  views: number;
  likes: number;
  comments_count: number;
  popularity_score: number;
}

const ChefGuru = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '👋 Hello! I can help you find the best toppings or add-ons for your dish 🍛',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'trends'>('chat');
  const [chatFlowData, setChatFlowData] = useState<ChatFlowData>({ step: 1 });

  const [popularityData, setPopularityData] = useState<PopularityData[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [trendsError, setTrendsError] = useState<string | null>(null);


  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
  // Fetch trend data when Trends tab is active
  useEffect(() => {
    if (activeTab === 'trends') {
      setIsLoadingTrends(true);
      setTrendsError(null);

      fetch(`${API_BASE_URL}/api/food-trends`)
        .then(async (res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then((json) => {
          if (json.status === 'success') {
            setPopularityData(json.data);
          } else {
            setTrendsError('Failed to load trends data');
          }
        })
        .catch((error) => {
          console.error('Trends fetch error:', error);
          setTrendsError('Error fetching trends data');
        })
        .finally(() => {
          setIsLoadingTrends(false);
        });
    }
  }, [activeTab]);

  // 🎙 Voice input simulation
  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputValue('Margherita Pizza');
      }, 2000);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const userText = inputValue;
    setInputValue('');

    setTimeout(async () => {
      const response = await handleChatFlow(userText);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        buttons: response.buttons,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const handleButtonClick = async (value: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: value,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(async () => {
      const response = await handleChatFlow('', value);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        buttons: response.buttons,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const handleChatFlow = async (userInput: string, buttonValue?: string) => {
    const input = buttonValue || userInput;
    const step = chatFlowData.step;

    switch (step) {
      case 1:
        setChatFlowData((prev) => ({ ...prev, dishName: input, step: 2 }));
        return { content: '📅 Please enter the date (YYYY-MM-DD).', buttons: undefined };
      case 2:
        setChatFlowData((prev) => ({ ...prev, date: input, step: 3 }));
        return {
          content: '🔍 Choose what you want suggestions for:',
          buttons: [
            { label: 'Toppings', value: 'topping', icon: '👨‍🍳' },
            { label: 'Add-ons', value: 'addon', icon: '📦' },
            { label: 'Both', value: 'both', icon: '🧩' },
          ],
        };
      case 3:
        setChatFlowData((prev) => ({ ...prev, optionType: input as 'topping' | 'addon' | 'both', step: 4 }));
        return {
          content: '🌐 Choose language:',
          buttons: [
            { label: 'GB English', value: 'english' },
            { label: 'IN Marathi', value: 'marathi' },
          ],
        };
      case 4:
        setChatFlowData((prev) => ({ ...prev, language: input as 'english' | 'marathi', step: 5 }));
        return {
          content: '✅ Ready to predict! Click below:',
          buttons: [{ label: 'Predict', value: 'predict', icon: '🌐' }],
        };
      case 5:
        if (input === 'predict') return { content: await fetchPrediction(), buttons: undefined };
        break;
      default:
        return { content: 'Please start by entering the dish name 🍽️', buttons: undefined };
    }
  };

  const fetchPrediction = async () => {
    try {
      const { dishName, date, optionType, language } = chatFlowData;
      const response = await fetch('http://127.0.0.1:5000/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dish_name: dishName,
          order_date: date,
          language: language === 'marathi' ? 'Marathi' : 'English',
          option: optionType || 'both',
        }),
      });
      const data = await response.json();
      if (data.error) return `⚠️ Error: ${data.error}`;

      const toppings = Array.isArray(data.toppings) ? data.toppings : [];
      const addons = Array.isArray(data.addons) ? data.addons : [];

      let result = `🍽️ Prediction Results for ${data.dish_name}\n\n📅 Date: ${data.date}\n🌤 Season: ${data.season}\n🎉 Festival: ${data.festival}\n\n`;

      if (optionType === 'topping' || optionType === 'both') result += `👨‍🍳 Toppings:\n${toppings.length ? toppings.map((t) => `• ${t}`).join('\n') : 'No suggestions'}\n\n`;
      if (optionType === 'addon' || optionType === 'both') result += `📦 Add-ons:\n${addons.length ? addons.map((a) => `• ${a}`).join('\n') : 'No suggestions'}`;

      return result;
    } catch {
      return '⚠️ Error fetching prediction.';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-900 to-black border-b border-purple-800 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <ChefHat className="h-8 w-8 text-purple-400" />
          <h1 className="text-2xl font-bold text-purple-400">ChefGuru</h1>
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <img src={aiAssistantImage} alt="ChefGuru Assistant" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black flex items-center justify-center">
          <div className="text-center text-gray-300">💡 Smart Kitchen Intelligence</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 pb-6 flex-1">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'chat' | 'trends')} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-purple-700">
            <TabsTrigger value="chat" className="data-[state=active]:bg-purple-600">💬 Chat Assistant</TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-purple-600">📊 Trend Analysis</TabsTrigger>
          </TabsList>

          {/* Chat */}
          <TabsContent value="chat" className="space-y-6">
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <Card className={`max-w-[80%] p-4 ${msg.type === 'user' ? 'bg-gradient-to-r from-purple-600 to-purple-800 border-purple-700' : 'bg-gradient-to-br from-gray-900 to-black border-purple-700'}`}>
                      <p className="text-white whitespace-pre-line">{msg.content}</p>
                      {msg.buttons && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {msg.buttons.map((b, i) => (
                            <Button key={i} size="sm" variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-800" onClick={() => handleButtonClick(b.value)}>
                              {b.icon && <span className="mr-1">{b.icon}</span>}{b.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="flex gap-3 mt-4">
              <Button size="icon" variant="outline" className={`border-purple-600 ${isRecording ? 'bg-red-600' : 'text-purple-400'}`} onClick={handleVoiceInput}>
                <Mic className="h-5 w-5" />
              </Button>
              <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask ChefGuru anything..." className="flex-1 bg-gray-900 border-purple-700 text-white" />
              <Button size="icon" className="bg-purple-600 hover:bg-purple-700" onClick={handleSendMessage}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </TabsContent>

          {/* Trends */}
          <TabsContent value="trends" className="space-y-4">
            {isLoadingTrends ? (
              <div className="text-center text-gray-400 py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 animate-pulse text-purple-400" />
                <p>Loading trends data...</p>
              </div>
            ) : trendsError ? (
              <Card className="bg-gradient-to-br from-red-900/20 to-black border-red-700 p-6">
                <p className="text-red-400 text-center">⚠️ {trendsError}</p>
              </Card>
            ) : popularityData.length === 0 ? (
              <Card className="bg-gradient-to-br from-gray-900 to-black border-purple-700 p-6">
                <p className="text-gray-400 text-center">📊 No trends data available</p>
              </Card>
            ) : (
              <>
                <Card className="bg-gradient-to-br from-purple-900/30 to-black border-purple-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-400">
                      <TrendingUp className="h-6 w-6" />
                      Top Trending Dishes
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Based on views, likes, and engagement
                    </CardDescription>
                  </CardHeader>
                </Card>

                <ScrollArea className="h-[500px]">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {popularityData.map((dish, index) => (
                      <Card key={index} className="bg-gradient-to-br from-gray-900 to-black border-purple-700 hover:border-purple-500 transition-all">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg text-purple-300">
                              #{index + 1} {dish.dish_name}
                            </CardTitle>
                            <div className="text-2xl font-bold text-purple-400">
                              {dish.popularity_score.toFixed(1)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2 text-gray-400">
                                <Eye className="h-4 w-4" />
                                Views
                              </span>
                              <span className="text-white font-semibold">{dish.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2 text-gray-400">
                                <Heart className="h-4 w-4" />
                                Likes
                              </span>
                              <span className="text-white font-semibold">{dish.likes.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2 text-gray-400">
                                <MessageSquare className="h-4 w-4" />
                                Comments
                              </span>
                              <span className="text-white font-semibold">{dish.comments_count.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Popularity bar */}
                          <div className="mt-4">
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all"
                                style={{ width: `${Math.min((dish.popularity_score / Math.max(...popularityData.map(d => d.popularity_score))) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChefGuru;
