import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const DataManagementPage = () => {
  return (
    <DashboardLayout>
      <div className="w-full h-full bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Data Management</h1>
          {/* Add your data management content here */}
          <div className="bg-white p-6 rounded-lg shadow">
            <p>Data management features coming soon...</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DataManagementPage;