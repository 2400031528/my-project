import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import {
  LogIn,
  UserPlus,
  Shield,
  Heart,
  UserCheck,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Building,
  LogOut,
  Plus,
  Package,
  Calendar,
  Search,
  CheckCircle,
  TrendingUp,
  Users
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type UserRole = 'admin' | 'donor' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  organization?: string;
  password?: string;
  adminSecurityPassword?: string;
}

export interface Donation {
  id: string;
  donorName: string;
  donorPhone: string;
  donorAddress: string;
  location: string;
  description: string;
  foodType: string;
  quantity: string;
  expiryDate: string;
  status: 'available' | 'claimed' | 'expired';
  createdAt: string;
  claimedBy?: {
    name: string;
    phone: string;
  };
}

// ============================================================================
// AUTH PAGE COMPONENT
// ============================================================================

interface AuthPageProps {
  onLogin: (user: AuthUser) => void;
}

function AuthPage({ onLogin }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [loginStep, setLoginStep] = useState(1);
  const [registerStep, setRegisterStep] = useState(1);

  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('registeredUsers');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    adminSecurityPassword: '',
  });

  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
    organization: '',
    adminSecurityPassword: '',
    confirmAdminSecurityPassword: '',
  });

  const mockUsers: AuthUser[] = [
    {
      id: '1',
      email: 'admin@foodwaste.com',
      name: 'System Administrator',
      role: 'admin',
      organization: 'Food Waste Management Inc.',
      password: 'password',
      adminSecurityPassword: 'admin123'
    },
    {
      id: '2',
      email: 'donor@example.com',
      name: 'John Donor',
      role: 'donor',
      phone: '+1234567890',
      address: '123 Donor Street, City',
      password: 'password'
    },
    {
      id: '3',
      email: 'user@example.com',
      name: 'Jane User',
      role: 'user',
      phone: '+1987654321',
      address: '456 User Avenue, City',
      password: 'password'
    }
  ];

  const allUsers = [...mockUsers, ...registeredUsers];

  const handleLoginStep1 = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginForm.email || !loginForm.password) {
      toast.error('Please fill in all fields', { duration: 3000 });
      return;
    }

    const user = allUsers.find(u => u.email === loginForm.email);

    if (user && user.password && loginForm.password === user.password) {
      setLoginStep(2);
    } else if (user && user.password && loginForm.password !== user.password) {
      toast.error('Password is wrong please enter correctly', { duration: 3000 });
    } else {
      toast.error('Email not found. Please check your email or register', { duration: 3000 });
    }
  };

  const handleLoginStep2 = (role: UserRole) => {
    if (role === 'admin') {
      setSelectedRole(role);
      setLoginStep(3);
    } else {
      const user = allUsers.find(u => u.email === loginForm.email && u.role === role);

      if (user) {
        toast.success('Login successful', { duration: 3000 });
        onLogin(user);
      } else {
        toast.error(`No ${role} account found with this email. Please try a different role or register.`, { duration: 3000 });
      }
    }
  };

  const handleAdminSecurityLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginForm.adminSecurityPassword) {
      toast.error('Please enter the admin security password', { duration: 3000 });
      return;
    }

    const user = allUsers.find(u => u.email === loginForm.email && u.role === 'admin');

    if (!user || !user.adminSecurityPassword || loginForm.adminSecurityPassword !== user.adminSecurityPassword) {
      toast.error('Admin security password is wrong please enter correctly', { duration: 3000 });
      return;
    }

    if (user) {
      toast.success('Login successful', { duration: 3000 });
      onLogin(user);
    } else {
      toast.error('No admin account found with this email.', { duration: 3000 });
    }
  };

  const handleRegisterStep1 = (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerForm.email || !registerForm.password || !registerForm.confirmPassword || !registerForm.name) {
      toast.error('Please fill in all required fields', { duration: 3000 });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Passwords do not match', { duration: 3000 });
      return;
    }

    if (registerForm.password.length < 6) {
      toast.error('Password must be at least 6 characters', { duration: 3000 });
      return;
    }

    if (allUsers.find(u => u.email === registerForm.email)) {
      toast.error('Email already exists', { duration: 3000 });
      return;
    }

    setRegisterStep(2);
  };

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'user') {
      completeRegistration(role);
    } else {
      setRegisterStep(3);
    }
  };

  const handleRegisterStep3 = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRole === 'donor' && !registerForm.phone) {
      toast.error('Phone number is required for food donors', { duration: 3000 });
      return;
    }

    if (selectedRole === 'admin') {
      if (!registerForm.organization) {
        toast.error('Organization is required for admin accounts', { duration: 3000 });
        return;
      }
      if (!registerForm.adminSecurityPassword) {
        toast.error('Admin security password is required', { duration: 3000 });
        return;
      }
      if (registerForm.adminSecurityPassword !== registerForm.confirmAdminSecurityPassword) {
        toast.error('Admin security passwords do not match', { duration: 3000 });
        return;
      }
      if (registerForm.adminSecurityPassword.length < 6) {
        toast.error('Admin security password must be at least 6 characters', { duration: 3000 });
        return;
      }
    }

    completeRegistration(selectedRole);
  };

  const completeRegistration = (role: UserRole) => {
    const newUser: AuthUser = {
      id: Date.now().toString(),
      email: registerForm.email,
      name: registerForm.name,
      role: role,
      phone: registerForm.phone || undefined,
      address: registerForm.address || undefined,
      organization: registerForm.organization || undefined,
      password: registerForm.password,
      adminSecurityPassword: role === 'admin' ? registerForm.adminSecurityPassword : undefined,
    };

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);

    if (typeof window !== 'undefined') {
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    }

    toast.success(`Registration successful! Welcome, ${newUser.name}!`, { duration: 3000 });
    onLogin(newUser);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'donor':
        return <Heart className="w-4 h-4" />;
      case 'user':
        return <UserCheck className="w-4 h-4" />;
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Manage the entire food waste system, monitor donations, and oversee operations';
      case 'donor':
        return 'Donate surplus food to help reduce waste and feed those in need';
      case 'user':
        return 'Find and claim available food donations in your area';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Food Waste Management
          </h1>
          <p className="text-gray-600">
            Join our mission to reduce food waste and help communities
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={(value) => {
              setActiveTab(value);
              setLoginStep(1);
              setRegisterStep(1);
              setSelectedRole('user');
              setLoginForm({ email: '', password: '', adminSecurityPassword: '' });
              setRegisterForm({
                email: '',
                password: '',
                confirmPassword: '',
                name: '',
                phone: '',
                address: '',
                organization: '',
                adminSecurityPassword: '',
                confirmAdminSecurityPassword: '',
              });
            }}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Register
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="p-6 space-y-4">
                {loginStep === 1 ? (
                  <>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
                      <p className="text-gray-600 text-center text-sm">
                        Enter your credentials to continue
                      </p>
                    </div>

                    <form onSubmit={handleLoginStep1} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="loginEmail">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="loginEmail"
                            type="email"
                            placeholder="Enter your email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="loginPassword">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="loginPassword"
                            type="password"
                            placeholder="Enter your password"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                        Continue
                      </Button>
                    </form>

                    <div className="bg-gray-50 p-3 rounded-md text-xs">
                      <p className="font-semibold mb-1">Demo Credentials:</p>
                      <p>Email: admin@foodwaste.com / password (Admin + Security: admin123)</p>
                      <p>Email: donor@example.com / password (Donor)</p>
                      <p>Email: user@example.com / password (User)</p>
                    </div>
                  </>
                ) : loginStep === 2 ? (
                  <>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-center">Select Your Role</h2>
                      <p className="text-gray-600 text-center text-sm">
                        Choose how you want to access the system
                      </p>
                    </div>

                    <div className="space-y-3">
                      {(['admin', 'donor', 'user'] as UserRole[]).map((role) => (
                        <button
                          key={role}
                          type="button"
                          className="w-full p-4 border-2 rounded-lg cursor-pointer transition-all border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-left"
                          onClick={() => handleLoginStep2(role)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5">
                              {getRoleIcon(role)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium capitalize">{role}</h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {getRoleDescription(role)}
                              </p>
                              {role === 'admin' && (
                                <Badge variant="secondary" className="mt-2 text-xs">
                                  Requires Security Password
                                </Badge>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLoginStep(1)}
                      className="w-full"
                    >
                      Back to Credentials
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-center">Admin Security</h2>
                      <p className="text-gray-600 text-center text-sm">
                        Enter your admin security password
                      </p>
                    </div>

                    <div className="bg-red-50 p-3 rounded-md text-sm">
                      <div className="flex items-center space-x-2 text-red-800">
                        <Shield className="w-4 h-4" />
                        <span className="font-medium">Additional Security Required</span>
                      </div>
                      <p className="text-red-700 mt-1">
                        Admin accounts require an additional security password for enhanced protection.
                      </p>
                    </div>

                    <form onSubmit={handleAdminSecurityLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="adminSecurityPassword">Admin Security Password</Label>
                        <div className="relative">
                          <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="adminSecurityPassword"
                            type="password"
                            placeholder="Enter admin security password"
                            value={loginForm.adminSecurityPassword}
                            onChange={(e) => setLoginForm(prev => ({ ...prev, adminSecurityPassword: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                        <Shield className="w-4 h-4 mr-2" />
                        Access Admin Panel
                      </Button>
                    </form>

                    <div className="bg-gray-50 p-3 rounded-md text-xs">
                      <p className="font-semibold mb-1">Demo Admin Security Password:</p>
                      <p>admin123</p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLoginStep(2)}
                      className="w-full"
                    >
                      Back to Role Selection
                    </Button>
                  </>
                )}
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="p-6 space-y-4">
                {registerStep === 1 ? (
                  <>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-center">Create Account</h2>
                      <p className="text-gray-600 text-center text-sm">
                        Enter your basic information to get started
                      </p>
                    </div>

                    <form onSubmit={handleRegisterStep1} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="registerName">Full Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="registerName"
                            placeholder="Enter your full name"
                            value={registerForm.name}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="registerEmail">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="registerEmail"
                            type="email"
                            placeholder="Enter your email"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="registerPassword">Password *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="registerPassword"
                            type="password"
                            placeholder="Create a password (min. 6 characters)"
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={registerForm.confirmPassword}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                        Continue
                      </Button>
                    </form>
                  </>
                ) : registerStep === 2 ? (
                  <>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-center">Choose Your Role</h2>
                      <p className="text-gray-600 text-center text-sm">
                        Select how you plan to use the platform
                      </p>
                    </div>

                    <div className="space-y-3">
                      {(['user', 'donor', 'admin'] as UserRole[]).map((role) => (
                        <button
                          key={role}
                          type="button"
                          className="w-full p-4 border-2 rounded-lg cursor-pointer transition-all border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-left"
                          onClick={() => handleRoleSelection(role)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5">
                              {getRoleIcon(role)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium capitalize">{role}</h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {getRoleDescription(role)}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setRegisterStep(1)}
                      className="w-full"
                    >
                      Back to Basic Info
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-center">Additional Information</h2>
                      <p className="text-gray-600 text-center text-sm">
                        Provide additional details for your {selectedRole} account
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md text-sm">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(selectedRole)}
                        <span className="font-medium capitalize">{selectedRole} Account</span>
                      </div>
                    </div>

                    <form onSubmit={handleRegisterStep3} className="space-y-4">
                      {(selectedRole === 'donor' || selectedRole === 'user') && (
                        <div className="space-y-2">
                          <Label htmlFor="registerPhone">
                            Phone Number {selectedRole === 'donor' ? '*' : ''}
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="registerPhone"
                              type="tel"
                              placeholder="+1234567890"
                              value={registerForm.phone}
                              onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                              className="pl-10"
                              required={selectedRole === 'donor'}
                            />
                          </div>
                        </div>
                      )}

                      {(selectedRole === 'donor' || selectedRole === 'user') && (
                        <div className="space-y-2">
                          <Label htmlFor="registerAddress">Address</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                            <Textarea
                              id="registerAddress"
                              placeholder="Enter your address"
                              value={registerForm.address}
                              onChange={(e) => setRegisterForm(prev => ({ ...prev, address: e.target.value }))}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      )}

                      {selectedRole === 'admin' && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="organization">Organization *</Label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                id="organization"
                                placeholder="Organization name"
                                value={registerForm.organization}
                                onChange={(e) => setRegisterForm(prev => ({ ...prev, organization: e.target.value }))}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>

                          <div className="bg-red-50 p-3 rounded-md text-sm">
                            <p className="text-red-800">
                              <strong>Admin Security Password:</strong> Set an additional security password for enhanced protection
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="adminSecurityPasswordReg">Admin Security Password *</Label>
                            <div className="relative">
                              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                id="adminSecurityPasswordReg"
                                type="password"
                                placeholder="Create admin security password"
                                value={registerForm.adminSecurityPassword}
                                onChange={(e) => setRegisterForm(prev => ({ ...prev, adminSecurityPassword: e.target.value }))}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmAdminSecurityPassword">Confirm Admin Security Password *</Label>
                            <div className="relative">
                              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                id="confirmAdminSecurityPassword"
                                type="password"
                                placeholder="Confirm admin security password"
                                value={registerForm.confirmAdminSecurityPassword}
                                onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmAdminSecurityPassword: e.target.value }))}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setRegisterStep(2)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                          Complete Registration
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// ADMIN DASHBOARD COMPONENT
// ============================================================================

interface AdminDashboardProps {
  donations: Donation[];
}

function AdminDashboard({ donations }: AdminDashboardProps) {
  const totalDonations = donations.length;
  const availableDonations = donations.filter(d => d.status === 'available').length;
  const claimedDonations = donations.filter(d => d.status === 'claimed').length;
  const uniqueDonors = new Set(donations.map(d => d.donorName)).size;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'claimed':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDonations}</div>
            <p className="text-xs text-muted-foreground">
              All food donations registered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableDonations}</div>
            <p className="text-xs text-muted-foreground">
              Ready for claiming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claimed</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{claimedDonations}</div>
            <p className="text-xs text-muted-foreground">
              Successfully distributed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueDonors}</div>
            <p className="text-xs text-muted-foreground">
              Registered food donors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Donations Management */}
      <Card>
        <CardHeader>
          <CardTitle>All Donations Management</CardTitle>
          <p className="text-sm text-muted-foreground">
            Monitor and manage all food donations in the system
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {donations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No donations found. Encourage donors to register their food items.
              </p>
            ) : (
              donations.map((donation) => (
                <div
                  key={donation.id}
                  className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{donation.foodType}</h3>
                      <p className="text-sm text-muted-foreground">
                        {donation.description}
                      </p>
                    </div>
                    <Badge className={getStatusColor(donation.status)}>
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {/* Donor Information */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Donor Information
                      </h4>
                      <div className="space-y-1 text-muted-foreground">
                        <p><strong>Name:</strong> {donation.donorName}</p>
                        <p className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {donation.donorPhone}
                        </p>
                        <p className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {donation.donorAddress}
                        </p>
                      </div>
                    </div>

                    {/* Donation Details */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Donation Details
                      </h4>
                      <div className="space-y-1 text-muted-foreground">
                        <p><strong>Quantity:</strong> {donation.quantity}</p>
                        <p className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          <strong>Pickup Location:</strong> {donation.location}
                        </p>
                        <p className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <strong>Expires:</strong> {donation.expiryDate}
                        </p>
                        <p><strong>Posted:</strong> {donation.createdAt}</p>
                      </div>
                    </div>
                  </div>

                  {/* Claimed Information */}
                  {donation.status === 'claimed' && donation.claimedBy && (
                    <div className="bg-blue-50 p-3 rounded-md">
                      <h4 className="font-medium text-blue-900 mb-2">Claimed By:</h4>
                      <div className="text-sm text-blue-800">
                        <p><strong>Name:</strong> {donation.claimedBy.name}</p>
                        <p><strong>Phone:</strong> {donation.claimedBy.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// FOOD DONOR DASHBOARD COMPONENT
// ============================================================================

interface FoodDonorDashboardProps {
  onAddDonation: (donation: Omit<Donation, 'id' | 'status' | 'createdAt'>) => void;
  donations: Donation[];
  currentUser?: AuthUser;
}

function FoodDonorDashboard({ onAddDonation, donations, currentUser }: FoodDonorDashboardProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    donorName: currentUser?.name || '',
    donorPhone: currentUser?.phone || '',
    donorAddress: currentUser?.address || '',
    location: '',
    description: '',
    foodType: '',
    quantity: '',
    expiryDate: '',
  });

  const myDonations = donations.filter(d =>
    currentUser ? d.donorName === currentUser.name : d.donorName === formData.donorName
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.donorName || !formData.donorPhone || !formData.donorAddress ||
      !formData.location || !formData.description || !formData.foodType ||
      !formData.quantity || !formData.expiryDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    onAddDonation(formData);

    setFormData({
      donorName: currentUser?.name || '',
      donorPhone: currentUser?.phone || '',
      donorAddress: currentUser?.address || '',
      location: '',
      description: '',
      foodType: '',
      quantity: '',
      expiryDate: '',
    });

    setShowForm(false);
    toast.success('Food donation added successfully!');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'claimed':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Food Donor Dashboard</h2>
          <p className="text-muted-foreground">Share your surplus food with those in need</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Donate Food'}
        </Button>
      </div>

      {/* Donation Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-green-600" />
              Register New Food Donation
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Please provide all required details to help us connect your donation with those who need it
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Donor Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Your Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="donorName">Full Name *</Label>
                    <Input
                      id="donorName"
                      value={formData.donorName}
                      onChange={(e) => handleInputChange('donorName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      readOnly={!!currentUser}
                      className={currentUser ? 'bg-gray-50' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="donorPhone">Phone Number *</Label>
                    <Input
                      id="donorPhone"
                      type="tel"
                      value={formData.donorPhone}
                      onChange={(e) => handleInputChange('donorPhone', e.target.value)}
                      placeholder="+1234567890"
                      required
                      readOnly={!!currentUser}
                      className={currentUser ? 'bg-gray-50' : ''}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donorAddress">Your Address *</Label>
                  <Textarea
                    id="donorAddress"
                    value={formData.donorAddress}
                    onChange={(e) => handleInputChange('donorAddress', e.target.value)}
                    placeholder="Enter your complete address"
                    required
                    readOnly={!!currentUser}
                    className={currentUser ? 'bg-gray-50' : ''}
                  />
                </div>
              </div>

              {/* Food Information Section */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Food Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="foodType">Food Type *</Label>
                    <Input
                      id="foodType"
                      value={formData.foodType}
                      onChange={(e) => handleInputChange('foodType', e.target.value)}
                      placeholder="e.g., Vegetables, Fruits, Bread"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      placeholder="e.g., 5 kg, 10 loaves, 20 pieces"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the food items, their condition, and any special notes"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Pickup Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Where can people pick up the food?"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Best Before Date *</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Register Food Donation
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* My Donations */}
      <Card>
        <CardHeader>
          <CardTitle>My Donations</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track the status of your food donations
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myDonations.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  You haven't made any donations yet. Click "Donate Food" to get started!
                </p>
              </div>
            ) : (
              myDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{donation.foodType}</h3>
                      <p className="text-sm text-muted-foreground">
                        {donation.description}
                      </p>
                    </div>
                    <Badge className={getStatusColor(donation.status)}>
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p><strong>Quantity:</strong> {donation.quantity}</p>
                      <p className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        <strong>Pickup:</strong> {donation.location}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <strong>Expires:</strong> {donation.expiryDate}
                      </p>
                      <p><strong>Posted:</strong> {donation.createdAt}</p>
                    </div>
                  </div>

                  {donation.status === 'claimed' && donation.claimedBy && (
                    <div className="bg-blue-50 p-3 rounded-md">
                      <p className="text-sm text-blue-800">
                        <strong>Great news!</strong> Your donation has been claimed by {donation.claimedBy.name}
                        ({donation.claimedBy.phone})
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// USER DASHBOARD COMPONENT
// ============================================================================

interface UserDashboardProps {
  donations: Donation[];
  onClaimDonation: (donationId: string, claimedBy: { name: string; phone: string }) => void;
}

function UserDashboard({ donations, onClaimDonation }: UserDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [claimForm, setClaimForm] = useState({ name: '', phone: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const availableDonations = donations.filter(
    donation =>
      donation.status === 'available' &&
      (donation.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!claimForm.name || !claimForm.phone) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!selectedDonation) return;

    onClaimDonation(selectedDonation.id, {
      name: claimForm.name,
      phone: claimForm.phone,
    });

    setClaimForm({ name: '', phone: '' });
    setSelectedDonation(null);
    setIsDialogOpen(false);

    toast.success('Food donation claimed successfully! Please contact the donor to arrange pickup.');
  };

  const openClaimDialog = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsDialogOpen(true);
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Available Food Donations</h2>
        <p className="text-muted-foreground">Find and claim food donations in your area</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by food type, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Now</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableDonations.length}</div>
            <p className="text-xs text-muted-foreground">
              Food donations ready for pickup
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {availableDonations.filter(d => isExpiringSoon(d.expiryDate)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Donations expiring within 2 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Helped</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {donations.filter(d => d.status === 'claimed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully claimed donations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Available Donations */}
      <Card>
        <CardHeader>
          <CardTitle>Available Donations</CardTitle>
          <p className="text-sm text-muted-foreground">
            Click "Claim" to reserve a donation and get the donor's contact details
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableDonations.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm
                    ? 'No donations found matching your search.'
                    : 'No food donations available at the moment. Check back later!'
                  }
                </p>
              </div>
            ) : (
              availableDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{donation.foodType}</h3>
                      <p className="text-sm text-muted-foreground">
                        {donation.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className="bg-green-100 text-green-800">
                        Available
                      </Badge>
                      {isExpiringSoon(donation.expiryDate) && (
                        <Badge variant="destructive">
                          Expires Soon!
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p><strong>Quantity:</strong> {donation.quantity}</p>
                      <p className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        <strong>Pickup Location:</strong> {donation.location}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <strong>Best Before:</strong> {donation.expiryDate}
                      </p>
                      <p><strong>Posted:</strong> {donation.createdAt}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={() => openClaimDialog(donation)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Claim This Donation
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Claim Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Claim Food Donation</DialogTitle>
          </DialogHeader>
          {selectedDonation && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium">{selectedDonation.foodType}</h4>
                <p className="text-sm text-muted-foreground">{selectedDonation.description}</p>
                <p className="text-sm"><strong>Quantity:</strong> {selectedDonation.quantity}</p>
                <p className="text-sm"><strong>Pickup:</strong> {selectedDonation.location}</p>
              </div>

              <form onSubmit={handleClaimSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="claimName">Your Name *</Label>
                  <Input
                    id="claimName"
                    value={claimForm.name}
                    onChange={(e) => setClaimForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="claimPhone">Your Phone Number *</Label>
                  <Input
                    id="claimPhone"
                    type="tel"
                    value={claimForm.phone}
                    onChange={(e) => setClaimForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1234567890"
                    required
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                  <p><strong>Note:</strong> After claiming, you'll receive the donor's contact information to arrange pickup. Please be courteous and pick up the food as scheduled.</p>
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Confirm Claim
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [donations, setDonations] = useState<Donation[]>([
    {
      id: '1',
      donorName: 'John Doe',
      donorPhone: '+1234567890',
      donorAddress: '123 Main St, City, State',
      location: 'Downtown Community Center',
      description: 'Fresh vegetables from our garden harvest',
      foodType: 'Vegetables',
      quantity: '10 kg',
      expiryDate: '2025-11-05',
      status: 'available',
      createdAt: '2025-10-28',
    },
    {
      id: '2',
      donorName: 'Sarah Smith',
      donorPhone: '+1987654321',
      donorAddress: '456 Oak Ave, City, State',
      location: 'Local Food Bank',
      description: 'Surplus bread from bakery',
      foodType: 'Bakery Items',
      quantity: '20 loaves',
      expiryDate: '2025-11-02',
      status: 'claimed',
      createdAt: '2025-10-27',
      claimedBy: {
        name: 'Mike Johnson',
        phone: '+1122334455',
      },
    },
  ]);

  const addDonation = (donation: Omit<Donation, 'id' | 'status' | 'createdAt'>) => {
    const newDonation: Donation = {
      ...donation,
      id: Date.now().toString(),
      status: 'available',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDonations(prev => [newDonation, ...prev]);
  };

  const claimDonation = (donationId: string, claimedBy: { name: string; phone: string }) => {
    setDonations(prev =>
      prev.map(donation =>
        donation.id === donationId
          ? { ...donation, status: 'claimed' as const, claimedBy }
          : donation
      )
    );
  };

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'donor':
        return <Heart className="w-4 h-4" />;
      case 'user':
        return <UserCheck className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'donor':
        return 'bg-green-100 text-green-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const renderRoleContent = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard donations={donations} />;
      case 'donor':
        return <FoodDonorDashboard onAddDonation={addDonation} donations={donations} currentUser={currentUser} />;
      case 'user':
        return <UserDashboard donations={donations} onClaimDonation={claimDonation} />;
    }
  };

  if (!currentUser) {
    return (
      <>
        <AuthPage onLogin={handleLogin} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Food Waste Management System
              </h1>
              <p className="text-gray-600 mt-1">
                Connecting food donors with those in need
              </p>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Current Role Badge */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Badge variant="secondary" className={`text-lg px-4 py-2 ${getRoleColor(currentUser.role)}`}>
          {getRoleIcon(currentUser.role)}
          <span className="ml-2">
            Current Role: <span className="capitalize font-semibold">{currentUser.role}</span>
            {currentUser.role === 'admin' && currentUser.organization && (
              <span className="text-sm ml-2">({currentUser.organization})</span>
            )}
          </span>
        </Badge>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {renderRoleContent()}
      </main>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
