import { useState } from "react";
import { Link } from "react-router-dom";

export default function Inbox() {
  const [tabValue, setTabValue] = useState<number>(0);
  return (
    <>
      <div className="grid grid-flow-row grid-cols-3 gap-4 p-5">
        {/* chatbox */}
        <div className="bg-slate-100 rounded-lg p-3">
          <div className="font-semibold border-gray-100 bg-slate-200 px-2 py-3 flex items-center justify-center rounded-xl hover:bg-slate-300 hover:cursor-pointer">
            Find or start a conversation
          </div>
          <hr className="border-t-1 border-gray-300 my-4" />
          <div className="flex flex-row items-center justify-between px-4">
            <p className="text-gray-400">Direct Messages</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6 text-gray-400 hover:cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-5">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <div className="mb-3 flex items-center gap-2">
                  <img
                    src="https://i.pinimg.com/1200x/38/5d/04/385d04a1f8bfb35ee0b44063520f1d3e.jpg"
                    className="rounded-full h-10 w-10 object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-bold">Phạm Gia Mỹ</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">
                        I will reply soon. Thanks for texting
                      </p>
                      <p className="text-sm">•</p>
                      <p className="text-sm">1 hour</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {/* online & friends */}
        <div>
          <div className="flex flex-row gap-4 items-center">
            <div className="font-semibold">Friends</div>•
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-gray-200 dark:border-gray-700 dark:text-gray-400">
              <li>
                <Link
                  to=""
                  onClick={() => setTabValue(0)}
                  aria-current="page"
                  className={`inline-block p-4 rounded-t-lg ${
                    tabValue === 0
                      ? "bg-gray-200 dark:bg-gray-800 dark:text-blue-500"
                      : ""
                  }`}
                >
                  Online
                </Link>
              </li>
              <li>
                <Link
                  to={""}
                  onClick={() => setTabValue(1)}
                  className={`inline-block p-4 rounded-t-lg ${
                    tabValue === 1
                      ? "bg-gray-200 dark:bg-gray-800 dark:text-blue-500"
                      : ""
                  }`}
                >
                  All
                </Link>
              </li>
            </ul>
            <button className="bg-[#725CAD] text-white px-3 py-2 rounded-lg hover:cursor-pointer hover:bg-[#0B1D51]">
              Add Friend
            </button>
          </div>
          <hr className="border-t-1 border-gray-300 my-4" />

          <form className="max-w-md mx-auto">
            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search"
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-[#725CAD]  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Search
              </button>
            </div>
          </form>

          {tabValue === 0 && <>Online</>}
          {tabValue === 1 && <>all</>}
        </div>
        {/* call history */}
        <div>
          <div>Call History</div>
          <hr className="border-t-1 border-gray-300 my-4" />
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div className="mb-3 flex items-center gap-2">
                <img
                  src="https://i.pinimg.com/1200x/38/5d/04/385d04a1f8bfb35ee0b44063520f1d3e.jpg"
                  className="rounded-full h-10 w-10 object-cover"
                />
                <div>
                  <h4 className="text-lg font-bold">Phạm Gia Mỹ</h4>
                  <div className="flex items-center gap-2">
                    <p>Missed audio call</p>
                    <p>•</p>
                    <p>1 hour</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
