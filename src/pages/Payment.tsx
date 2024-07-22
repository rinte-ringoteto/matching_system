import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { FaCreditCard, FaPaypal, FaApplePay } from 'react-icons/fa';
import { supabase } from '@/supabase';
import Topbar from '@/components/Topbar';

const Payment = () => {
  const router = useRouter();
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTotalAmount = async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('amount')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setTotalAmount(data.amount);
      } catch (error) {
        console.error('Error fetching total amount:', error);
        setTotalAmount(100); // サンプルデータ
      }
    };

    fetchTotalAmount();
  }, []);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!paymentMethod) {
      setError('支払い方法を選択してください。');
      return;
    }

    if (paymentMethod === 'credit' && (!cardNumber || !expiryDate || !cvv)) {
      setError('クレジットカード情報を全て入力してください。');
      return;
    }

    try {
      const response = await axios.post('/api/payment-processing', {
        amount: totalAmount,
        paymentMethod,
        cardDetails: paymentMethod === 'credit' ? { cardNumber, expiryDate, cvv } : null,
      });

      if (response.data.success) {
        router.push('/ServiceCompletion');
      } else {
        setError('支払いに失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('支払い処理中にエラーが発生しました。');
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">決済画面</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">料金内訳</h2>
          <p className="text-xl mb-6">合計金額: ¥{totalAmount.toLocaleString()}</p>

          <h2 className="text-2xl font-semibold mb-4">支払い方法選択</h2>
          <div className="flex space-x-4 mb-6">
            <button
              className={`flex items-center px-4 py-2 rounded ${
                paymentMethod === 'credit' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setPaymentMethod('credit')}
            >
              <FaCreditCard className="mr-2" /> クレジットカード
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded ${
                paymentMethod === 'paypal' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <FaPaypal className="mr-2" /> PayPal
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded ${
                paymentMethod === 'applepay' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setPaymentMethod('applepay')}
            >
              <FaApplePay className="mr-2" /> Apple Pay
            </button>
          </div>

          {paymentMethod === 'credit' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                  カード番号
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                    有効期限
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123"
                  />
                </div>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                支払い
              </button>
            </form>
          )}

          {paymentMethod && paymentMethod !== 'credit' && (
            <button
              onClick={handlePaymentSubmit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {paymentMethod === 'paypal' ? 'PayPalで支払う' : 'Apple Payで支払う'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;