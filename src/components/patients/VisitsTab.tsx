import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Search, Filter, Plus, FileText, Edit, Trash2 } from "lucide-react";
import { usePatient } from "@/components/patients/PatientContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import VisitForm from "./VisitForm";

interface Visit {
  id: string;
  visit_date: string;
  chief_complaint: string;
  diagnosis: string;
  treatment_plan: string;
  notes: string;
  appointment_id?: string;
}

interface VisitsTabProps {
  patientId?: string;
  visits?: Visit[];
}

const VisitsTab = ({
  patientId = "123",
  visits: providedVisits,
}: VisitsTabProps) => {
  const { visits: contextVisits, refreshVisits } = usePatient();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddVisitOpen, setIsAddVisitOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (providedVisits) {
      setVisits(providedVisits);
    } else if (contextVisits) {
      setVisits(contextVisits);
    }
  }, [providedVisits, contextVisits]);

  const handleViewDetails = (visit: Visit) => {
    setSelectedVisit(visit);
    setIsDetailsOpen(true);
  };

  const handleAddVisit = () => {
    setIsAddVisitOpen(true);
  };

  const handleSaveVisit = async (data: any) => {
    try {
      setIsLoading(true);
      const { supabase } = await import("@/lib/supabase");

      // Save the visit using the edge function
      const { data: responseData, error } = await supabase.functions.invoke(
        "supabase-functions-save-visit",
        {
          body: {
            patientId,
            visitDate: data.visitDate.toISOString().split("T")[0],
            chiefComplaint: data.chiefComplaint,
            diagnosis: data.diagnosis,
            treatmentPlan: data.treatmentPlan,
            notes: data.notes,
          },
        },
      );

      if (error) throw error;

      // Refresh visits data
      if (refreshVisits) {
        await refreshVisits(patientId);
      }

      setIsAddVisitOpen(false);
    } catch (error) {
      console.error("Error saving visit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter visits based on search query
  };

  const filteredVisits = visits.filter((visit) =>
    searchQuery
      ? visit.chief_complaint
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        visit.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase())
      : true,
  );

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search visits..."
              className="pl-10 pr-4 py-2 border rounded-md w-[300px] focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddVisit}>
          <Plus className="h-4 w-4" />
          Add Visit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visit History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredVisits.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Chief Complaint</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>
                      {format(new Date(visit.visit_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{visit.chief_complaint}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{visit.diagnosis}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      {visit.treatment_plan}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(visit)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No visits found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleAddVisit}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Visit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visit Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Visit Details</DialogTitle>
          </DialogHeader>
          {selectedVisit && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Date</h4>
                  <p>
                    {format(new Date(selectedVisit.visit_date), "MMMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Chief Complaint
                  </h4>
                  <p>{selectedVisit.chief_complaint}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Diagnosis</h4>
                <p>{selectedVisit.diagnosis}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Treatment</h4>
                <p>{selectedVisit.treatment_plan}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                <p className="text-sm">{selectedVisit.notes}</p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Generate Report</Button>
                <Button variant="outline">Edit Visit</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Visit Dialog */}
      <Dialog open={isAddVisitOpen} onOpenChange={setIsAddVisitOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Visit</DialogTitle>
          </DialogHeader>
          <VisitForm
            patientId={patientId}
            onSubmit={handleSaveVisit}
            onCancel={() => setIsAddVisitOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VisitsTab;
