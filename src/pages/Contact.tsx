import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiSend } from 'react-icons/fi';
import { supabase } from '@/supabase';
import { Topbar } from '@/components/Topbar';

const Contact: React.FC = () => {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/Login');
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('support_tickets')
        .insert([
          { user_id: user.id, subject: title, content, status: 'open' }
        ]);

      if (error) throw error;

      alert('問い合わせが送信されました');
      setCategory('');
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      alert('問い合わせの送信に失敗しました。後でもう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">問い合わせフォーム</h1>
        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
                カテゴリ
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">選択してください</option>
                <option value="general">一般的な質問</option>
                <option value="technical">技術的な問題</option>
                <option value="billing">請求に関する質問</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                タイトル
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="content" className="block text-gray-700 font-bold mb-2">
                内容
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              >
                <FiSend className="mr-2" />
                {isSubmitting ? '送信中...' : '送信'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;