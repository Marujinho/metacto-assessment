import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lightbulb, LogIn, LogOut, Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../lib/errorMessages";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
    setSearchParams(
      searchInput.trim()
        ? { search: searchInput.trim(), sort: "top" }
        : { sort: "top" }
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out.");
      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-gray-900 shrink-0"
        >
          <Lightbulb size={22} className="text-indigo-600" />
          <span className="hidden sm:inline">FeatureVote</span>
        </Link>

        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search features..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-1.5 pl-9 pr-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </form>

        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-600">
                {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Log in</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                <UserPlus size={16} />
                <span className="hidden sm:inline">Sign up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
