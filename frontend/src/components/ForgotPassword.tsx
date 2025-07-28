import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/updatePassword', {
                email,
                newpassword: newPassword,
                verificationCode
            });

            if (response.data.success) {
                setMessage('Password updated successfully!');
                setIsError(false);
            } else {
                setMessage(response.data.error || 'Something went wrong');
                setIsError(true);
            }
        } catch (err: any) {
            setMessage(err.response?.data?.error || 'Server error');
            setIsError(true);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[#030303] text-white">
            <form
                onSubmit={handleSubmit}
                className="bg-[#161616] p-8 rounded-2xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-[#FFD700]">Reset Your Password</h2>

                <label className="block mb-2 text-sm font-semibold">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 rounded bg-[#1e1e1e] border border-gray-700 focus:outline-none"
                    required
                />

                <label className="block mb-2 text-sm font-semibold">Verification Code</label>
                <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full p-2 mb-4 rounded bg-[#1e1e1e] border border-gray-700 focus:outline-none"
                    required
                />

                <label className="block mb-2 text-sm font-semibold">New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 mb-4 rounded bg-[#1e1e1e] border border-gray-700 focus:outline-none"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-[#FFD700] text-black font-bold py-2 px-4 rounded hover:bg-yellow-500 transition"
                >
                    Update Password
                </button>

                {message && (
                    <div className={`mt-4 text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default ForgotPassword;
