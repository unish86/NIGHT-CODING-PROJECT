import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_PATHS } from "../utils/apiPaths";
import axios from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  fallback;

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      const res = await axios.post(API_PATHS.AUTH.LOGIN, form);
      login(res.data);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Invalid email or password"));
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.35),_transparent_28%),linear-gradient(135deg,#fff7ed_0%,#fffbeb_42%,#ffffff_100%)] px-4 py-16">
      <div className="absolute inset-x-0 top-0 h-64 bg-[linear-gradient(120deg,rgba(15,23,42,0.08),transparent)]" />

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="hidden lg:block">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            AI Interview Practice
          </p>
          <h1 className="max-w-xl text-5xl font-black tracking-tight text-slate-900">
            Walk into your next interview with better answers already prepared.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
            Build focused interview sessions, generate tailored questions, and
            review crisp answers in one place.
          </p>
          <div className="mt-8 grid max-w-lg gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold text-slate-900">Role-based prep</p>
              <p className="mt-1 text-sm text-slate-500">
                Generate questions for frontend, backend, full stack, and more.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-white/80 p-4 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold text-slate-900">Session history</p>
              <p className="mt-1 text-sm text-slate-500">
                Revisit saved sessions whenever you want to practice again.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">
            Login to continue your interview preparation.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <input
              type="email"
              name="email"
              value={form.email}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              onChange={handleForm}
            />

            <input
              type="password"
              name="password"
              value={form.password}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              onChange={handleForm}
            />
            {errorMessage ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-slate-900 py-3 text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="my-5 flex items-center">
            <div className="h-px flex-1 bg-slate-200" />
            <p className="px-3 text-sm text-slate-400">OR</p>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-orange-500 hover:text-orange-600"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
