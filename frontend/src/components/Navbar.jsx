import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userName = user?.name?.trim() || "User";
  const userEmail = user?.email?.trim() || "No email available";
  const userInitial = userName.charAt(0).toUpperCase();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const linkClasses = (path) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive(path)
        ? "bg-slate-900 text-white shadow-sm"
        : "text-slate-600 hover:bg-white hover:text-orange-500"
    }`;

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate("/");
  };

  useEffect(() => {
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-black text-white shadow-lg shadow-slate-900/15">
            NC
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-500">
              Night Coding
            </p>
            <p className="text-sm font-semibold text-slate-900">Interview Prep Studio</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 rounded-full bg-slate-100/80 p-1.5">
          <Link className={linkClasses("/")} to="/">
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link className={linkClasses("/dashboard")} to="/dashboard">
                Dashboard
              </Link>
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-orange-500 shadow-sm transition hover:bg-orange-50"
                  onClick={() => setIsProfileOpen((open) => !open)}
                >
                  <FiUser className="text-lg" />
                </button>

                {isProfileOpen ? (
                  <div className="absolute right-0 top-14 w-72 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-lg font-bold text-white shadow-md shadow-orange-200">
                        {userInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
                          Profile
                        </p>
                        <p className="truncate text-base font-semibold text-slate-900">
                          {userName}
                        </p>
                        <p className="truncate text-sm text-slate-500">{userEmail}</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Status
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        Signed in and ready to continue your prep
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
              <button
                className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className={linkClasses("/login")} to="/login">
                Login
              </Link>
              <Link
                className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                to="/signup"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
