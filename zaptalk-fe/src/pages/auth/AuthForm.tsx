import { useState } from "react";
import { Link } from "react-router-dom";
import { path } from "../../constants/path";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/ad/6d/1b/ad6d1bd01156597ad9c1c7f0af038d87.jpg')",
      }}
    >
      <div className="relative w-screen h-screen bg-white/70 backdrop-blur-md shadow-2xl overflow-hidden z-10">
        {/* Sign Up */}
        <div
          className={`absolute top-0 left-0 h-full w-1/2 flex items-center justify-center transition-all duration-700 ${
            isSignUp ? "translate-x-full opacity-100 z-20" : "opacity-0 z-10"
          }`}
        >
          <form className="flex flex-col items-center justify-center text-center px-12 w-3/4">
            <h1
              className="text-5xl font-bold mb-6"
              style={{ fontFamily: "Caprasimo" }}
            >
              Sign Up
            </h1>
            <input
              type="text"
              placeholder="Name"
              className="mb-4 w-full px-5 py-3 bg-gray-100 rounded-lg outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              className="mb-4 w-full px-5 py-3 bg-gray-100 rounded-lg outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="mb-6 w-full px-5 py-3 bg-gray-100 rounded-lg outline-none"
            />
            <button
              type="submit"
              className="px-12 py-4 rounded-full text-black font-bold uppercasetransition"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* Sign In */}
        <div
          className={`absolute top-0 left-0 h-full w-1/2 flex items-center justify-center transition-all duration-700 ${
            isSignUp ? "translate-x-full opacity-0 z-10" : "opacity-100 z-20"
          }`}
        >
          <form className="flex flex-col items-center justify-center text-center px-12 w-3/4">
            <h1
              className="text-5xl font-bold mb-6"
              style={{ fontFamily: "Caprasimo" }}
            >
              Sign In
            </h1>
            <input
              type="email"
              placeholder="Email"
              className="mb-4 w-full px-5 py-3 bg-gray-100 rounded-lg outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="mb-6 w-full px-5 py-3 bg-gray-100 rounded-lg outline-none"
            />
            <Link
              to={path.home}
              className="text-sm text-blue-500 hover:underline mb-6"
            >
              Forgot your password?
            </Link>
            <button
              type="submit"
              className="px-12 py-4 rounded-full bg-pink-500 text-black font-bold uppercase hover:bg-pink-400 transition"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Overlay */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ${
            isSignUp ? "-translate-x-full" : ""
          }`}
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/736x/c7/ac/e7/c7ace746e5085ade3da61ad54c2ed4b0.jpg')",
          }}
        >
          <div
            className={`relative -left-full h-full w-[200%]  transition-transform duration-700 ${
              isSignUp ? "translate-x-1/2" : ""
            }`}
          >
            {/* Overlay Left */}
            <div
              className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center text-center px-16 text-white transition-transform duration-700 ${
                isSignUp ? "translate-x-0" : "-translate-x-[20%]"
              }`}
            >
              <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
              <p className="text-lg opacity-90 mb-10">
                To keep connected with us please login with your personal info
              </p>
              <button
                className="px-12 py-4 border-2 text-black border-white rounded-full font-bold uppercase hover:bg-white/10 transition"
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
            </div>

            {/* Overlay Right */}
            <div
              className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center text-center px-16 text-white transition-transform duration-700 ${
                isSignUp ? "translate-x-[20%]" : "translate-x-0"
              }`}
            >
              <h1 className="text-4xl font-bold mb-6">Hello, Buddy!</h1>
              <p className="text-lg opacity-90 mb-10">
                Enter your personal details and start journey with us
              </p>
              <button
                className="px-12 py-4 border-2 border-white text-black rounded-full font-bold uppercase hover:bg-white/10 transition"
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
