import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { supabase } from '@/supabase';
import Topbar from '@/components/Topbar';

const UsageHistory: React.FC = () => {
  const [usageHistory, setUsageHistory] = useState<any[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUsageHistory();
  }, []);

  const fetchUsageHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          amount,
          status,
          created_at,
          matches (
            customer_profiles (name),
            business_profiles (company_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsageHistory(data || []);
      setFilteredHistory(data || []);
    } catch (error) {
      console.error('Error fetching usage history:', error);
      // サンプルデータを表示
      const sampleData = [
        {
          id: '1',
          amount: 5000,
          status: 'completed',
          created_at: '2023-05-01T10:00:00',
          matches: {
            customer_profiles: { name: '山田太郎' },
            business_profiles: { company_name: '株式会社A' }
          }
        },
        {
          id: '2',
          amount: 7500,
          status: 'completed',
          created_at: '2023-05-05T14:30:00',
          matches: {
            customer_profiles: { name: '山田太郎' },
            business_profiles: { company_name: '株式会社B' }
          }
        }
      ];
      setUsageHistory(sampleData);
      setFilteredHistory(sampleData);
    }
  };

  const handleDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value);
    filterHistory(e.target.value, searchTerm);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    filterHistory(dateFilter, e.target.value);
  };

  const filterHistory = (date: string, search: string) => {
    let filtered = usageHistory;
    if (date) {
      filtered = filtered.filter(item => item.created_at.startsWith(date));
    }
    if (search) {
      filtered = filtered.filter(item =>
        item.matches.business_profiles.company_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredHistory(filtered);
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">利用履歴</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap mb-4">
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date-filter">
                日付でフィルター
              </label>
              <div className="relative">
                <input
                  id="date-filter"
                  type="date"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={dateFilter}
                  onChange={handleDateFilter}
                />
                <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="w-full md:w-1/2 md:pl-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="search">
                サービス名で検索
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="サービス名を入力"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <FaSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">日付</th>
                  <th className="py-3 px-6 text-left">サービス名</th>
                  <th className="py-3 px-6 text-left">金額</th>
                  <th className="py-3 px-6 text-left">ステータス</th>
                  <th className="py-3 px-6 text-center">詳細</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {item.matches.business_profiles.company_name}
                    </td>
                    <td className="py-3 px-6 text-left">
                      ¥{item.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className={`py-1 px-3 rounded-full text-xs ${
                        item.status === 'completed' ? 'bg-green-200 text-green-600' : 'bg-yellow-200 text-yellow-600'
                      }`}>
                        {item.status === 'completed' ? '完了' : '処理中'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <Link href={`/ServiceCompletion?id=${item.id}`} className="text-blue-600 hover:text-blue-800">
                        詳細を見る
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageHistory;