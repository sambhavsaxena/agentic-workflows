import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Send, Loader2, LogOut } from "lucide-react";
import axios from "axios";

interface Message {
  content: string;
  owner: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = localStorage.getItem("userEmail");
  if (!email) {
    navigate("/");
  }

  const logout = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newMessage.trim()) return;

    const newUserMessage: Message = { content: newMessage, owner: "user" };
    setMessages([...messages, newUserMessage]);
    setNewMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/chat", {
        email,
        prompt: newMessage,
      });

      if (response.status !== 200) {
        const errorMessage =
          response.data.error || `Server returned ${response.status} error.`;
        throw new Error(errorMessage);
      }

      const aiMessage: Message = {
        content: response.data.response,
        owner: "ai",
      };
      setMessages([...messages, newUserMessage, aiMessage]);
    } catch (error: unknown) {
      console.error("Error sending message:", error);

      let errorMessage = "An error occurred. Please try again.";
      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.error || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <header className="bg-gray-800 px-6 py-4 shadow">
        <div className="flex items-center">
          <MessageSquare className="h-6 w-6 text-emerald-500" />
          <h1 className="ml-2 text-xl font-bold text-white">AgentX Chat</h1>
          <LogOut
            onClick={logout}
            className="h-6 w-6 text-emerald-500 mx-5 cursor-pointer"
          />{" "}
          {/* Added cursor-pointer */}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.owner === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.owner === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              <p>{message.content}</p> {/* Use message.content */}
            </div>
          </div>
        ))}
        {error && <p className="text-red-500">{error}</p>}
        {loading && (
          <div className="flex justify-center mt-4">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-700 bg-gray-800 p-4"
      >
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-600"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
