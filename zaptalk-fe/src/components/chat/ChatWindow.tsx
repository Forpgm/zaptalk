import { useEffect, useState } from "react";
import { StreamChat, type Channel as StreamChannel } from "stream-chat";
import {
  Chat,
  Channel,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { useAuthStore, type AuthState } from "@/utils/store";
import { useShallow } from "zustand/react/shallow";
import { useMutation } from "@tanstack/react-query";
import type { DeleteChatHistoryRequestBody } from "@/types/chat.type";
import chatApi from "@/apis/chat.api";
import { toast } from "react-toastify";

type Props = {
  channelId: string;
};

export default function ChatWindow({ channelId }: Props) {
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const [loading, setLoading] = useState(true);
  const [openTooltip, setOpenTooltip] = useState<boolean>(false);
  const { profile, stream_token } = useAuthStore(
    useShallow((state: AuthState) => ({
      stream_token: state.stream_token,
      profile: state.profile,
    }))
  );

  useEffect(() => {
    if (!channelId || !stream_token || !profile) return;

    const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
    const initChannel = async () => {
      try {
        if (!client.userID) {
          await client.connectUser(
            {
              id: profile.id,
              name: profile.first_name,
            },
            stream_token
          );
        }

        const channel = client.channel("messaging", channelId);
        await channel.watch();

        setChannel(channel);
        setLoading(false);
      } catch (error) {
        console.error("Error initializing channel:", error);
        setLoading(false);
      }
    };

    initChannel();

    return () => {
      if (channel) {
        channel.stopWatching();
      }
    };
  }, [channelId, stream_token, profile]);

  const deleteChatHistoryMutation = useMutation({
    mutationFn: (body: DeleteChatHistoryRequestBody) =>
      chatApi.deleteChatHistory(body),
  });

  async function handleDeleteChatHistory(channelId: string) {
    if (!channel) return;
    await deleteChatHistoryMutation.mutateAsync(
      { channelId },
      {
        onSuccess: async () => {
          toast.success("Chat history deleted successfully", {
            position: "top-center",
          });
          channel.stopWatching();
          setChannel(null);
        },
      }
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-gray-500">Channel not found</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <Chat
        client={StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY)}
      >
        <Channel channel={channel}>
          <Window>
            <div className="flex flex-col h-full w-full">
              <div className="relative flex justify-between items-center bg-white border-b border-gray-200 px-4 py-3">
                <h3 className="text-lg font-semibold">
                  {(channel.data as any)?.name || `Chat ${channelId}`}
                </h3>
                <div
                  className="hover:opacity-70 hover:cursor-pointer relative"
                  onClick={() => setOpenTooltip(!openTooltip)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                    />
                  </svg>
                </div>
                {openTooltip && (
                  <div
                    onClick={() => handleDeleteChatHistory(channelId)}
                    className="absolute right-0 top-full mt-2 z-10 px-3 py-2 text-sm font-medium text-black bg-slate-200 rounded-lg shadow-lg hover:cursor-pointer hover:bg-slate-200/80"
                  >
                    Delete Chat History
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-hidden w-full">
                <MessageList />
              </div>

              <div className="border-t border-gray-200 w-full">
                <MessageInput />
              </div>
            </div>
          </Window>
        </Channel>
      </Chat>
    </div>
  );
}
