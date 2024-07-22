import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaPaperPlane, FaPaperclip } from 'react-icons/fa';
import { supabase } from '@/supabase';
import Topbar from '@/components/Topbar';

const MessageScreen: React.FC = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Display sample data in case of error
      setMessages([
        { id: 1, sender_id: 'user1', content: 'Hello, how can I help you?', created_at: '2023-05-01T10:00:00Z' },
        { id: 2, sender_id: 'user2', content: 'I have a question about your services.', created_at: '2023-05-01T10:05:00Z' },
      ]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({ content: newMessage, sender_id: 'currentUserId' }) // Replace with actual user ID
        .select();

      if (error) throw error;
      setMessages([...messages, data[0]]);
      setNewMessage('');

      if (file) {
        // Handle file upload logic here
        console.log('File to upload:', file);
        setFile(null);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Messages</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="h-96 overflow-y-auto mb-4 border border-gray-200 rounded p-4">
            {messages.map((message) => (
              <div key={message.id} className={`mb-4 ${message.sender_id === 'currentUserId' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg ${message.sender_id === 'currentUserId' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {message.content}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(message.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow mr-2 p-2 border border-gray-300 rounded"
              placeholder="Type your message..."
            />
            <label htmlFor="file-upload" className="cursor-pointer mr-2">
              <FaPaperclip className="text-gray-500 hover:text-gray-700" />
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageScreen;