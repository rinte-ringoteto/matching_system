import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaSearch, FaIndustry, FaMapMarkerAlt, FaMoneyBillWave, FaClipboardList } from 'react-icons/fa';
import { supabase } from '@/supabase';
import Topbar from '@/components/Topbar';

const NeedsInput: React.FC = () => {
    const router = useRouter();
    const [industry, setIndustry] = useState('');
    const [location, setLocation] = useState('');
    const [budget, setBudget] = useState('');
    const [otherRequirements, setOtherRequirements] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase
                .from('customer_profiles')
                .update({
                    needs: { industry, location, budget, otherRequirements }
                })
                .eq('user_id', 'current_user_id'); // Replace with actual user ID

            if (error) throw error;
            router.push('/MatchingResults');
        } catch (error) {
            console.error('Error updating needs:', error);
        }
    };

    return (
        <div className="min-h-screen h-full bg-gray-100">
            <Topbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">ニーズ入力</h1>
                <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                                <FaIndustry className="inline mr-2" />
                                業種
                            </label>
                            <input
                                type="text"
                                id="industry"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                <FaMapMarkerAlt className="inline mr-2" />
                                地域
                            </label>
                            <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                                <FaMoneyBillWave className="inline mr-2" />
                                予算
                            </label>
                            <input
                                type="text"
                                id="budget"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="otherRequirements" className="block text-sm font-medium text-gray-700">
                                <FaClipboardList className="inline mr-2" />
                                その他の要件
                            </label>
                            <textarea
                                id="otherRequirements"
                                value={otherRequirements}
                                onChange={(e) => setOtherRequirements(e.target.value)}
                                rows={4}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            ></textarea>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <FaSearch className="mr-2" />
                                検索
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NeedsInput;