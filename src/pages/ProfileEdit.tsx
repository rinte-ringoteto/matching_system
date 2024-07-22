import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '@/supabase';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Topbar from '@/components/Topbar';

const ProfileEdit = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contact: '',
    needs: {}
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('customer_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // サンプルデータを表示
      setProfile({
        name: 'John Doe',
        email: 'johndoe@example.com',
        contact: '090-1234-5678',
        needs: { service: '家事代行', area: '東京都', budget: '10000' }
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'needs' ? JSON.parse(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('customer_profiles')
        .update(profile)
        .eq('user_id', profile.user_id);

      if (error) throw error;
      alert('プロフィールが更新されました');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('プロフィールの更新に失敗しました');
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#336699]">プロフィール編集</h1>
        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                <FaUser className="inline mr-2" />
                名前
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                <FaEnvelope className="inline mr-2" />
                メールアドレス
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact">
                <FaPhone className="inline mr-2" />
                連絡先
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="contact"
                type="text"
                name="contact"
                value={profile.contact}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="needs">
                <FaMapMarkerAlt className="inline mr-2" />
                ニーズ
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="needs"
                name="needs"
                value={JSON.stringify(profile.needs)}
                onChange={handleChange}
                rows="3"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-[#336699] hover:bg-[#264d73] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                更新
              </button>
              <Link href="/Home" className="inline-block align-baseline font-bold text-sm text-[#336699] hover:text-[#264d73]">
                キャンセル
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;