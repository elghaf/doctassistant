import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const PatientMessages = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Communicate with your healthcare providers</p>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Add your messages component content here */}
          <p>Messages component content</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientMessages;