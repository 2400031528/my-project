import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { UserRole } from '../App';
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
  Building
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  organization?: string;
  password?: string; // Store password for registered users
  adminSecurityPassword?: string; // Store admin security password
}

interface AuthPageProps {
  onLogin: (user: AuthUser) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  
  // Step management
  const [loginStep, setLoginStep] = useState(1); // 1: credentials, 2: role selection
  const [registerStep, setRegisterStep] = useState(1); // 1: basic info, 2: role selection, 3: role-specific info
  
  // Load registered users from localStorage
  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('registeredUsers');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    adminSecurityPassword: '', // Extra security for admin
  });

  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
    organization: '', // For admin role
    adminSecurityPassword: '', // Extra security for admin registration
    confirmAdminSecurityPassword: '',
  });

  // Mock users for demonstration
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

  // Combine mock users with registered users
  const allUsers = [...mockUsers, ...registeredUsers];

  const handleLoginStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      toast.error('Please fill in all fields', { duration: 3000 });
      return;
    }

    // Authentication - check if credentials are valid
    const user = allUsers.find(u => u.email === loginForm.email);
    
    if (user && user.password && loginForm.password === user.password) {
      setLoginStep(2); // Proceed to role selection
    } else if (user && user.password && loginForm.password !== user.password) {
      // Wrong password case
      toast.error('Password is wrong please enter correctly', { duration: 3000 });
    } else {
      // Email not found case
      toast.error('Email not found. Please check your email or register', { duration: 3000 });
    }
  };

  const handleLoginStep2 = (role: UserRole) => {
    if (role === 'admin') {
      // For admin, proceed to security password step
      setSelectedRole(role);
      setLoginStep(3);
    } else {
      // For donor and user, complete login immediately
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
    
    // Check admin security password
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
    
    // Validation for basic info
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

    // Check if email already exists
    if (allUsers.find(u => u.email === registerForm.email)) {
      toast.error('Email already exists', { duration: 3000 });
      return;
    }

    setRegisterStep(2); // Proceed to role selection
  };

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'user') {
      // Users don't need additional info, complete registration
      completeRegistration(role);
    } else {
      // Admin and donor need additional info
      setRegisterStep(3);
    }
  };

  const handleRegisterStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Additional validation based on role
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
    // Create new user
    const newUser: AuthUser = {
      id: Date.now().toString(),
      email: registerForm.email,
      name: registerForm.name,
      role: role,
      phone: registerForm.phone || undefined,
      address: registerForm.address || undefined,
      organization: registerForm.organization || undefined,
      password: registerForm.password, // Store the user's password
      adminSecurityPassword: role === 'admin' ? registerForm.adminSecurityPassword : undefined, // Store admin security password
    };

    // Add user to registered users and save to localStorage
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

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100';
      case 'donor':
        return 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100';
      case 'user':
        return 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100';
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
        {/* Header */}
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
              // Reset steps when switching tabs
              setLoginStep(1);
              setRegisterStep(1);
              setSelectedRole('user');
              // Clear form data
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

                    {/* Demo credentials */}
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
                              className="pl-10 min-h-[60px] resize-none"
                            />
                          </div>
                        </div>
                      )}

                      {selectedRole === 'admin' && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="registerOrganization">Organization *</Label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                id="registerOrganization"
                                placeholder="Enter your organization name"
                                value={registerForm.organization}
                                onChange={(e) => setRegisterForm(prev => ({ ...prev, organization: e.target.value }))}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>

                          <div className="bg-red-50 p-3 rounded-md text-sm">
                            <div className="flex items-center space-x-2 text-red-800 mb-2">
                              <Shield className="w-4 h-4" />
                              <span className="font-medium">Admin Security Password</span>
                            </div>
                            <p className="text-red-700">
                              Create an additional security password for enhanced admin account protection.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="adminSecurityPassword">Admin Security Password *</Label>
                            <div className="relative">
                              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                id="adminSecurityPassword"
                                type="password"
                                placeholder="Create admin security password (min. 6 characters)"
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
                        <Button 
                          type="submit" 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Create Account
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}