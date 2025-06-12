interface AuthorProps {
  avatar: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function AuthorCard({ avatar, name, role, createdAt }: AuthorProps) {
  return (
    <div className="flex items-center mt-6 px-4 py-2 bg-white rounded-xl shadow border border-gray-100">
      <img
        src={avatar}
        alt={name}
        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 mr-4"
      />
      <div>
        <div className="text-gray-500 text-sm">만든 이</div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">{name}</span>
          <span className="text-xs bg-gray-100 text-gray-700 rounded-md px-2 py-1 border border-gray-200">{role}</span>
        </div>
        <div className="text-xs text-gray-400">{createdAt}</div>
      </div>
    </div>
  );
}
