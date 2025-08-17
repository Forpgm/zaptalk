import { useEffect, useState } from "react";
import { useAuthStore, type AuthState } from "../utils/store";
import { StreamChat } from "stream-chat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useShallow } from "zustand/react/shallow";
import userApi from "@/apis/users.api";
import { useMutation } from "@tanstack/react-query";
import type { User } from "@/types/user.type";
import notfound from "../assets/notfound.svg";
import Friends from "@/components/chat/Friends";
import { ChatList } from "@/components/chat/ChatList";
import ChatWindow from "@/components/chat/ChatWindow";

export default function Inbox() {
  const userId = useAuthStore((state) => state.profile?.id);
  const { name, stream_token } = useAuthStore(
    useShallow((state: AuthState) => ({
      name: state.profile?.first_name,
      stream_token: state.stream_token,
    }))
  );
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openSearchModal, setOpenSearchModal] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[] | []>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

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
    },
  });

  const handleSearch = (searchValue: string) => {
    searchUserMutation.mutate(searchValue);
  };

  return (
    <div>
      <div
        className={`${selectedChat ? "flex" : "grid grid-flow-row grid-cols-3 gap-4"} p-5 h-screen overflow-hidden`}
      >
        {/* chatbox - sidebar when chat is selected */}
        <div
          className={`${selectedChat ? "w-80 flex-shrink-0" : "col-span-1"} bg-slate-100 rounded-lg p-3 h-full flex flex-col overflow-auto`}
        >
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
            <ChatList
              client={chatClient!}
              onChannelSelected={(id) => setSelectedChat(id)}
            />
          </div>
        </div>

        {/* Chat window - full width when selected */}
        {selectedChat ? (
          <div className="flex-1 ml-4">
            <ChatWindow channelId={selectedChat} />
          </div>
        ) : (
          <>
            {/* friend list */}
            <Friends />
          </>
        )}
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
                onKeyDown={() => {
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
    </div>
  );
}
