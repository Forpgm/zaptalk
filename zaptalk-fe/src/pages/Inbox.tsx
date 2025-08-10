import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore, type AuthState } from "../utils/store";
import { StreamChat } from "stream-chat";
import { ChatWindow } from "../components/chat/ChatWindow";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useShallow } from "zustand/react/shallow";
import { toast } from "react-toastify";
import userApi from "@/apis/users.api";
import { useMutation } from "@tanstack/react-query";
import type { User } from "@/types/user.type";
import notfound from "../assets/notfound.svg";

export default function Inbox() {
  const [tabValue, setTabValue] = useState<number>(0);
  const userId = useAuthStore((state) => state.profile?.id);
  const { name, stream_token } = useAuthStore(
    useShallow((state: AuthState) => ({
      name: state.profile?.first_name,
      stream_token: state.stream_token,
    }))
  );
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSearchModal, setOpenSearchModal] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[] | []>([]);

  useEffect(() => {
    const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);

    async function init() {
      await client.connectUser(
        {
          id: userId!,
          name,
        },
        stream_token
      );

      setChatClient(client);
      setLoading(false);
    }

    init();

    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, [chatClient, name, stream_token, userId]);

  const searchUserMutation = useMutation({
    mutationFn: userApi.searchUsers,
    onSuccess: (data) => {
      setSearchResults(data.data.data);
      console.log(data.data);
    },
  });

  const handleSearch = (searchValue: string) => {
    searchUserMutation.mutate(searchValue);
  };

  return (
    <>
      <div className="grid grid-flow-row grid-cols-3 gap-4 p-5 h-screen overflow-hidden">
        {/* chatbox */}
        <div className="bg-slate-100 rounded-lg p-3 h-full flex flex-col overflow-auto">
          {/* searchbox */}
          <div>
            <div
              onClick={() => setOpenSearchModal(true)}
              className="font-semibold border-gray-100 bg-slate-200 px-2 py-3 flex items-center justify-center rounded-xl hover:bg-slate-300 hover:cursor-pointer"
            >
              Find or start a conversation
            </div>
            <hr className="border-t-1 border-gray-300 my-4" />
            <div className="flex flex-row items-center justify-between px-4">
              <p className="text-gray-400">Direct Messages</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 text-gray-400 hover:cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </div>
          </div>

          {/* Chat list scrollable */}
          <div className="flex-1 mt-2 overflow-y-scroll">
            <ChatWindow client={chatClient!} />
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
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
              <div key={index} className="mb-3 flex items-center gap-2">
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
      <Dialog
        open={openSearchModal}
        onOpenChange={() => setOpenSearchModal(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="py-4">
              <input
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  handleSearch(searchValue);
                }}
                className="w-full border bg-slate-100 px-2 py-4 rounded-md text-slate-500"
                placeholder="Who would you like to chat with?"
              />
            </DialogTitle>
            <DialogDescription className="mb-4">mentions</DialogDescription>
            {searchResults.length > 0 ? (
              <div>
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-row items-center justify-between px-3 py-1 rounded-lg transition-colors duration-200 hover:bg-slate-200 cursor-pointer"
                  >
                    <div className="text-slate-500">
                      {user.last_name} {user.first_name}
                    </div>
                    <div className="text-slate-500">@{user.username}</div>
                  </div>
                ))}
              </div>
            ) : (
              <img
                src={notfound}
                alt="No results found"
                className="flex self-center w-[50%] aspect-square object-cover rounded-lg"
              />
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
