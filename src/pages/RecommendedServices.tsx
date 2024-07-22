import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { FaStar, FaHeart } from 'react-icons/fa';
import { supabase } from '@/supabase';
import axios from 'axios';
import Topbar from '@/components/Topbar';

interface Service {
  id: string;
  name: string;
  description: string;
  rating: number;
  price: number;
  imageUrl: string;
}

const RecommendedServices: NextPage = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchRecommendedServices = async () => {
      try {
        const { data, error } = await supabase
          .from('business_profiles')
          .select('id, company_name, services')
          .limit(10);

        if (error) throw error;

        const formattedServices = data.map((item) => ({
          id: item.id,
          name: item.company_name,
          description: item.services.description || 'No description available',
          rating: Math.random() * 5,
          price: Math.floor(Math.random() * 10000),
          imageUrl: `https://placehold.co/300x200?text=${encodeURIComponent(item.company_name)}`,
        }));

        setServices(formattedServices);
      } catch (error) {
        console.error('Error fetching recommended services:', error);
        // Fallback to sample data
        setServices([
          {
            id: '1',
            name: 'Home Cleaning Service',
            description: 'Professional home cleaning service',
            rating: 4.5,
            price: 5000,
            imageUrl: 'https://placehold.co/300x200?text=Home+Cleaning',
          },
          {
            id: '2',
            name: 'Gardening Service',
            description: 'Expert gardening and landscaping',
            rating: 4.2,
            price: 7000,
            imageUrl: 'https://placehold.co/300x200?text=Gardening',
          },
          // Add more sample services as needed
        ]);
      }
    };

    fetchRecommendedServices();
  }, []);

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Recommended Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={service.imageUrl} alt={service.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h2>
                <p className="text-gray-600 mb-2">{service.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-gray-700">{service.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-700 font-semibold">¥{service.price.toLocaleString()}</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <Link href={`/BusinessDetail?id=${service.id}`} className="text-blue-600 hover:underline">
                    View Details
                  </Link>
                  <button className="text-red-500 hover:text-red-600">
                    <FaHeart />
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

export default RecommendedServices;