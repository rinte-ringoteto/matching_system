import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaTrash } from 'react-icons/fa';
import { supabase } from '@/supabase';
import { Topbar } from '@/components/Topbar';

const FavoritesList: React.FC = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          business_profiles:business_id (
            id,
            company_name,
            services
          )
        `)
        .eq('customer_id', 'current_user_id'); // Replace with actual user ID

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      // Use sample data if API request fails
      setFavorites([
        { id: '1', business_profiles: { id: 'b1', company_name: 'Sample Company 1', services: { description: 'Sample Service 1' } } },
        { id: '2', business_profiles: { id: 'b2', company_name: 'Sample Company 2', services: { description: 'Sample Service 2' } } },
      ]);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;
      fetchFavorites(); // Refresh the list
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">お気に入り一覧</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image
                src={`https://placehold.co/300x200?text=${favorite.business_profiles.company_name}`}
                alt={favorite.business_profiles.company_name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{favorite.business_profiles.company_name}</h2>
                <p className="text-gray-600 mb-4">{favorite.business_profiles.services.description}</p>
                <div className="flex justify-between items-center">
                  <Link href={`/BusinessDetail?id=${favorite.business_profiles.id}`} className="text-blue-600 hover:underline">
                    詳細を見る
                  </Link>
                  <button
                    onClick={() => removeFavorite(favorite.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="お気に入りから削除"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FavoritesList;