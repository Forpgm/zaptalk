import { useAuthStore, type AuthState } from "@/utils/store";
import { useShallow } from "zustand/react/shallow";

export default function ProfileModal() {
  const { profile } = useAuthStore(
    useShallow((state: AuthState) => ({
      profile: state.profile,
    }))
  );

  return (
    <div className="bg-white rounded-lg p-4 border shadow-lg z-50 absolute bottom-20 w-[300px]">
      {/* Header background + avatar */}
      <div className="relative mb-12">
        <div className="bg-green-200 w-full h-20 rounded-lg" />
        <img
          src={profile!.avatar_url}
          alt="avatar"
          className="absolute left-14 -bottom-10 transform -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white object-cover shadow-md"
        />
      </div>

      {/* Username */}
      <div className="text-center font-semibold text-gray-800">
        {profile?.username}
      </div>

      {/* Action list */}
      <div className="bg-slate-100 p-2 rounded-lg mt-4">
        <div className="flex flex-row items-center gap-2 hover:cursor-pointer hover:bg-slate-200 rounded-md p-2 transition-colors duration-200">
          <div className="bg-green-500 w-2 h-2 rounded-full" />
          <p>Edit Profile</p>
        </div>

        <hr className="border-t border-gray-300 my-2" />

        <div className="flex flex-row items-center gap-2 hover:cursor-pointer hover:bg-slate-200 rounded-md p-2 transition-colors duration-200">
          <div className="bg-green-500 w-2 h-2 rounded-full" />
          <p>Online</p>
        </div>
      </div>
    </div>
  );
}
