// App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Sidebar } from "./components/Sidebar";

function App() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('gemini_chat');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false); // 👈 mobile sidebar state

  useEffect(() => {
    localStorage.setItem('gemini_chat', JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = { sender: 'user', text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/generate`, {
        prompt,
        model: 'gemini-2.0-flash',
      });

      const aiMessage = {
        sender: 'gemini',
        text: res.data.response,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'gemini', text: 'Something went wrong.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto">
      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gray-100">
        <h1 className="text-xl font-bold">T<span className='text-base'>A</span>M Ai</h1>
        <button
          className="text-2xl"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          ☰
        </button>
      </div>

      <div className="flex h-[90vh] md:h-screen">
        {/* Sidebar */}
        <div className={`fixed md:relative top-0 left-0 h-full bg-gray-100 z-10 md:z-0 transition-transform duration-300 md:translate-x-0 ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:w-1/5`}>
          <Sidebar setMessages={setMessages} />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Optional: hide heading in mobile (already in header) */}
          <h1 className="text-2xl font-bold my-4 p-3 hidden md:block">T<span className='text-base'>A</span>M Ai</h1>

          <div className="p-4 h-96 overflow-y-auto bg-white grow">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-2 rounded w-full ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <strong>{msg.sender === 'user' ? 'You' : 'Tamil'}:</strong>
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 text-gray-700">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc ml-6 mb-2">{children}</ul>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      code: ({ children }) => <code className=" px-1 rounded text-sm">{children}</code>,
                      pre: ({ children }) => <pre className="bg-gray-800 text-white p-2 rounded overflow-x-auto text-sm">{children}</pre>,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && <p className="text-gray-500 italic">Just a sec...</p>}
          </div>

          <form onSubmit={handleSubmit} className="my-4 flex space-x-2 mx-4">
            <input
              type="text"
              className="flex-1 border rounded p-2"
              placeholder="Ask something..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
