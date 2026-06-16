'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function FinancePage() {
  const [revenue, setRevenue] = useState(12500);
  const [adSpend, setAdSpend] = useState(3200);

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Finance & Reports</h1>
        <p className="mt-2 text-gray-600">Track revenue, ad spend, and generate accounting exports.</p>
        <p className="mt-1 text-xs text-red-500 font-bold uppercase tracking-wider">Disclaimer: This tool provides estimates and is not legal tax advice. Consult an accountant.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>All connected sources</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-green-600">${revenue.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Ad Spend</CardTitle>
            <CardDescription>Meta, Google, TikTok</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-red-600">${adSpend.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Profit (Est.)</CardTitle>
            <CardDescription>Revenue minus Ad Spend</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-blue-600">${(revenue - adSpend).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Export Accounting Reports</CardTitle>
            <CardDescription>Download CSV or Excel summaries for QuickBooks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" onClick={() => alert('Mock: Downloading CSV...')}>Download CSV (Excel Compatible)</Button>
            <Button variant="outline" className="w-full" onClick={() => alert('Mock: Syncing to Google Sheets...')}>Sync to Google Sheets</Button>
            <Button variant="outline" className="w-full" onClick={() => alert('Mock: Connecting to QuickBooks...')}>Connect to QuickBooks</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manual Entry</CardTitle>
            <CardDescription>Log off-platform revenue or expenses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="number" placeholder="Amount ($)" />
            <Input type="text" placeholder="Description / Category" />
            <div className="flex gap-4">
              <Button onClick={() => setRevenue(r => r + 500)} className="w-full bg-green-600 hover:bg-green-700">Add Revenue</Button>
              <Button onClick={() => setAdSpend(a => a + 500)} className="w-full bg-red-600 hover:bg-red-700">Add Expense</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
