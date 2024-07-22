import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '@/supabase';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import Topbar from '@/components/Topbar';

const MatchingResults: React.FC = () => {
  const [matchedBusinesses, setMatchedBusinesses] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchMatchedBusinesses();
  }, []);

  const fetchMatchedBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          business_profiles:business_id (
            id,
            company_name,
            services,
            service_areas
          )
        `)
        .eq('customer_id', 'current_user_id') // Replace with actual user ID
        .eq('status', 'pending');

      if (error) throw error;

      setMatchedBusinesses(data?.map(match => match.business_profiles) || []);
    } catch (error) {
      console.error('Error fetching matched businesses:', error);
      // Display sample data in case of error
      setMatchedBusinesses([
        {
          id: '1',
          company_name: 'ABC Home Services',
          services: { cleaning: true, gardening: true },
          service_areas: ['Tokyo', 'Yokohama']
        },
        {
          id: '2',
          company_name: 'XYZ Repairs',
          services: { plumbing: true, electrical: true },
          service_areas: ['Osaka', 'Kyoto']
        }
      ]);
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">マッチング結果</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchedBusinesses.map((business) => (
            <div key={business.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={`https://placehold.co/600x400?text=${business.company_name}`}
                alt={business.company_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{business.company_name}</h2>
                <div className="flex items-center mb-2">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-gray-600">4.5 (50 レビュー)</span>
                </div>
                <div className="flex items-center mb-3">
                  <FaMapMarkerAlt className="text-red-500 mr-1" />
                  <span className="text-gray-600">{business.service_areas.join(', ')}</span>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-1">提供サービス:</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {Object.keys(business.services).map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>
                </div>
                <Link href={`/BusinessDetail?id=${business.id}`} className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                  詳細を見る
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchingResults;