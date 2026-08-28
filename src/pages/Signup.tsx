// This page is deprecated - MongoDB authentication is used instead
// Admin users are created via the create-mongo-admin.js script
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-stone-900 mb-6">Admin User Creation</h1>
        <p className="text-stone-600 mb-4">
          Admin users are now created via the MongoDB backend. Use the <code className="bg-stone-100 px-2 py-1 rounded">create-mongo-admin.js</code> script to create admin users.
        </p>
        <p className="text-stone-600 mb-4">
          Default admin credentials:
        </p>
        <div className="bg-stone-50 p-4 rounded mb-6">
          <p className="text-sm"><strong>Email:</strong> admin@aayatprojects.com</p>
          <p className="text-sm"><strong>Password:</strong> AayatAdmin2026!</p>
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="w-full py-3 bg-gold text-stone-900 font-semibold rounded hover:bg-gold-500"
        >
          Go to Admin Login
        </button>
      </div>
    </div>
  );
}
