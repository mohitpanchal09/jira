"use client"
import React, { useState } from 'react';
import { MapPin, Copy, Check } from 'lucide-react';

interface EmailTemplateProps {
  recipientName: string;
  otp: string;
  expiryMinutes?: number;
  appName?: string;
}

export const RegistrationMailTemplate: React.FC<EmailTemplateProps> = ({ 
  recipientName, 
  otp, 
  expiryMinutes = 10,
  appName = "TrekFlow" 
}) => {
  const currentYear = new Date().getFullYear();
  const otpChars = otp.split('');
  const [copied, setCopied] = useState(false);

  const handleCopyOTP = async () => {
    try {
      await navigator.clipboard.writeText(otp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy OTP:', err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 flex items-center justify-center font-sans">
      <div className="max-w-md w-full mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <div className="flex items-center">
            <div className="mr-3 flex items-center justify-center bg-white rounded-full p-2">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{appName}</h2>
              <p className="text-sm text-green-100">Your Adventure Companion</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Verify Your Email</h1>
          
          <p className="text-gray-600 mb-6">
            Hi {recipientName},
          </p>
          
          <p className="text-gray-600 mb-6">
            Thank you for registering with {appName}. To complete your registration and verify your account, 
            please use the verification code below:
          </p>
          
          {/* OTP Section */}
          <div className="mb-6">
            <div className="bg-gray-100 p-6 rounded-lg border border-gray-200 text-center">
              <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Your Verification Code</h3>
              
              <div className="flex justify-center mb-4">
                {otpChars.map((char, index) => (
                  <div 
                    key={index} 
                    className="w-12 h-14 mx-1 flex items-center justify-center bg-white rounded border border-gray-300 shadow-sm text-2xl font-bold text-gray-800"
                  >
                    {char}
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-500">
                This code will expire in {expiryMinutes} minutes
              </p>
            </div>
            
            <div className="mt-6">
              <button 
                onClick={handleCopyOTP}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    Copy OTP
                  </>
                )}
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-2">
                Click to copy the verification code
              </p>
            </div>
          </div>
          
          <p className="text-gray-600 mt-6">
            If you did not request this verification code, please ignore this email or contact our support team if you have concerns.
          </p>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Security Tip</h3>
            <p className="text-blue-700 text-sm">
              We will never ask for your password or full account details via email. 
              Always make sure you&apos;re on our official website before entering any sensitive information.
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-100 p-6 border-t border-gray-200">
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-4">
              If you need any assistance, please contact our support team at{' '}
              <a href="mailto:support@trekflow.com" className="text-blue-600 hover:underline">
                support@trekflow.com
              </a>
            </p>
            
            <div className="flex justify-center space-x-4 mb-4">
              <a href="#" className="text-gray-500 hover:text-blue-600">Help Center</a>
              <a href="#" className="text-gray-500 hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-blue-600">Terms of Service</a>
            </div>
            
            <div className="pt-4 border-t border-gray-300 text-gray-500">
              <p>© {currentYear} {appName}. All rights reserved.</p>
              <p className="mt-1 text-xs">
                Please do not reply to this email as it was sent from an unmonitored address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};