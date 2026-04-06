import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [topicsToFocus, setTopicsToFocus] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchSessions = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(res.data.sessions || []);
    } catch (error) {
      console.log(error.response);
    }
  };

  const createSession = async () => {
    if (!role || !experience) {
      alert("Fill role and experience first");
      return;
    }

    setCreating(true);
    try {
      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        role,
        experience,
        topicsToFocus,
        description,
        questions: [],
      });

      const createdSession = response.data.session;
      setSessions((prev) => [createdSession, ...prev]);
      setRole("");
      setExperience("");
      setTopicsToFocus("");
      setDescription("");
      navigate(`/interview/${createdSession._id}`);
    } catch (error) {
      console.log(error.response);
      alert("Failed to create session");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_28%,#f8fafc_100%)] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-500">
              Practice Workspace
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
              {user?.name ? `Welcome back, ${user.name}.` : "Dashboard"}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Build focused interview sessions, generate tailored questions, and
              keep your prep organized by role, experience, and topic.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-orange-100 bg-white/90 p-5 shadow-sm">
                <p className="text-sm text-slate-500">Sessions</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{sessions.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm">
                <p className="text-sm text-slate-300">Focus</p>
                <p className="mt-2 text-lg font-semibold">Role-based preparation</p>
              </div>
              <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
                <p className="text-sm text-amber-700">Best flow</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Create, generate, review</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  New Session
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Create a targeted prep track</h2>
              </div>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                Guided
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                placeholder="Role (Frontend Developer)"
                value={role}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                onChange={(e) => setRole(e.target.value)}
              />

              <input
                placeholder="Experience (2 years)"
                value={experience}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                onChange={(e) => setExperience(e.target.value)}
              />

              <input
                placeholder="Topics to focus (React, Node.js, APIs)"
                value={topicsToFocus}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100 md:col-span-2"
                onChange={(e) => setTopicsToFocus(e.target.value)}
              />

              <textarea
                placeholder="Optional description for this session"
                value={description}
                rows="4"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100 md:col-span-2"
                onChange={(e) => setDescription(e.target.value)}
              />

              <button
                onClick={createSession}
                disabled={creating}
                className="rounded-2xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800 disabled:opacity-60 md:col-span-2"
              >
                {creating ? "Creating session..." : "Create Session"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Your Library
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Saved interview sessions</h2>
            </div>
          </div>

          {sessions.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-8 py-16 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">No sessions yet.</p>
              <p className="mt-2 text-sm text-slate-500">
                Create your first session and we will take you straight into question generation.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sessions.map((session, index) => (
                <button
                  key={session._id}
                  onClick={() => navigate(`/interview/${session._id}`)}
                  className="group rounded-[2rem] border border-white/80 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">
                        Session {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-3 text-xl font-bold text-slate-900">{session.role}</h3>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                      {session.experience}
                    </span>
                  </div>

                  {session.topicsToFocus ? (
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      <span className="font-semibold text-slate-900">Focus:</span> {session.topicsToFocus}
                    </p>
                  ) : (
                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      Generate a fresh question set for this role.
                    </p>
                  )}

                  <div className="mt-6 flex items-center justify-between text-sm font-medium text-slate-400 transition group-hover:text-orange-500">
                    <span>Open session</span>
                    <span>-&gt;</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
