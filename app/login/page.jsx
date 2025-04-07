import dynamic from 'next/dynamic';


const LoginForm = dynamic(() => import('../components/LoginForm'), {
  ssr: true, 
  loading: () => <div className="min-h-screen flex items-center justify-center">กำลังโหลด...</div>
});

export default function LoginPage() {
  return <LoginForm />;
}