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

type Props = {
  channelId: string;
};

export default function ChatWindow({ channelId }: Props) {
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const [loading, setLoading] = useState(true);
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
              <div className="bg-white border-b border-gray-200 px-4 py-3">
                <h3 className="text-lg font-semibold">
                  {(channel.data as any)?.name || `Chat ${channelId}`}
                </h3>
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
