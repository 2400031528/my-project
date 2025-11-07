import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Donation } from '../App';
import { 
  Users, 
  Heart, 
  Package, 
  TrendingUp, 
  Phone, 
  MapPin, 
  Calendar,
  User
} from 'lucide-react';

interface AdminDashboardProps {
  donations: Donation[];
}

export function AdminDashboard({ donations }: AdminDashboardProps) {
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