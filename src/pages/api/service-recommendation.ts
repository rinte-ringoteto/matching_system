import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // 1. 顧客の利用履歴とpreferencesを取得する
    const { data: userHistory, error: historyError } = await supabase
      .from('matches')
      .select('business_id, created_at')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    if (historyError) throw historyError;

    const { data: userPreferences, error: preferencesError } = await supabase
      .from('customer_profiles')
      .select('needs')
      .eq('user_id', userId)
      .single();

    if (preferencesError) throw preferencesError;

    // 2. 推奨アルゴリズムを実行して適切なサービスや事業者をリストアップする
    const recommendedServices = await getRecommendedServices(userHistory, userPreferences.needs);

    // 3. 推奨結果をデータベースに保存する
    const { error: insertError } = await supabase
      .from('recommendations')
      .insert({ user_id: userId, recommendations: recommendedServices });

    if (insertError) throw insertError;

    // 4. 推奨リストをフロントエンドに返す
    res.status(200).json({ recommendedServices });
  } catch (error) {
    console.error('Error in service recommendation:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

async function getRecommendedServices(userHistory: any[], userPreferences: any) {
  try {
    // 外部APIを使用して推奨サービスを取得する想定
    const response = await axios.post('https://api.recommendation-service.com/recommend', {
      history: userHistory,
      preferences: userPreferences
    });
    return response.data.recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    // APIリクエストに失敗した場合のサンプルデータ
    return [
      { id: 'b1', name: '快適ハウスクリーニング', category: 'ハウスクリーニング', rating: 4.8 },
      { id: 'b2', name: '匠の技 庭園サービス', category: '庭園管理', rating: 4.7 },
      { id: 'b3', name: 'スマイル介護サポート', category: '介護サービス', rating: 4.9 },
      { id: 'b4', name: '24時間緊急水道修理', category: '水道修理', rating: 4.6 },
      { id: 'b5', name: 'エコ電気設備メンテナンス', category: '電気工事', rating: 4.5 }
    ];
  }
}