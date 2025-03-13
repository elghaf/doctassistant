import React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { AlertCircle, Check } from "lucide-react";

export function SupabaseSetup() {
  const [supabaseUrl, setSupabaseUrl] = React.useState("");
  const [supabaseKey, setSupabaseKey] = React.useState("");
  const [isConfigured, setIsConfigured] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    // Check if Supabase is already configured
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (url && key) {
      setSupabaseUrl(url);
      setSupabaseKey(key);
      setIsConfigured(true);
    }
  }, []);

  const handleSaveConfig = async () => {
    setIsLoading(true);
    setError("");

    try {
      // In a real app, you would save these to environment variables
      // For demo purposes, we'll just set them in localStorage
      localStorage.setItem("SUPABASE_URL", supabaseUrl);
      localStorage.setItem("SUPABASE_ANON_KEY", supabaseKey);

      // Test the connection
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase
        .from("patients")
        .select("count", { count: "exact", head: true });

      if (error) throw error;

      setIsConfigured(true);
      // In a real app, you would need to restart the app to apply env changes
      window.location.reload();
    } catch (err) {
      console.error("Error connecting to Supabase:", err);
      setError("Failed to connect to Supabase. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isConfigured) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <Check className="h-4 w-4 text-green-600" />
        <AlertTitle>Supabase is configured</AlertTitle>
        <AlertDescription>
          Your application is connected to Supabase. Database functionality is
          ready to use.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Supabase</CardTitle>
        <CardDescription>
          Enter your Supabase credentials to connect to your database.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="supabase-url">Supabase URL</Label>
          <Input
            id="supabase-url"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            placeholder="https://your-project.supabase.co"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supabase-key">Supabase Anon Key</Label>
          <Input
            id="supabase-key"
            value={supabaseKey}
            onChange={(e) => setSupabaseKey(e.target.value)}
            placeholder="your-anon-key"
            type="password"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSaveConfig}
          disabled={isLoading || !supabaseUrl || !supabaseKey}
        >
          {isLoading ? "Connecting..." : "Connect to Supabase"}
        </Button>
      </CardFooter>
    </Card>
  );
}
