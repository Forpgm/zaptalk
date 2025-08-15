type Props = {
  channelId: string;
};

export default function ChatWindow({ channelId }: Props) {
  return (
    <>
      <p>{channelId}</p>
    </>
  );
}
