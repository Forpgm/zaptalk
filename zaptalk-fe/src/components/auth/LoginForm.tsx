export default function LoginForm() {
  return (
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
  );
}
