'use client';

import { useState, useEffect } from 'react';
import { apiClient } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Subscription = {
  planName: string;
  status: string;
  amount: number;
  nextBillingDate: string;
};

type PaymentMethod = {
  id: string;
  provider: string;
  last4?: string;
  email?: string;
  isDefault: boolean;
};

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const subRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/billing/subscription`);
      if (subRes.ok) setSubscription(await subRes.json());

      const pmRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/billing/payment-methods`);
      if (pmRes.ok) setPaymentMethods(await pmRes.json());
    } catch (error) {
      console.error('Error fetching billing data', error);
    }
  };

  const handleCheckout = async (planId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });
      if (res.ok) {
        const { url } = await res.json();
        alert(`Redirecting to mock checkout: ${url}`);
      }
    } catch (error) {
      console.error('Checkout failed', error);
    }
  };

  const handleDeletePM = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/billing/payment-methods/${id}`, { method: 'DELETE' });
      if (res.ok) fetchBillingData();
    } catch (error) {
      console.error('Error deleting payment method', error);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscriptions</h1>
        <p className="mt-2 text-gray-600">Manage your ContentCommand AI plan and payment methods.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Your active plan and upcoming charges.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription ? (
              <div className="space-y-2">
                <p><strong>Plan:</strong> {subscription.planName}</p>
                <p><strong>Status:</strong> <span className="capitalize text-green-600">{subscription.status}</span></p>
                <p><strong>Amount:</strong> ${subscription.amount}/mo</p>
                <p><strong>Next Billing:</strong> {new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
                <div className="pt-4">
                  <Button variant="outline" className="w-full">Manage Plan</Button>
                </div>
              </div>
            ) : (
              <p>Loading subscription details...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Cards and accounts on file.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.length > 0 ? (
              <ul className="space-y-4">
                {paymentMethods.map(pm => (
                  <li key={pm.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{pm.provider} {pm.last4 ? `ending in ${pm.last4}` : ''}</p>
                      {pm.email && <p className="text-sm text-gray-500">{pm.email}</p>}
                      {pm.isDefault && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>}
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleDeletePM(pm.id)}>Remove</Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No payment methods found.</p>
            )}
            <div className="pt-4 border-t mt-4 space-y-2">
              <Button onClick={() => alert('Mock: Add new card placeholder')} className="w-full">Add Payment Method</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>Upgrade to unlock more AI generations and workspaces.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Starter', 'Pro Creator', 'Agency'].map(plan => (
                <div key={plan} className="border p-4 rounded text-center space-y-4">
                  <h3 className="font-bold text-lg">{plan}</h3>
                  <Button onClick={() => handleCheckout(plan.toLowerCase().replace(' ', '-'))} variant={subscription?.planName === plan ? 'secondary' : 'default'} className="w-full">
                    {subscription?.planName === plan ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
