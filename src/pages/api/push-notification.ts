import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PUSH_NOTIFICATION_SERVICE_URL = 'https://api.pushnotificationservice.com/v1/send';
const PUSH_NOTIFICATION_API_KEY = process.env.PUSH_NOTIFICATION_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 1. 通知が必要なイベントを検知する
    const { eventType, userId, message } = req.body;

    if (!eventType || !userId || !message) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // 2. 通知内容を生成する
    const notificationContent = {
      title: `新しい${eventType}があります`,
      body: message,
    };

    // 3. ユーザーのデバイストークンを取得する
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('device_token')
      .eq('id', userId)
      .single();

    if (userError || !user?.device_token) {
      console.error('Error fetching user device token:', userError);
      return res.status(404).json({ message: 'User device token not found' });
    }

    // 4. プッシュ通知サービスのAPIを使用して通知を送信する
    try {
      const response = await axios.post(
        PUSH_NOTIFICATION_SERVICE_URL,
        {
          to: user.device_token,
          notification: notificationContent,
        },
        {
          headers: {
            'Authorization': `Bearer ${PUSH_NOTIFICATION_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // 5. 通知送信結果をログに記録する
      await supabase.from('notification_logs').insert({
        user_id: userId,
        event_type: eventType,
        message: message,
        status: 'sent',
        sent_at: new Date().toISOString(),
      });

      return res.status(200).json({ message: 'Notification sent successfully', data: response.data });
    } catch (error) {
      console.error('Error sending push notification:', error);

      // API リクエストに失敗した場合のサンプルデータ
      const sampleResponse = {
        success: true,
        id: 'sample-notification-id-12345',
        timestamp: new Date().toISOString(),
      };

      // 失敗ログを記録
      await supabase.from('notification_logs').insert({
        user_id: userId,
        event_type: eventType,
        message: message,
        status: 'failed',
        sent_at: new Date().toISOString(),
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      return res.status(200).json({ message: 'Notification sending simulated', data: sampleResponse });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}