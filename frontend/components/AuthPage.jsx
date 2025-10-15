import React, { useState } from 'react';
import axios from 'axios';

// SVG Icon Components
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
);
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

export default function AuthPage({ onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        const url = isLogin 
            ? 'http://localhost:5000/api/users/login' 
            : 'http://localhost:5000/api/users/register';

        try {
            const response = await axios.post(url, data);
            if (response.data) {
                localStorage.setItem('userInfo', JSON.stringify(response.data));
                onLoginSuccess(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1528491044431-59f48558b3d0?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div className="relative m-4 w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-lg">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">CityCare</h1>
                    <p className="text-gray-600 mt-2">Your voice for a better city.</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <div className="flex rounded-lg bg-gray-200 p-1 mb-6">
                    <button onClick={() => setIsLogin(true)} className={`w-1/2 rounded-md py-2 text-sm font-medium transition-all duration-300 ${isLogin ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:bg-gray-300/50'}`}>Login</button>
                    <button onClick={() => setIsLogin(false)} className={`w-1/2 rounded-md py-2 text-sm font-medium transition-all duration-300 ${!isLogin ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:bg-gray-300/50'}`}>Sign Up</button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon /></div>
                            <input name="name" type="text" required className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-3" placeholder="Full Name"/>
                        </div>
                    )}
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><MailIcon /></div>
                        <input name="email" type="email" autoComplete="email" required className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-3" placeholder="Email address"/>
                    </div>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><LockIcon /></div>
                        <input name="password" type="password" required minLength="6" className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-3" placeholder="Password"/>
                    </div>
                    <div>
                        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white">{isLogin ? 'Login' : 'Create Account'}</button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">{isLogin ? "Don't have an account? " : 'Already have an account? '}<button onClick={toggleAuthMode} className="font-medium text-blue-600 hover:text-blue-500">{isLogin ? 'Sign up' : 'Login'}</button></p>
            </div>
        </div>
    );
}