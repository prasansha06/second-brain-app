import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { LogoIcon } from "../icons/LogoIcon";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";

export function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSignin = async () => {
    setError(null);
    if (!username.trim() || !password.trim()) {
      setError("Please provide username and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        username,
        password
      });

      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials or backend offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-6">
        <LogoIcon />
        <span className="text-2xl font-bold text-gray-900 tracking-tight">Brainly</span>
      </div>

      {/* Login Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-1">Welcome Back</h2>
        <p className="text-xs text-gray-500 text-center mb-6">
          Sign in to access your digital second brain
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-md border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <Input
              placeholder="e.g. johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              text="Sign In"
              fullWidth
              loading={loading}
              onClick={handleSignin}
            />
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-600 font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
