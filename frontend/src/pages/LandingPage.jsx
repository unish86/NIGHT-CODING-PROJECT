import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.45),_transparent_26%),linear-gradient(160deg,#fff7ed_0%,#ffffff_40%,#f8fafc_100%)]">
      <div className="absolute left-0 top-16 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-slate-200/60 blur-3xl" />

      <section className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl flex-col justify-center px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              Night Coding Marathon
            </p>
            <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
              Ace interviews with AI-powered sessions that feel built for you.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Create a role-focused session, generate tailored interview
              questions, and practice with structured answers before the real
              conversation starts.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                className="rounded-xl bg-slate-900 px-7 py-3 text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                onClick={() => navigate("/signup")}
              >
                Start Preparing
              </button>
              <button
                className="rounded-xl border border-slate-300 bg-white px-7 py-3 text-slate-700 transition hover:border-orange-300 hover:text-orange-500"
                onClick={() => navigate("/login")}
              >
                I already have an account
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">Session Preview</p>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                  Live Prep
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                Frontend Developer
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Experience: 2 years • Focus: React, JavaScript, APIs
              </p>
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">
                    How does React reconcile UI changes efficiently?
                  </p>
                </div>
                <div className="rounded-2xl bg-orange-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">
                    Explain event delegation and where it helps in frontend apps.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-4 text-white">
                  <p className="text-sm font-semibold">
                    Build confidence with cleaner, role-specific practice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
