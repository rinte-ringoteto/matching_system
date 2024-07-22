import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaHeart, FaArrowLeft } from 'react-icons/fa';
import { supabase } from '@/supabase';
import Topbar from '@/components/Topbar';

const FavoriteConfirmation = () => {
  const router = useRouter();
  const [businessProfile, setBusinessProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('business_profiles')
          .select('*')
          .single();

        if (error) throw error;

        setBusinessProfile(data);
      } catch (error) {
        console.error('Error fetching business profile:', error);
        setError('Failed to load business profile');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, []);

  const handleConfirmFavorite = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert([
          { 
            customer_id: 'sample-customer-id', // Replace with actual customer ID
            business_id: businessProfile.id 
          }
        ]);

      if (error) throw error;

      router.push('/FavoritesList');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      setError('Failed to add to favorites');
    }
  };

  if (loading) return <div className="min-h-screen h-full flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen h-full flex items-center justify-center">Error: {error}</div>;

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <Link href="/BusinessDetail" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <FaArrowLeft className="mr-2" /> Back to Business Detail
        </Link>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Confirm Favorite</h1>
          {businessProfile && (
            <div className="mb-6">
              <img
                src="https://placehold.co/400x200"
                alt={businessProfile.company_name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold">{businessProfile.company_name}</h2>
              <p className="text-gray-600 mt-2">
                Services: {businessProfile.services && JSON.stringify(businessProfile.services)}
              </p>
              <p className="text-gray-600">
                Service Areas: {businessProfile.service_areas && businessProfile.service_areas.join(', ')}
              </p>
            </div>
          )}
          <p className="mb-6">Are you sure you want to add this business to your favorites?</p>
          <div className="flex justify-between">
            <button
              onClick={() => router.back()}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmFavorite}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <FaHeart className="mr-2" /> Add to Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteConfirmation;