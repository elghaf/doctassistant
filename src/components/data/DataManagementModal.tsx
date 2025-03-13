import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Database,
  Upload,
  Download,
  Save,
  RefreshCw,
  FileUp,
  FileDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HardDrive,
  Clock,
} from "lucide-react";

interface DataManagementModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onExport?: (format: string, options: any) => void;
  onImport?: (file: File) => void;
  onBackup?: () => void;
  onRestore?: (file: File) => void;
}

const DataManagementModal = ({
  open = true,
  onOpenChange = () => {},
  onExport = () => {},
  onImport = () => {},
  onBackup = () => {},
  onRestore = () => {},
}: DataManagementModalProps) => {
  const [activeTab, setActiveTab] = useState("export");
  const [exportFormat, setExportFormat] = useState("json");
  const [exportOptions, setExportOptions] = useState({
    includePatients: true,
    includeAppointments: true,
    includeReports: true,
    dateRange: "all",
  });
  const [importFile, setImportFile] = useState<File | null>(null);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [operationStatus, setOperationStatus] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ status: "idle", message: "" });
  const [progress, setProgress] = useState(0);

  const handleExport = () => {
    setOperationStatus({ status: "loading", message: "Preparing export..." });
    setProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setOperationStatus({
            status: "success",
            message: "Data exported successfully!",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    onExport(exportFormat, exportOptions);
  };

  const handleImport = () => {
    if (!importFile) return;

    setOperationStatus({ status: "loading", message: "Importing data..." });
    setProgress(0);

    // Simulate import progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setOperationStatus({
            status: "success",
            message: "Data imported successfully!",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    onImport(importFile);
  };

  const handleBackup = () => {
    setBackupInProgress(true);
    setOperationStatus({ status: "loading", message: "Creating backup..." });
    setProgress(0);

    // Simulate backup progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setBackupInProgress(false);
          setOperationStatus({
            status: "success",
            message: "Backup created successfully!",
          });
          return 100;
        }
        return prev + 5;
      });
    }, 200);

    onBackup();
  };

  const handleRestore = () => {
    if (!restoreFile) return;

    setOperationStatus({ status: "loading", message: "Restoring data..." });
    setProgress(0);

    // Simulate restore progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setOperationStatus({
            status: "success",
            message: "Data restored successfully!",
          });
          return 100;
        }
        return prev + 8;
      });
    }, 250);

    onRestore(restoreFile);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "import" | "restore",
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (type === "import") {
        setImportFile(files[0]);
      } else {
        setRestoreFile(files[0]);
      }
      setOperationStatus({ status: "idle", message: "" });
    }
  };

  const resetStatus = () => {
    setOperationStatus({ status: "idle", message: "" });
    setProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </DialogTitle>
          <DialogDescription>
            Export, import, backup, or restore your patient data securely.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            resetStatus();
          }}
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="export" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Export
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              Import
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              Backup
            </TabsTrigger>
            <TabsTrigger value="restore" className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Restore
            </TabsTrigger>
          </TabsList>

          {/* Export Tab */}
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Export Patient Data</CardTitle>
                <CardDescription>
                  Export your patient data in various formats for backup or
                  transfer.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="export-format">Export Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger id="export-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Label>Data to Include</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="patients"
                        checked={exportOptions.includePatients}
                        onCheckedChange={(checked) =>
                          setExportOptions((prev) => ({
                            ...prev,
                            includePatients: !!checked,
                          }))
                        }
                      />
                      <label
                        htmlFor="patients"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Patient Records
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="appointments"
                        checked={exportOptions.includeAppointments}
                        onCheckedChange={(checked) =>
                          setExportOptions((prev) => ({
                            ...prev,
                            includeAppointments: !!checked,
                          }))
                        }
                      />
                      <label
                        htmlFor="appointments"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Appointments
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="reports"
                        checked={exportOptions.includeReports}
                        onCheckedChange={(checked) =>
                          setExportOptions((prev) => ({
                            ...prev,
                            includeReports: !!checked,
                          }))
                        }
                      />
                      <label
                        htmlFor="reports"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Reports & Documents
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select
                    value={exportOptions.dateRange}
                    onValueChange={(value) =>
                      setExportOptions((prev) => ({
                        ...prev,
                        dateRange: value,
                      }))
                    }
                  >
                    <SelectTrigger id="date-range">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-3-months">
                        Last 3 Months
                      </SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {operationStatus.status !== "idle" && (
                  <div className="space-y-2 mt-4">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-center text-muted-foreground">
                      {operationStatus.message}
                    </p>
                  </div>
                )}

                {operationStatus.status === "success" && (
                  <Alert
                    variant="success"
                    className="bg-green-50 text-green-800 border-green-200"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      {operationStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                {operationStatus.status === "error" && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {operationStatus.message}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleExport}
                  disabled={operationStatus.status === "loading"}
                  className="flex items-center gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  Export Data
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Import Tab */}
          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle>Import Patient Data</CardTitle>
                <CardDescription>
                  Import patient data from external sources.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="import-file">Upload File</Label>
                  <Input
                    id="import-file"
                    type="file"
                    accept=".json,.csv,.xlsx"
                    onChange={(e) => handleFileChange(e, "import")}
                  />
                  <p className="text-sm text-muted-foreground">
                    Supported formats: JSON, CSV, Excel (XLSX)
                  </p>
                </div>

                {importFile && (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                    <FileUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{importFile.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {(importFile.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                )}

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Importing data may overwrite existing records. Make sure to
                    backup your data before proceeding.
                  </AlertDescription>
                </Alert>

                {operationStatus.status !== "idle" && (
                  <div className="space-y-2 mt-4">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-center text-muted-foreground">
                      {operationStatus.message}
                    </p>
                  </div>
                )}

                {operationStatus.status === "success" && (
                  <Alert
                    variant="success"
                    className="bg-green-50 text-green-800 border-green-200"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      {operationStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                {operationStatus.status === "error" && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {operationStatus.message}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!importFile || operationStatus.status === "loading"}
                  className="flex items-center gap-2"
                >
                  <FileUp className="h-4 w-4" />
                  Import Data
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Backup Tab */}
          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle>Backup All Data</CardTitle>
                <CardDescription>
                  Create a complete backup of all your data for safekeeping.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-6 border rounded-md bg-muted/30 flex flex-col items-center justify-center text-center">
                  <HardDrive className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">
                    Create Complete Backup
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 mb-4">
                    This will create a complete backup of all your data,
                    including patient records, appointments, reports, and
                    settings.
                  </p>
                  <Button
                    onClick={handleBackup}
                    disabled={backupInProgress}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {backupInProgress ? "Creating Backup..." : "Create Backup"}
                  </Button>
                </div>

                {operationStatus.status !== "idle" && (
                  <div className="space-y-2 mt-4">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-center text-muted-foreground">
                      {operationStatus.message}
                    </p>
                  </div>
                )}

                {operationStatus.status === "success" && (
                  <Alert
                    variant="success"
                    className="bg-green-50 text-green-800 border-green-200"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      {operationStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Previous Backups</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Full Backup</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> May 15, 2023
                        </span>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Full Backup</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> April 2, 2023
                        </span>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="w-full"
                >
                  Close
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Restore Tab */}
          <TabsContent value="restore">
            <Card>
              <CardHeader>
                <CardTitle>Restore From Backup</CardTitle>
                <CardDescription>
                  Restore your data from a previous backup file.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="restore-file">Upload Backup File</Label>
                  <Input
                    id="restore-file"
                    type="file"
                    accept=".bak,.backup,.zip"
                    onChange={(e) => handleFileChange(e, "restore")}
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload a backup file (.bak, .backup, or .zip)
                  </p>
                </div>

                {restoreFile && (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{restoreFile.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {(restoreFile.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                )}

                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    Restoring from a backup will replace all current data. This
                    action cannot be undone.
                  </AlertDescription>
                </Alert>

                {operationStatus.status !== "idle" && (
                  <div className="space-y-2 mt-4">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-center text-muted-foreground">
                      {operationStatus.message}
                    </p>
                  </div>
                )}

                {operationStatus.status === "success" && (
                  <Alert
                    variant="success"
                    className="bg-green-50 text-green-800 border-green-200"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      {operationStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                {operationStatus.status === "error" && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {operationStatus.message}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRestore}
                  disabled={
                    !restoreFile || operationStatus.status === "loading"
                  }
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Restore Data
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DataManagementModal;
