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
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Bell,
  FileCheck,
  Building2,
  CreditCard,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface License {
  id: string;
  name: string;
  type: 'FSSAI' | 'Hawker Permit' | 'PM SVANidhi' | 'GST' | 'Other';
  status: 'not-started' | 'in-progress' | 'pending' | 'completed';
  expiryDate?: string;
  renewalDate?: string;
  documents: string[];
  steps: string[];
  estimatedTime: string;
  cost: string;
}

const LicensingAssistance = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'licenses' | 'schemes' | 'checklist'>('licenses');
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    licenseType: 'FSSAI',
    businessName: '',
    ownerName: '',
    address: '',
    phone: '',
    email: ''
  });

  const licenses: License[] = [
    {
      id: '1',
      name: 'FSSAI Registration',
      type: 'FSSAI',
      status: 'not-started',
      documents: ['Aadhaar Card', 'PAN Card', 'Address Proof', 'Business Address Proof', 'Photo'],
      steps: [
        'Visit FSSAI website (www.fssai.gov.in)',
        'Click on "Apply for License/Registration"',
        'Fill Form A (Basic Details)',
        'Upload required documents',
        'Pay registration fee (₹100 for turnover < ₹12 lakh)',
        'Submit application',
        'Receive registration certificate via email'
      ],
      estimatedTime: '7-15 days',
      cost: '₹100 - ₹5,000'
    },
    {
      id: '2',
      name: 'Hawker Permit',
      type: 'Hawker Permit',
      status: 'in-progress',
      documents: ['Aadhaar Card', 'Address Proof', 'Photo', 'Vendor Certificate'],
      steps: [
        'Visit local municipal corporation office',
        'Obtain application form',
        'Attach required documents',
        'Pay permit fee (varies by city)',
        'Submit to designated officer',
        'Await approval (usually 15-30 days)',
        'Collect permit from office'
      ],
      estimatedTime: '15-30 days',
      cost: '₹500 - ₹2,000'
    },
    {
      id: '3',
      name: 'PM SVANidhi Loan',
      type: 'PM SVANidhi',
      status: 'pending',
      documents: ['Aadhaar Card', 'Bank Account Details', 'Vendor Certificate', 'Photo'],
      steps: [
        'Visit nearest bank branch or Common Service Centre (CSC)',
        'Fill PM SVANidhi application form',
        'Submit required documents',
        'Bank verification process',
        'Loan approval (up to ₹10,000)',
        'Disbursement to bank account'
      ],
      estimatedTime: '10-20 days',
      cost: 'Free (Government Scheme)'
    },
    {
      id: '4',
      name: 'GST Registration',
      type: 'GST',
      status: 'not-started',
      documents: ['PAN Card', 'Aadhaar Card', 'Bank Account Details', 'Business Address Proof'],
      steps: [
        'Visit GST portal (www.gst.gov.in)',
        'Click "New Registration"',
        'Fill Part A (Basic Details)',
        'Fill Part B (Business Details)',
        'Upload documents',
        'Submit application',
        'Receive GSTIN via email/SMS'
      ],
      estimatedTime: '3-7 days',
      cost: 'Free'
    }
  ];

  const schemes = [
    {
      name: 'PM SVANidhi',
      description: 'Micro-credit scheme for street vendors',
      amount: 'Up to ₹10,000',
      eligibility: 'Street vendors with valid certificate',
      benefits: ['No collateral required', 'Low interest rate', 'Quick disbursement']
    },
    {
      name: 'PMEGP (PM Employment Generation Programme)',
      description: 'Subsidy for setting up new business',
      amount: 'Up to ₹25 lakh',
      eligibility: 'New entrepreneurs, existing businesses',
      benefits: ['35% subsidy', 'Bank loan assistance', 'Training support']
    },
    {
      name: 'MUDRA Loan',
      description: 'Micro finance for small businesses',
      amount: 'Up to ₹10 lakh',
      eligibility: 'Small business owners',
      benefits: ['No collateral', 'Flexible repayment', 'Quick approval']
    }
  ];

  const handleStartApplication = (license: License) => {
    setSelectedLicense(license);
    setIsFormOpen(true);
  };

  const handleSubmitForm = () => {
    if (!formData.businessName || !formData.ownerName || !formData.phone) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Application started!',
      description: `Form auto-filled for ${formData.licenseType}. Follow the steps to complete.`,
    });

    setIsFormOpen(false);
    setFormData({
      licenseType: 'FSSAI',
      businessName: '',
      ownerName: '',
      address: '',
      phone: '',
      email: ''
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-600"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-600 text-gray-400">Not Started</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 to-black border-b border-blue-800 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Shield className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-blue-400">Licensing & Scheme Assistance</h1>
            <p className="text-sm text-blue-200">Get your licenses and access government benefits</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-900/50 to-black border-blue-600 border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-blue-300">Total Licenses</p>
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">{licenses.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-black border-green-600 border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-green-300">Completed</p>
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                {licenses.filter(l => l.status === 'completed').length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/50 to-black border-yellow-600 border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-yellow-300">In Progress</p>
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                {licenses.filter(l => l.status === 'in-progress').length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-black border-purple-600 border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-purple-300">Available Schemes</p>
                <Building2 className="h-6 w-6 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-white">{schemes.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'licenses' | 'schemes' | 'checklist')} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-blue-600 border-2">
            <TabsTrigger value="licenses" className="data-[state=active]:bg-blue-600">📋 Licenses</TabsTrigger>
            <TabsTrigger value="schemes" className="data-[state=active]:bg-blue-600">🏛️ Government Schemes</TabsTrigger>
            <TabsTrigger value="checklist" className="data-[state=active]:bg-blue-600">✅ Document Checklist</TabsTrigger>
          </TabsList>

          {/* Licenses Tab */}
          <TabsContent value="licenses" className="space-y-4">
            {licenses.map((license) => (
              <Card key={license.id} className="bg-gradient-to-br from-gray-900 to-black border-blue-600 border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white text-xl">{license.name}</CardTitle>
                      <CardDescription className="text-blue-300">
                        {license.estimatedTime} • {license.cost}
                      </CardDescription>
                    </div>
                    {getStatusBadge(license.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-blue-300 mb-2">Required Documents:</h4>
                    <div className="flex flex-wrap gap-2">
                      {license.documents.map((doc, index) => (
                        <Badge key={index} variant="outline" className="border-blue-500 text-blue-300 bg-blue-900/20">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-blue-300 mb-2">Step-by-Step Process:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-white">
                      {license.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleStartApplication(license)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <FileCheck className="h-4 w-4 mr-2" />
                      Start Application
                    </Button>
                    <Button variant="outline" className="border-blue-600 text-blue-400">
                      <Download className="h-4 w-4 mr-2" />
                      Download Form
                    </Button>
                    {license.status === 'completed' && license.renewalDate && (
                      <Button variant="outline" className="border-yellow-600 text-yellow-400">
                        <Bell className="h-4 w-4 mr-2" />
                        Renewal: {license.renewalDate}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Schemes Tab */}
          <TabsContent value="schemes" className="space-y-4">
            {schemes.map((scheme, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-900 to-black border-blue-600 border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-xl">{scheme.name}</CardTitle>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                  <CardDescription className="text-blue-300">{scheme.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-blue-300">Loan Amount</p>
                      <p className="text-2xl font-bold text-green-400">{scheme.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-300">Eligibility</p>
                      <p className="text-white text-base">{scheme.eligibility}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-300 mb-2">Benefits</p>
                      <ul className="space-y-2">
                        {scheme.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-white">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Checklist Tab */}
          <TabsContent value="checklist" className="space-y-4">
            <Card className="bg-gradient-to-br from-gray-900 to-black border-blue-600 border-2">
              <CardHeader>
                <CardTitle className="text-white text-xl">Essential Documents Checklist</CardTitle>
                <CardDescription className="text-blue-300">Keep these documents ready for all applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Aadhaar Card', required: true, description: 'Identity proof', icon: '🆔' },
                    { name: 'PAN Card', required: true, description: 'Tax identification', icon: '📄' },
                    { name: 'Address Proof', required: true, description: 'Utility bill, rent agreement', icon: '📍' },
                    { name: 'Bank Account Details', required: true, description: 'Cancelled cheque or bank statement', icon: '🏦' },
                    { name: 'Business Address Proof', required: false, description: 'If different from residential', icon: '🏢' },
                    { name: 'Vendor Certificate', required: false, description: 'From local authority', icon: '📜' },
                    { name: 'Photo (Passport Size)', required: true, description: 'Recent photograph', icon: '📷' }
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-600 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{doc.icon}</div>
                        <FileCheck className={`h-5 w-5 ${doc.required ? 'text-blue-400' : 'text-gray-500'}`} />
                        <div>
                          <p className="font-bold text-white text-base">
                            {doc.name}
                            {doc.required && <Badge className="ml-2 bg-red-600 text-xs">Required</Badge>}
                          </p>
                          <p className="text-sm text-blue-300">{doc.description}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-blue-600 text-blue-400 hover:bg-blue-900/30">
                        Upload
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-gray-900 text-white border-blue-600 border-2 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Start Application: {selectedLicense?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-blue-200">Business Name *</label>
              <Input
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="Enter your business name"
                className="bg-gray-800 border-blue-700 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-blue-200">Owner Name *</label>
              <Input
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="Enter owner name"
                className="bg-gray-800 border-blue-700 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-blue-200">Address *</label>
              <Textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter business address"
                className="bg-gray-800 border-blue-700 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-blue-200">Phone Number *</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="bg-gray-800 border-blue-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-blue-200">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="bg-gray-800 border-blue-700 text-white"
                />
              </div>
            </div>
            <div className="bg-blue-900/30 p-4 rounded-lg">
              <p className="text-sm text-blue-200 mb-2">📋 Next Steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
                {selectedLicense?.steps.slice(0, 3).map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmitForm} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Auto-Fill & Continue
              </Button>
              <Button variant="outline" onClick={() => setIsFormOpen(false)} className="border-blue-600 text-blue-400">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LicensingAssistance;

