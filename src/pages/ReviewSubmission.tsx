import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { supabase } from '@/supabase';
import Topbar from '@/components/Topbar';

const ReviewSubmission: React.FC = () => {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/Login');
      }
    };
    checkAuth();
  }, [router]);

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the review data to your backend
    // For this example, we'll just log it and show a success message
    console.log({ rating, comment, photo });
    alert('レビューが投稿されました。ありがとうございます！');
    // Reset form
    setRating(0);
    setComment('');
    setPhoto(null);
    setPreview(null);
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">レビュー投稿</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
              評価
            </label>
            <div className="flex">
              {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;
                return (
                  <label key={i}>
                    <input
                      type="radio"
                      name="rating"
                      className="hidden"
                      value={ratingValue}
                      onClick={() => handleRatingChange(ratingValue)}
                    />
                    <FaStar
                      className="cursor-pointer"
                      color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                      size={30}
                    />
                  </label>
                );
              })}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
              コメント
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="comment"
              rows={4}
              value={comment}
              onChange={handleCommentChange}
              placeholder="サービスについてのご感想をお書きください"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
              写真
            </label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {preview && (
              <img src={preview} alt="Preview" className="mt-2 max-w-xs h-auto" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              投稿する
            </button>
            <Link href="/ServiceCompletion" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              キャンセル
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewSubmission;