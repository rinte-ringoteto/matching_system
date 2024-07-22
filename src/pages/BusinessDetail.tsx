import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaStar, FaHeart, FaEnvelope } from 'react-icons/fa';
import { supabase } from '@/supabase';
import Topbar from '@/components/Topbar';

const BusinessDetail = () => {
  const [businessProfile, setBusinessProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchBusinessProfile();
      fetchReviews();
      checkFavoriteStatus();
    }
  }, [id]);

  const fetchBusinessProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setBusinessProfile(data);
    } catch (error) {
      console.error('Error fetching business profile:', error);
      // サンプルデータを設定
      setBusinessProfile({
        company_name: 'サンプル株式会社',
        services: { main: '清掃サービス', sub: '庭園管理' },
        service_areas: ['東京', '神奈川', '千葉'],
      });
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('business_id', id);

      if (error) throw error;
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // サンプルレビューデータを設定
      setReviews([
        { id: 1, rating: 5, content: '素晴らしいサービスでした！' },
        { id: 2, rating: 4, content: '丁寧な対応に感謝します。' },
      ]);
    }
  };

  const checkFavoriteStatus = async () => {
    // TODO: 実際のユーザーIDを使用する
    const userId = 'sample-user-id';
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('customer_id', userId)
        .eq('business_id', id);

      if (error) throw error;
      setIsFavorite(data.length > 0);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    // TODO: 実際のユーザーIDを使用する
    const userId = 'sample-user-id';
    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('customer_id', userId)
          .eq('business_id', id);
      } else {
        await supabase
          .from('favorites')
          .insert({ customer_id: userId, business_id: id });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (!businessProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{businessProfile.company_name}</h1>
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-full ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              <FaHeart />
            </button>
          </div>
          <img
            src="https://placehold.co/600x400"
            alt={businessProfile.company_name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">提供サービス</h2>
          <ul className="list-disc list-inside mb-4">
            {Object.entries(businessProfile.services).map(([key, value]) => (
              <li key={key} className="text-gray-700">{value}</li>
            ))}
          </ul>
          <h2 className="text-xl font-semibold mb-2">対応エリア</h2>
          <p className="text-gray-700 mb-4">{businessProfile.service_areas.join(', ')}</p>
          <div className="flex justify-between">
            <Link href="/MessageScreen" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              <FaEnvelope className="inline mr-2" />
              問い合わせる
            </Link>
            <Link href="/ServiceReservation" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
              サービスを予約
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">レビュー・評価</h2>
          {reviews.map((review) => (
            <div key={review.id} className="mb-4 border-b pb-4">
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <p className="text-gray-700">{review.content}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BusinessDetail;