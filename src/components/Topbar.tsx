undefined

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaHome, FaUser, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

const Topbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 仮のログイン状態

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = () => {
        // ログアウト処理をここに実装
        setIsLoggedIn(false);
        router.push('/Login');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/Home" className="text-2xl font-bold text-[#336699]">
                                LocalConnect
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link href="/Home" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#336699]">
                                ホーム
                            </Link>
                            <Link href="/NeedsInput" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#336699]">
                                ニーズ入力
                            </Link>
                            <Link href="/FavoritesList" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#336699]">
                                お気に入り
                            </Link>
                            <Link href="/MessageScreen" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-[#336699]">
                                メッセージ
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {isLoggedIn ? (
                            <div className="ml-3 relative">
                                <div>
                                    <button
                                        type="button"
                                        className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#336699]"
                                        onClick={handleLogout}
                                    >
                                        <span className="sr-only">ログアウト</span>
                                        <FaSignOutAlt className="h-6 w-6 text-[#336699]" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link href="/Login" className="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                                <FaSignInAlt className="inline-block mr-1" /> ログイン
                            </Link>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#336699]"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">メニューを開く</span>
                            <svg
                                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg
                                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
                <div className="pt-2 pb-3 space-y-1">
                    <Link href="/Home" className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                        ホーム
                    </Link>
                    <Link href="/NeedsInput" className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                        ニーズ入力
                    </Link>
                    <Link href="/FavoritesList" className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                        お気に入り
                    </Link>
                    <Link href="/MessageScreen" className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                        メッセージ
                    </Link>
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                        >
                            ログアウト
                        </button>
                    ) : (
                        <Link href="/Login" className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                            ログイン
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Topbar;