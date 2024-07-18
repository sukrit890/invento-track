// app/login.js
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if user is authenticated
    if (status === 'authenticated') {
      router.replace('/');
    }
  }, [status]);


  return (
    <div>
      <LoginForm />
   
    </div>
  );
};

export default LoginPage;
