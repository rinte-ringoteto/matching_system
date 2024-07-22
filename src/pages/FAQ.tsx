import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { supabase } from '@/supabase';
import Topbar from '@/components/Topbar';

const FAQ = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([
    { id: 1, name: '使い方', questions: [] },
    { id: 2, name: '料金', questions: [] },
    { id: 3, name: 'トラブル対応', questions: [] },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('category');

      if (error) throw error;

      const updatedCategories = categories.map(category => ({
        ...category,
        questions: data.filter(q => q.category === category.name),
      }));

      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      // サンプルデータを表示
      const sampleData = [
        { id: 1, category: '使い方', question: 'サービスの利用方法は？', answer: 'まずは登録を行い、ニーズを入力してください。' },
        { id: 2, category: '料金', question: '料金体系について教えてください。', answer: '基本料金は無料です。サービス利用時に手数料がかかります。' },
        { id: 3, category: 'トラブル対応', question: 'マッチングがうまくいかない場合は？', answer: 'サポートチームにお問い合わせください。' },
      ];

      const updatedCategories = categories.map(category => ({
        ...category,
        questions: sampleData.filter(q => q.category === category.name),
      }));

      setCategories(updatedCategories);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">よくある質問</h1>
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="質問を検索..."
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div
                className="flex justify-between items-center p-4 cursor-pointer bg-blue-500 text-white"
                onClick={() => toggleCategory(category.id)}
              >
                <h2 className="text-xl font-semibold">{category.name}</h2>
                {expandedCategory === category.id ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {expandedCategory === category.id && (
                <div className="p-4 space-y-4">
                  {category.questions.map((q) => (
                    <div key={q.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h3 className="font-semibold text-lg mb-2">{q.question}</h3>
                      <p className="text-gray-600">{q.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">お探しの答えが見つかりませんでしたか？</p>
          <Link href="/Contact" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            お問い合わせ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;