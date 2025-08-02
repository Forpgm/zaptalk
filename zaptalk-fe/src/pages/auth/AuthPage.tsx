import { useState } from "react";
import LoginForm from "../../components/auth/LoginForm";
import RegisterForm from "../../components/auth/RegisterForm";

const AuthPage = () => {
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
          <RegisterForm />
        </div>

        {/* Sign In */}
        <div
          className={`absolute top-0 left-0 h-full w-1/2 flex items-center justify-center transition-all duration-700 ${
            isSignUp ? "translate-x-full opacity-0 z-10" : "opacity-100 z-20"
          }`}
        >
          <LoginForm />
        </div>

        {/* Overlay */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden bg-cover bg-center transition-all duration-700
    ${
      isSignUp
        ? "-translate-x-full rounded-tr-[10%] rounded-br-[10%]"
        : "rounded-tl-[10%] rounded-bl-[10%]"
    }
  `}
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/736x/c7/ac/e7/c7ace746e5085ade3da61ad54c2ed4b0.jpg')",
          }}
        >
          <div
            className={`relative -left-full h-full w-[200%] transition-transform duration-700 ${
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
                className="px-12 py-4 border-2 text-white border-white rounded-full font-bold uppercase hover:bg-white/10 transition"
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
                className="px-12 py-4 border-2 border-white text-white rounded-full font-bold uppercase hover:bg-white/10 transition"
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

export default AuthPage;
