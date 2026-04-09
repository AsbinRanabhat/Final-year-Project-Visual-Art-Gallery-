import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [status, setStatus] = useState('loading'); // loading | success | failed
  const [orderData, setOrderData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const pidx = searchParams.get('pidx');
  const khaltiStatus = searchParams.get('status');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!pidx) {
        setStatus('failed');
        setErrorMsg('No payment identifier found.');
        return;
      }

      // If user canceled on Khalti page
      if (khaltiStatus === 'User canceled') {
        setStatus('failed');
        setErrorMsg('Payment was canceled.');
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/payment/verify?pidx=${pidx}`);
        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setOrderData(data.order);
          clearCart(); // Clear the cart after successful payment
        } else {
          setStatus('failed');
          setErrorMsg(data.message || 'Payment could not be verified.');
        }
      } catch (err) {
        console.error('Verify error:', err);
        setStatus('failed');
        setErrorMsg('Something went wrong verifying the payment.');
      }
    };

    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pidx]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white p-10 shadow-2xl border border-stone-100 text-center">
        
        {/* Loading State */}
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="animate-spin text-[#5C2D91]" />
            <h2 className="text-xl font-serif text-stone-700">Verifying your payment...</h2>
            <p className="text-sm text-stone-400">Please wait while we confirm your transaction with Khalti.</p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle size={40} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-serif text-stone-900">Payment Successful!</h2>
            <p className="text-stone-500 text-sm">
              Your artwork has been secured. Thank you for your purchase.
            </p>

            {orderData && (
              <div className="w-full mt-4 border-t border-stone-100 pt-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400 uppercase tracking-wider text-[10px]">Order ID</span>
                  <span className="font-mono text-xs text-stone-700">{orderData._id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400 uppercase tracking-wider text-[10px]">Amount Paid</span>
                  <span className="font-bold text-stone-900">NPR {orderData.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400 uppercase tracking-wider text-[10px]">Status</span>
                  <span className="text-emerald-600 font-bold uppercase text-xs">{orderData.paymentStatus}</span>
                </div>
                {orderData.transactionId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400 uppercase tracking-wider text-[10px]">Transaction ID</span>
                    <span className="font-mono text-xs text-stone-700">{orderData.transactionId}</span>
                  </div>
                )}
                {orderData.items && orderData.items.length > 0 && (
                  <div className="mt-4 border-t border-stone-100 pt-4">
                    <p className="text-stone-400 uppercase tracking-wider text-[10px] mb-2">Items</p>
                    {orderData.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm py-1">
                        <span className="text-stone-700">{item.productName} × {item.quantity}</span>
                        <span className="text-stone-600">NPR {(item.productPrice * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => navigate('/products')}
                className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-all active:scale-95"
              >
                <ShoppingBag size={14} />
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-6 py-3 border border-stone-300 text-stone-700 text-[10px] uppercase tracking-widest hover:bg-stone-50 transition-all active:scale-95"
              >
                <ArrowLeft size={14} />
                Home
              </button>
            </div>
          </div>
        )}

        {/* Failed State */}
        {status === 'failed' && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
              <XCircle size={40} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-serif text-stone-900">Payment Failed</h2>
            <p className="text-stone-500 text-sm">
              {errorMsg || 'Your payment could not be completed. Please try again.'}
            </p>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => navigate('/cart')}
                className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-all active:scale-95"
              >
                Return to Cart
              </button>
              <button
                onClick={() => navigate('/products')}
                className="flex items-center gap-2 px-6 py-3 border border-stone-300 text-stone-700 text-[10px] uppercase tracking-widest hover:bg-stone-50 transition-all active:scale-95"
              >
                Browse Gallery
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
