import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaStar, FaThumbsUp } from 'react-icons/fa';
import { supabase } from '@/supabase';
import Topbar from '@/components/Topbar';

const ServiceCompletion = () => {
    const router = useRouter();
    const [completedService, setCompletedService] = useState(null);
    const [recommendedServices, setRecommendedServices] = useState([]);

    useEffect(() => {
        const fetchCompletedService = async () => {
            try {
                const { data, error } = await supabase
                    .from('transactions')
                    .select(`
                        *,
                        matches(
                            customer_id,
                            business_id,
                            business_profiles(company_name, services)
                        )
                    `)
                    .eq('status', 'completed')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (error) throw error;
                setCompletedService(data);
            } catch (error) {
                console.error('Error fetching completed service:', error);
                // サンプルデータを表示
                setCompletedService({
                    id: 'sample-transaction-id',
                    amount: 5000,
                    matches: {
                        business_profiles: {
                            company_name: 'サンプル株式会社',
                            services: { name: '庭園管理サービス' }
                        }
                    }
                });
            }
        };

        const fetchRecommendedServices = async () => {
            try {
                const { data, error } = await supabase
                    .from('business_profiles')
                    .select('id, company_name, services')
                    .limit(3);

                if (error) throw error;
                setRecommendedServices(data);
            } catch (error) {
                console.error('Error fetching recommended services:', error);
                // サンプルデータを表示
                setRecommendedServices([
                    { id: '1', company_name: '快適ハウスクリーニング', services: { name: '家事代行サービス' } },
                    { id: '2', company_name: 'グリーンガーデン', services: { name: '造園サービス' } },
                    { id: '3', company_name: 'テックサポート', services: { name: 'IT機器設定サポート' } }
                ]);
            }
        };

        fetchCompletedService();
        fetchRecommendedServices();
    }, []);

    return (
        <div className="min-h-screen h-full bg-gray-100">
            <Topbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">サービス利用完了</h1>
                
                {completedService && (
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">サービス完了確認</h2>
                        <p className="text-lg mb-2">利用サービス: {completedService.matches.business_profiles.services.name}</p>
                        <p className="text-lg mb-2">提供事業者: {completedService.matches.business_profiles.company_name}</p>
                        <p className="text-lg mb-4">支払金額: ¥{completedService.amount.toLocaleString()}</p>
                        <div className="flex justify-between items-center">
                            <Link href="/ReviewSubmission" className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300">
                                レビューを投稿する
                            </Link>
                            <div className="flex items-center">
                                <FaThumbsUp className="text-green-500 mr-2" />
                                <span className="text-green-500 font-semibold">サービス完了</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">おすすめの関連サービス</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {recommendedServices.map((service) => (
                            <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition duration-300">
                                <img src={`https://placehold.co/300x200?text=${service.company_name}`} alt={service.company_name} className="w-full h-40 object-cover rounded-t-lg mb-4" />
                                <h3 className="text-lg font-semibold mb-2">{service.company_name}</h3>
                                <p className="text-gray-600 mb-2">{service.services.name}</p>
                                <div className="flex items-center">
                                    <FaStar className="text-yellow-400 mr-1" />
                                    <span className="text-gray-700">4.5 (50件のレビュー)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCompletion;