import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";

const PatientSettings = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Add your settings component content here */}
          <p>Settings component content</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientSettings;