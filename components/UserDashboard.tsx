import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Donation } from '../App';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Package, 
  Phone, 
  User,
  Heart,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UserDashboardProps {
  donations: Donation[];
  onClaimDonation: (donationId: string, claimedBy: { name: string; phone: string }) => void;
}

export function UserDashboard({ donations, onClaimDonation }: UserDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [claimForm, setClaimForm] = useState({ name: '', phone: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter available donations and apply search
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

    // Reset form
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