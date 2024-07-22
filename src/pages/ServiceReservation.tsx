import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '@/supabase';
import Topbar from '@/components/Topbar';
import { FaCalendarAlt, FaList, FaCheckCircle } from 'react-icons/fa';

const ServiceReservation: React.FC = () => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchServices();
    fetchOptions();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('services');
      if (error) throw error;
      if (data) {
        const serviceList = data.flatMap(profile => Object.keys(profile.services));
        setServices([...new Set(serviceList)]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices(['洗車サービス', 'エステサービス', '家事代行サービス']); // サンプルデータ
    }
  };

  const fetchOptions = async () => {
    try {
      // 実際のAPIエンドポイントが必要です
      const { data, error } = await supabase
        .from('service_options')
        .select('name');
      if (error) throw error;
      if (data) {
        setOptions(data.map(option => option.name));
      }
    } catch (error) {
      console.error('Error fetching options:', error);
      setOptions(['オプション1', 'オプション2', 'オプション3']); // サンプルデータ
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleOptionChange = (option: string) => {
    setSelectedOptions(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the reservation data to your backend
    console.log({ selectedService, selectedDate, selectedOptions });
    router.push('/Payment');
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">サービス予約</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                <FaList className="inline-block mr-2" />
                サービス選択
              </label>
              <select
                id="service"
                value={selectedService}
                onChange={handleServiceChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                required
              >
                <option value="">サービスを選択してください</option>
                {services.map((service, index) => (
                  <option key={index} value={service}>{service}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                <FaCalendarAlt className="inline-block mr-2" />
                日時選択
              </label>
              <input
                type="datetime-local"
                id="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCheckCircle className="inline-block mr-2" />
                オプション選択
              </label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <label key={index} className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      value={option}
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleOptionChange(option)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                予約確認
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceReservation;