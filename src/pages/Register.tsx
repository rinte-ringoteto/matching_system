import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';
import Topbar from '@/components/Topbar';
import { supabase } from '@/supabase';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email,
          user_type: userType,
        });

        if (userType === 'customer') {
          await supabase.from('customer_profiles').insert({
            user_id: data.user.id,
            name,
          });
        } else if (userType === 'business') {
          await supabase.from('business_profiles').insert({
            user_id: data.user.id,
            company_name: name,
          });
        }

        router.push('/Login');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">Register</h2>
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <div className="flex items-center border rounded-lg px-3 py-2">
                  <FaUser className="text-gray-400 mr-2" />
                  <input
                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    type="text"
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <div className="flex items-center border rounded-lg px-3 py-2">
                  <FaEnvelope className="text-gray-400 mr-2" />
                  <input
                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    type="email"
                    id="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <div className="flex items-center border rounded-lg px-3 py-2">
                  <FaLock className="text-gray-400 mr-2" />
                  <input
                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    type="password"
                    id="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userType">
                  User Type
                </label>
                <div className="flex items-center border rounded-lg px-3 py-2">
                  <FaUserTag className="text-gray-400 mr-2" />
                  <select
                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    id="userType"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    required
                  >
                    <option value="">Select user type</option>
                    <option value="customer">Customer</option>
                    <option value="business">Business</option>
                  </select>
                </div>
              </div>
              {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                Register
              </button>
            </form>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-600 text-center">
              Already have an account?{' '}
              <Link href="/Login" className="text-blue-500 hover:text-blue-700 font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;