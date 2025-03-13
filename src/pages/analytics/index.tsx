import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, Brain, Activity } from "lucide-react";

// Sample data - replace with real data in production
const data = [
  { name: "Jan", patients: 400, appointments: 240, aiConsults: 100 },
  { name: "Feb", patients: 300, appointments: 139, aiConsults: 150 },
  { name: "Mar", patients: 200, appointments: 980, aiConsults: 200 },
  { name: "Apr", patients: 278, appointments: 390, aiConsults: 250 },
  { name: "May", patients: 189, appointments: 480, aiConsults: 300 },
  { name: "Jun", patients: 239, appointments: 380, aiConsults: 350 },
];

const stats = [
  {
    name: "Total Patients",
    value: "1,234",
    change: "+12.3%",
    icon: Users,
  },
  {
    name: "Appointments",
    value: "567",
    change: "+5.6%",
    icon: Calendar,
  },
  {
    name: "AI Consultations",
    value: "890",
    change: "+23.4%",
    icon: Brain,
  },
  {
    name: "Active Cases",
    value: "123",
    change: "-2.3%",
    icon: Activity,
  },
];

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("month");

  return (
    <DashboardLayout>
      <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <Tabs defaultValue="month" value={timeRange} onValueChange={setTimeRange}>
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.name} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.name}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-gray-400" />
                </div>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} from last period
                </p>
              </Card>
            ))}
          </div>

          {/* Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Activity Overview</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="patients" 
                    stroke="#8884d8" 
                    name="Patients"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="appointments" 
                    stroke="#82ca9d" 
                    name="Appointments"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="aiConsults" 
                    stroke="#ffc658" 
                    name="AI Consults"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
