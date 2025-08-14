import { createFileRoute } from "@tanstack/react-router";
import "./Landing.css";
import logo from "../../assets/zaptalk.png";
import intro from "../../assets/intro.gif";
import { path } from "@/constants/path";
import { useNavigate } from "react-router-dom";
import Statistics from "@/components/landing/Statistics";

export const Route = createFileRoute("/")({
  component: Landing,
});

export default function Landing() {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full h-screen flex bg-gray-50 justify-between px-20 items-center">
        {/* logo & slogan */}
        <div className="max-w-lg space-y-6">
          <div className="flex items-center gap-6">
            <img
              src={logo}
              className="w-32 h-32 object-contain"
              alt="ZapTalk Logo"
            />
            <div className="border-r-2 h-28" />
            <h1 className="text-4xl font-bold masked-text">
              Welcome to ZapTalk
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Connect, chat, and collaborate seamlessly – anytime, anywhere.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 mt-4 justify-center">
            <button
              className="rounded-full border-1 py-2 px-4 flex items-center text-center text-sm text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={() => navigate(path.login)}
            >
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 ml-1.5"
              >
                <path
                  fillRule="evenodd"
                  d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* gif intro */}
        <img
          src={intro}
          alt="ZapTalk animation"
          className="w-1/2 h-screen object-contain"
        />
      </div>
      <Statistics />
    </>
  );
}
