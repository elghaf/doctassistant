import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, ChevronRight } from "lucide-react";
import { getWorkflowStatuses } from "@/lib/workflow";

interface WorkflowStatusCardProps {
  onViewAll?: () => void;
}

const WorkflowStatusCard = ({
  onViewAll = () => {},
}: WorkflowStatusCardProps) => {
  const [statuses, setStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statusesData = await getWorkflowStatuses();
        setStatuses(statusesData);

        // In a real implementation, you would fetch the counts from the database
        // For now, we'll use mock data
        const mockCounts: Record<string, number> = {};
        statusesData.forEach((status) => {
          mockCounts[status.id] = Math.floor(Math.random() * 5); // Random count between 0-4
        });
        setCounts(mockCounts);
      } catch (error) {
        console.error("Error fetching workflow statuses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="h-full bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            <span>Workflow Status</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm"
            onClick={onViewAll}
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {statuses.map((status) => (
              <div
                key={status.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="font-medium">{status.name}</span>
                </div>
                <Badge variant="secondary">
                  {counts[status.id] || 0} patients
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkflowStatusCard;
