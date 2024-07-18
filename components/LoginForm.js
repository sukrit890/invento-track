import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Headerf from './Headerf'; 
export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignInGoogle = () => signIn('google');
  const handleSignInGithub = () => signIn('github');
const router= useRouter('');
  const handleSignInCustom = async (e) => {
    e.preventDefault();

    try {
      const result = await signIn('custom_credentials', {
        username,
        password,
        redirect: false,
      });

      if (!result.error) {
        router.push('');
      } else {
        console.error('Sign-in failed:', result.error);
        setError('Invalid username or password. Please try again.'); 
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      setError('Sign-in failed. Please try again later.'); 
    }
  };

  return (
    <>
    <Headerf />

    
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background with radial gradient */}
      <div className="absolute inset-0 z-0 h-full w-full items-center px-5 py-24" style={{ background: 'radial-gradient(125% 125% at 50% 10%, #000 40%, #63e 100%)' }}></div>



      {/* Central content */}
      <div className="max-w-xl w-full mx-auto p-6 bg-white shadow-md rounded-md relative z-10">
        
           <div className="md:text-center md:mb-0">
            <h2 className="text-3xl font-bold text-black mb-4 text-center">InventoTrack</h2>
          </div>
        <h3 className="text-xl font-bold  text-black mb-4 text-center">Login</h3>

 {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleSignInGoogle}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition duration-300 ease-in-out"
            >
            Sign in with Google
          </button>
          <button
            onClick={handleSignInGithub}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md shadow-md transition duration-300 ease-in-out"
            >
            Sign in with Github
          </button>
          <form onSubmit={handleSignInCustom} className="flex flex-col space-y-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username - admin"
              className="px-3 py-2 border  text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password - 123"
              className="px-3 py-2 border  text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md transition duration-300 ease-in-out"
              >
              Sign in with Custom Credentials
              
            </button>
          </form>
        </div>
      </div>
    </div>
              </>
  );
}

