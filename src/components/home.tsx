import { useAuth } from "./auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Home() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Medical Office Management System
          </CardTitle>
          <CardDescription className="text-xl mt-2">
            A comprehensive platform for patients and healthcare providers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                For Patients
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  ✓ Schedule appointments online
                </li>
                <li className="flex items-center">
                  ✓ Complete health questionnaires
                </li>
                <li className="flex items-center">
                  ✓ View medical reports and lab results
                </li>
                <li className="flex items-center">
                  ✓ Secure messaging with your doctor
                </li>
              </ul>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                For Doctors
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  ✓ Manage patient appointments
                </li>
                <li className="flex items-center">
                  ✓ Review patient questionnaires
                </li>
                <li className="flex items-center">
                  ✓ Generate AI-powered medical reports
                </li>
                <li className="flex items-center">
                  ✓ Streamlined patient communication
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 pt-6">
          {isSignedIn ? (
            <Button size="lg" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button size="lg" onClick={() => navigate("/login")}>
                Sign In
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/register")}
              >
                Create Account
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default Home;
