import React, { useState } from "react";
import { Check, X, Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AppointmentRequest {
  id: string;
  patientName: string;
  patientId: string;
  patientAvatar?: string;
  requestDate: Date;
  appointmentDate: Date;
  reason: string;
  status: "pending" | "approved" | "declined";
  notes?: string;
}

interface AppointmentRequestsProps {
  requests?: AppointmentRequest[];
  onApprove?: (id: string) => void;
  onDecline?: (id: string) => void;
}

const AppointmentRequests = ({
  requests = [
    {
      id: "1",
      patientName: "Sarah Johnson",
      patientId: "P-1001",
      patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      requestDate: new Date(2023, 5, 15),
      appointmentDate: new Date(2023, 5, 20, 10, 30),
      reason: "Annual physical examination",
      status: "pending",
    },
    {
      id: "2",
      patientName: "Michael Chen",
      patientId: "P-1002",
      patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      requestDate: new Date(2023, 5, 16),
      appointmentDate: new Date(2023, 5, 21, 14, 0),
      reason: "Follow-up on medication",
      status: "pending",
    },
    {
      id: "3",
      patientName: "Emily Rodriguez",
      patientId: "P-1003",
      patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      requestDate: new Date(2023, 5, 17),
      appointmentDate: new Date(2023, 5, 22, 9, 15),
      reason: "Chronic pain consultation",
      status: "pending",
    },
  ],
  onApprove = (id) => console.log(`Approved appointment ${id}`),
  onDecline = (id) => console.log(`Declined appointment ${id}`),
}: AppointmentRequestsProps) => {
  const [selectedRequest, setSelectedRequest] =
    useState<AppointmentRequest | null>(null);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const handleApprove = (request: AppointmentRequest) => {
    onApprove(request.id);
  };

  const handleDeclineClick = (request: AppointmentRequest) => {
    setSelectedRequest(request);
    setDeclineDialogOpen(true);
  };

  const handleDeclineConfirm = () => {
    if (selectedRequest) {
      onDecline(selectedRequest.id);
      setDeclineDialogOpen(false);
      setDeclineReason("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Appointment Requests
        </h2>
        <p className="text-gray-600">
          Review and manage pending appointment requests
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No pending appointment requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card
              key={request.id}
              className="overflow-hidden border-l-4 border-l-blue-500"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={request.patientAvatar}
                        alt={request.patientName}
                      />
                      <AvatarFallback>
                        {request.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {request.patientName}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        Patient ID: {request.patientId}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {request.status === "pending"
                      ? "Pending"
                      : request.status === "approved"
                        ? "Approved"
                        : "Declined"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {format(request.appointmentDate, "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {format(request.appointmentDate, "h:mm a")}
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <h4 className="text-sm font-medium">Reason for Visit:</h4>
                  <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                </div>
                <div className="mt-3">
                  <h4 className="text-sm font-medium">Request Date:</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {format(request.requestDate, "MMMM d, yyyy")}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeclineClick(request)}
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="mr-1 h-4 w-4" />
                  Decline
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApprove(request)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-1 h-4 w-4" />
                  Approve
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Appointment Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to decline the appointment request from{" "}
              {selectedRequest?.patientName}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label
              htmlFor="decline-reason"
              className="block text-sm font-medium mb-2"
            >
              Reason for declining (optional):
            </label>
            <textarea
              id="decline-reason"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Provide a reason for declining this appointment request..."
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeclineDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeclineConfirm}>
              Decline Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentRequests;
