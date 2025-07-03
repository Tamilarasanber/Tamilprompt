// Sidebar.jsx
export const Sidebar = ({ setMessages }) => {
  return (
    <div className="p-4 overflow-y-auto h-full w-64 md:w-full">
      <h2 className="text-xl font-bold mb-4">Recent</h2>
      <button
        onClick={() => {
          setMessages([]);
          localStorage.removeItem('gemini_chat');
        }}
        className="p-2 bg-blue-100 mb-2 cursor-pointer rounded"
      >
        🆕 New Chat
      </button>
    </div>
  );
};
