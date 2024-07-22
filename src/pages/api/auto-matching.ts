import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // 1. 顧客のニーズ情報を取得する
        const { customerId } = req.body;
        const { data: customerNeeds, error: customerError } = await supabase
            .from('customer_profiles')
            .select('needs')
            .eq('id', customerId)
            .single();

        if (customerError) throw new Error('顧客情報の取得に失敗しました');

        // 2. 事業者のサービス情報を取得する
        const { data: businessServices, error: businessError } = await supabase
            .from('business_profiles')
            .select('id, company_name, services');

        if (businessError) throw new Error('事業者情報の取得に失敗しました');

        // 3. マッチングアルゴリズムを実行し最適な組み合わせを見つける
        const matches = businessServices.map(business => {
            const score = calculateMatchScore(customerNeeds.needs, business.services);
            return { businessId: business.id, companyName: business.company_name, score };
        }).sort((a, b) => b.score - a.score).slice(0, 5);

        // 4. マッチング結果をデータベースに保存する
        const { error: matchError } = await supabase
            .from('matches')
            .insert(matches.map(match => ({
                customer_id: customerId,
                business_id: match.businessId,
                score: match.score,
                status: 'pending'
            })));

        if (matchError) throw new Error('マッチング結果の保存に失敗しました');

        // 5. マッチング結果をフロントエンドに返す
        res.status(200).json({ matches });

    } catch (error) {
        console.error('Auto-matching error:', error);
        res.status(500).json({
            message: 'マッチング処理中にエラーが発生しました',
            matches: [
                { businessId: 'b001', companyName: '株式会社A', score: 0.9 },
                { businessId: 'b002', companyName: '株式会社B', score: 0.8 },
                { businessId: 'b003', companyName: '株式会社C', score: 0.7 },
            ]
        });
    }
}

function calculateMatchScore(customerNeeds: any, businessServices: any): number {
    // ここにマッチングスコア計算ロジックを実装
    // この例では単純化のためにランダムなスコアを返しています
    return Math.random();
}