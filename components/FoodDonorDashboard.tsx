import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Donation } from '../App';
import { AuthUser } from './AuthPage';
import { 
  Plus, 
  Heart, 
  Package, 
  Phone, 
  MapPin, 
  Calendar,
  User,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FoodDonorDashboardProps {
  onAddDonation: (donation: Omit<Donation, 'id' | 'status' | 'createdAt'>) => void;
  donations: Donation[];
  currentUser?: AuthUser;
}

export function FoodDonorDashboard({ onAddDonation, donations, currentUser }: FoodDonorDashboardProps) {
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

  // Filter donations by current donor
  const myDonations = donations.filter(d => 
    currentUser ? d.donorName === currentUser.name : d.donorName === formData.donorName
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.donorName || !formData.donorPhone || !formData.donorAddress || 
        !formData.location || !formData.description || !formData.foodType || 
        !formData.quantity || !formData.expiryDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    onAddDonation(formData);
    
    // Reset form (keeping user info)
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