import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '@/supabase';
import { FaFilter, FaReply } from 'react-icons/fa';
import Topbar from '@/components/Topbar';

const SupportResponse: React.FC = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    try {
      let query = supabase.from('support_tickets').select('*');
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }
      const { data, error } = await query;
      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      // Display sample data
      setTickets([
        { id: 1, subject: 'サービスについての質問', content: '利用方法がわかりません', status: 'open', created_at: '2023-05-01' },
        { id: 2, subject: '支払いの問題', content: '請求書が届きません', status: 'closed', created_at: '2023-05-02' },
      ]);
    }
  };

  const handleReply = async () => {
    if (!selectedTicket || !reply) return;
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: 'closed' })
        .eq('id', selectedTicket.id);
      if (error) throw error;
      setSelectedTicket(null);
      setReply('');
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">サポート対応画面</h1>
        <div className="flex mb-4">
          <select
            className="p-2 border rounded-md mr-4"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">全て</option>
            <option value="open">未対応</option>
            <option value="closed">対応済み</option>
          </select>
          <FaFilter className="text-2xl text-blue-600 self-center" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">問い合わせ一覧</h2>
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border-b py-3 cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedTicket(ticket)}
              >
                <h3 className="font-medium">{ticket.subject}</h3>
                <p className="text-sm text-gray-600">{ticket.content.substring(0, 50)}...</p>
                <span className={`text-xs ${ticket.status === 'open' ? 'text-red-500' : 'text-green-500'}`}>
                  {ticket.status === 'open' ? '未対応' : '対応済み'}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">返信フォーム</h2>
            {selectedTicket ? (
              <>
                <div className="mb-4">
                  <h3 className="font-medium">{selectedTicket.subject}</h3>
                  <p className="text-sm text-gray-600">{selectedTicket.content}</p>
                </div>
                <textarea
                  className="w-full p-2 border rounded-md mb-4"
                  rows={5}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="返信を入力してください"
                />
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                  onClick={handleReply}
                >
                  <FaReply className="mr-2" />
                  返信する
                </button>
              </>
            ) : (
              <p>問い合わせを選択してください</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportResponse;