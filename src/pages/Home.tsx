import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '@/supabase';
import Topbar from '@/components/Topbar';
import { FaUser, FaBell, FaHistory } from 'react-icons/fa';

const Home: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchUserData();
    fetchRecentActivity();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('*, customer_profiles(*)')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
      } else {
        setUser(data);
      }
    } else {
      // router.push('/Login');
    }
  };

  const fetchRecentActivity = async () => {
    const { data, error } = await supabase
      .from('matches')
      .select('*, business_profiles(*)')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching recent activity:', error);
    } else {
      setRecentActivity(data);
    }
  };

  // if (!user) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">ユーザー情報サマリー</h2>
              <div className="flex items-center mb-4">
                <img
                  src="https://via.placeholder.com/100"
                  alt="User Avatar"
                  className="w-20 h-20 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold">{user?.customer_profiles?.name || 'ゲスト'}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
              <Link href="/ProfileEdit" className="text-blue-600 hover:underline">
                プロフィールを編集
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">最近のアクティビティ</h2>
              {recentActivity.map((activity, index) => (
                <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                  <p className="font-semibold">{activity.business_profiles.company_name}とマッチング</p>
                  <p className="text-sm text-gray-600">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">機能ナビゲーション</h2>
              <nav>
                <ul className="space-y-2">
                  <li>
                    <Link href="/NeedsInput" className="flex items-center text-blue-600 hover:underline">
                      <FaUser className="mr-2" /> ニーズを入力する
                    </Link>
                  </li>
                  <li>
                    <Link href="/MessageScreen" className="flex items-center text-blue-600 hover:underline">
                      <FaBell className="mr-2" /> メッセージを確認する
                    </Link>
                  </li>
                  <li>
                    <Link href="/UsageHistory" className="flex items-center text-blue-600 hover:underline">
                      <FaHistory className="mr-2" /> 利用履歴を見る
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">おすすめサービス</h2>
              <Link href="/RecommendedServices" className="text-blue-600 hover:underline">
                おすすめサービスを見る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;