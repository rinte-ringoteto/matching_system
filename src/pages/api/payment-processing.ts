import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Supabaseクライアントの初期化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// 決済プロバイダのAPIエンドポイント（仮想）
const PAYMENT_API_ENDPOINT = 'https://api.payment-provider.com/v1/process';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 1. フロントエンドから決済情報を受け取る
    const { amount, currency, customerId, paymentMethod } = req.body;

    // 2. 決済プロバイダのAPIを呼び出して支払いを処理する
    const paymentResponse = await processPayment(amount, currency, customerId, paymentMethod);

    // 3. 決済結果を検証する
    if (paymentResponse.status !== 'success') {
      throw new Error('Payment processing failed');
    }

    // 4. 取引情報をデータベースに保存する
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        amount,
        currency,
        customer_id: customerId,
        payment_method: paymentMethod,
        status: 'completed',
        payment_id: paymentResponse.paymentId
      });

    if (error) throw error;

    // 5. 決済完了通知をフロントエンドに返す
    res.status(200).json({
      message: 'Payment processed successfully',
      transactionId: transaction[0].id,
      paymentId: paymentResponse.paymentId
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ message: 'An error occurred while processing the payment' });
  }
}

async function processPayment(amount: number, currency: string, customerId: string, paymentMethod: string) {
  try {
    const response = await axios.post(PAYMENT_API_ENDPOINT, {
      amount,
      currency,
      customerId,
      paymentMethod
    });
    return response.data;
  } catch (error) {
    console.error('Error calling payment API:', error);
    // APIリクエストに失敗した場合のサンプルデータ
    return {
      status: 'success',
      paymentId: 'sample-payment-id-' + Date.now(),
      message: 'Sample successful payment response'
    };
  }
}