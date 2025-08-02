export default function LoginForm() {
  return (
    <form className="flex flex-col items-center justify-center text-center px-12 w-3/4">
      <h1
        className="text-5xl font-bold mb-6 text-[#69247C]"
        style={{ fontFamily: "Caprasimo" }}
      >
        Sign In
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
        className="px-12 py-2 w-full border rounded-full  text-[#69247C] font-semibold uppercasetransition"
      >
        Submit
      </button>
    </form>
  );
}
