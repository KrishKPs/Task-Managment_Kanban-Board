import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export default function SignupComponent() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();    



  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        {
          username,
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      alert("User signed up successfully");
      router.push("/render"); 
       

    } catch (error) {
      setError(error.response?.data?.msg || "Error signing up");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#191919]">
      <Card className="w-full max-w-md bg-[#2f3437] border-[#4a4a4a] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[#e6e6e6]">
            Create an account
          </CardTitle>
          <CardDescription className="text-[#a3a3a3]">
            Enter your details to sign up
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-[#e6e6e6]"
              >
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-[#3f4447] border-[#4a4a4a] text-[#e6e6e6] focus:ring-[#5c7cfa] focus:border-[#5c7cfa]"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-[#e6e6e6]"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#3f4447] border-[#4a4a4a] text-[#e6e6e6] focus:ring-[#5c7cfa] focus:border-[#5c7cfa]"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-[#e6e6e6]"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#3f4447] border-[#4a4a4a] text-[#e6e6e6] focus:ring-[#5c7cfa] focus:border-[#5c7cfa]"
              />
            </div>
            {error && (
              <Alert
                variant="destructive"
                className="bg-[#4a2b2b] border-[#8b3e3e] text-[#e6a0a0]"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white transition-colors"
            >
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-[#a3a3a3]">
            Already have an account?{" "}
            <a href="#" className="text-[#5c7cfa] hover:underline">
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
