import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { API_PATHS } from "../utils/apiPaths";
import axios from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  fallback;

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.post(API_PATHS.AUTH.SIGNUP, form);
      login(response.data);
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response);
      setErrorMessage(getErrorMessage(error, "Signup failed"));
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.4),_transparent_24%),linear-gradient(135deg,#fffaf0_0%,#ffffff_48%,#f8fafc_100%)] px-4 py-16">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="order-2 rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur lg:order-1">
          <h2 className="text-3xl font-bold text-slate-900">Create account</h2>
          <p className="mt-2 text-sm text-slate-500">
            Start your AI-powered interview preparation.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
          >
            <input
              type="text"
              value={form.name}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="email"
              value={form.email}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              value={form.password}
              placeholder="Create a password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errorMessage ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-orange-500 py-3 text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="my-5 flex items-center">
            <div className="h-px flex-1 bg-slate-200" />
            <p className="px-3 text-sm text-slate-400">OR</p>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-orange-500 hover:text-orange-600"
            >
              Login
            </Link>
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            Build Better Practice
          </p>
          <h1 className="max-w-xl text-5xl font-black tracking-tight text-slate-900">
            Turn every role into a guided interview session you can actually use.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Save targeted sessions, generate tailored question sets, and keep
            your prep organized as your goals change.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Tailored prompts</p>
              <p className="mt-1 text-sm text-slate-500">
                Focus your prep by role, experience, and topics.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-white shadow-sm">
              <p className="text-sm font-semibold">Fast review</p>
              <p className="mt-1 text-sm text-slate-300">
                Keep generated answers handy before the real interview starts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
