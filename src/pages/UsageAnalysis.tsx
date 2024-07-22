import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BiFilter, BiRefresh } from 'react-icons/bi';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Topbar } from '@/components/Topbar';
import { supabase } from '@/supabase';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const UsageAnalysis: NextPage = () => {
  const router = useRouter();
  const [usageData, setUsageData] = useState<any>(null);
  const [filterParams, setFilterParams] = useState({
    startDate: '',
    endDate: '',
    region: '',
  });

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsageData(data);
    } catch (error) {
      console.error('Error fetching usage data:', error);
      // サンプルデータを表示
      setUsageData([
        { id: 1, customer_id: 'cust1', business_id: 'bus1', status: 'completed', created_at: '2023-05-01' },
        { id: 2, customer_id: 'cust2', business_id: 'bus2', status: 'pending', created_at: '2023-05-02' },
        { id: 3, customer_id: 'cust3', business_id: 'bus3', status: 'completed', created_at: '2023-05-03' },
      ]);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilterParams({ ...filterParams, [e.target.name]: e.target.value });
  };

  const applyFilter = () => {
    // フィルター適用のロジックを実装
    console.log('Applying filter:', filterParams);
  };

  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'マッチング数',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const barChartData = {
    labels: ['東京', '大阪', '名古屋', '福岡', '札幌'],
    datasets: [
      {
        label: '地域別利用数',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const pieChartData = {
    labels: ['完了', '進行中', '保留'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">利用状況分析</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">フィルター</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="date"
              name="startDate"
              value={filterParams.startDate}
              onChange={handleFilterChange}
              className="border rounded px-3 py-2"
            />
            <input
              type="date"
              name="endDate"
              value={filterParams.endDate}
              onChange={handleFilterChange}
              className="border rounded px-3 py-2"
            />
            <select
              name="region"
              value={filterParams.region}
              onChange={handleFilterChange}
              className="border rounded px-3 py-2"
            >
              <option value="">全ての地域</option>
              <option value="tokyo">東京</option>
              <option value="osaka">大阪</option>
              <option value="nagoya">名古屋</option>
            </select>
            <button
              onClick={applyFilter}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              <BiFilter className="inline mr-2" />
              フィルター適用
            </button>
            <button
              onClick={fetchUsageData}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
            >
              <BiRefresh className="inline mr-2" />
              リセット
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">マッチング数の推移</h2>
            <Line data={lineChartData} />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">地域別利用状況</h2>
            <Bar data={barChartData} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">マッチングステータス</h2>
            <Pie data={pieChartData} />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">最新のマッチングデータ</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">顧客ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">事業者ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usageData && usageData.slice(0, 5).map((match: any) => (
                    <tr key={match.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{match.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{match.customer_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{match.business_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{match.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(match.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/AdminDashboard" className="inline-block bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition duration-300">
            管理ダッシュボードに戻る
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UsageAnalysis;