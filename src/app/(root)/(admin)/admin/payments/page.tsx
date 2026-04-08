"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  CreditCard, User, Mail, Receipt, RefreshCcw,
  Undo2, Truck, CheckCircle2, Clock, AlertCircle,
  ExternalLink, ShieldCheck, IndianRupee, Search,
  ArrowLeft, ChevronRight,
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import axios from "axios"

interface Transaction {
  _id: string;
  customerName: string;
  email: string;
  amount: number;
  createdAt: string;
  status: 'completed' | 'pending' | 'refunded';
  method: 'Online' | 'COD';
  txnId: string;
  address?: string;
  orderStatus?: string;  // add this
  items?: {              // add this
    name: string;
    price: number;
    quantity: number;
    unit: string;
    image: string;
  }[];
}

export default function PaymentManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/payment");
      setTransactions(data.payments || []);
      setError(null);
    } catch (err) {
      setError("Failed to load payment records. Please try again.");
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  // FIX: _id is now a string from the API, but use toString() defensively
  const filteredData = transactions.filter(t =>
    t.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t._id.toString().includes(searchTerm)
  );

  // Called from details view after a status update
  const handleStatusUpdate = (updatedTxn: Transaction) => {
    setTransactions(prev =>
      prev.map(t => t._id === updatedTxn._id ? updatedTxn : t)
    );
    setSelectedTxn(updatedTxn);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-8 font-sans">
      <AnimatePresence mode="wait">
        {!selectedTxn ? (
          <motion.div key="table" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <TableSection
              data={filteredData}
              onSelect={setSelectedTxn}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              loading={loading}
              error={error}
              refresh={fetchPayments}
            />
          </motion.div>
        ) : (
          <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <button
              onClick={() => setSelectedTxn(null)}
              className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Payments
            </button>
            <PaymentDetailsView
              transaction={selectedTxn}
              onStatusUpdate={handleStatusUpdate}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TableSection({ data, onSelect, searchTerm, setSearchTerm, loading, error, refresh }: any) {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Payments</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Transaction Ledger</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, or ID..."
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all w-full md:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={refresh} className="p-2.5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all">
            <RefreshCcw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-175">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order / Customer</th>
              <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Method</th>
              <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-6"><div className="h-8 bg-gray-100 rounded-xl w-full" /></td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-gray-400 font-medium">No payments found.</td>
              </tr>
            ) : (
              data.map((txn: Transaction) => (
                <tr
                  key={txn._id}
                  onClick={() => onSelect(txn)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-400 text-xs">
                        {txn.customerName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          #{txn._id.toString().slice(-6).toUpperCase()}
                        </p>
                        <p className="text-[11px] text-gray-400 font-medium">{txn.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-600">
                    {new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-900 text-sm">₹{txn.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${txn.method === 'Online' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                      {txn.method}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-tight ${txn.status === 'completed' ? 'text-green-600' : txn.status === 'refunded' ? 'text-amber-600' : 'text-blue-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${txn.status === 'completed' ? 'bg-green-500' : txn.status === 'refunded' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PaymentDetailsView({
  transaction,
  onStatusUpdate,
}: {
  transaction: Transaction;
  onStatusUpdate: (t: Transaction) => void;
}) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const updateStatus = async (newStatus: 'refunded' | 'pending') => {
    const label = newStatus === 'refunded' ? 'refund' : 'return';
    setActionLoading(label);
    setActionError(null);
    try {
      const { data } = await axios.patch('/api/admin/payment', {
        id: transaction._id,
        status: newStatus,
      });
      if (data.success) {
        onStatusUpdate({ ...transaction, status: newStatus });
      }
    } catch (err: any) {
      setActionError(err?.response?.data?.message || 'Action failed. Try again.');
    } finally {
      setActionLoading(null);
    }
  };

  // Derive breakdown: GST 18% is embedded in total
  const gstAmount = parseFloat((transaction.amount * (18 / 118)).toFixed(2));
  const subtotal = parseFloat((transaction.amount - gstAmount).toFixed(2));

  const InfoCard = ({ icon: Icon, label, value, subValue }: any) => (
    <div className="flex items-start gap-4 p-5 rounded-[24px] border border-gray-100 bg-white shadow-xs hover:shadow-md transition-shadow">
      <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-900 leading-tight">{value}</p>
        {subValue && <p className="text-[11px] text-gray-500 mt-0.5">{subValue}</p>}
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 tracking-wider">
              ORDER #{transaction._id.toString().slice(-8).toUpperCase()}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-400 font-medium">
              {new Date(transaction.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Payment Details</h1>
        </div>
        <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 font-bold text-sm shadow-sm
          ${transaction.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' :
            transaction.status === 'refunded' ? 'bg-amber-50 text-amber-700 border-amber-100' :
            'bg-blue-50 text-blue-700 border-blue-100'}`}>
          {transaction.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          {transaction.status.toUpperCase()}
        </div>
      </div>

      {actionError && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
          <AlertCircle className="w-5 h-5" /> {actionError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Customer</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-[24px] bg-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-100">
                    {transaction.customerName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900">{transaction.customerName}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5" /> {transaction.email}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Shipping to</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {transaction.address || "Address not provided"}
                </p>
              </div>
            </div>
            <User className="absolute -right-4 -bottom-4 w-32 h-32 text-gray-50/50 -rotate-12" />
          </div>

          {/* Payment Method Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`rounded-[32px] p-8 text-white relative overflow-hidden group shadow-xl ${transaction.method === 'Online' ? 'bg-gray-900' : 'bg-amber-600'}`}>
              <div className="relative z-10 flex flex-col h-full justify-between min-h-40">
                <div className="flex justify-between items-start">
                  {transaction.method === 'Online'
                    ? <CreditCard className="w-10 h-10 opacity-50" />
                    : <Truck className="w-10 h-10 opacity-50" />}
                  <div className="text-right">
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Gateway</p>
                    <p className="text-sm font-bold">
                      {transaction.method === 'Online' ? 'Razorpay Secure' : 'Cash on Delivery'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-mono tracking-[0.2em] mb-2">
                    {transaction.method === 'Online' ? '**** **** **** 4421' : 'CASH ON DELIVERY'}
                  </p>
                  {transaction.txnId && (
                    <p className="text-[10px] font-bold opacity-50 uppercase">TXN: {transaction.txnId}</p>
                  )}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            </div>

            <div className="bg-white border border-gray-100 rounded-[32px] p-8 flex flex-col justify-center border-dashed">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Audit Log</p>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-1 h-8 bg-green-500 rounded-full shrink-0" />
                  <p className="text-xs text-gray-500 italic">
                    {transaction.status === 'completed'
                      ? '"Payment authorized successfully via customer banking portal."'
                      : transaction.status === 'refunded'
                      ? '"Refund initiated. Amount will be credited in 5–7 business days."'
                      : '"Payment is pending confirmation from the payment gateway."'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Management Actions */}
          <div className="bg-white border border-gray-100 rounded-[32px] p-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Management Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => updateStatus('refunded')}
                disabled={transaction.status === 'refunded' || !!actionLoading}
                className="flex items-center gap-2 px-6 py-3.5 rounded-[18px] bg-amber-50 text-amber-700 font-bold text-sm hover:bg-amber-100 active:scale-95 transition-all border border-amber-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RefreshCcw className={`w-4 h-4 ${actionLoading === 'refund' ? 'animate-spin' : ''}`} />
                {actionLoading === 'refund' ? 'Processing...' : 'Initiate Refund'}
              </button>
              <button
                onClick={() => updateStatus('pending')}
                disabled={transaction.status === 'pending' || !!actionLoading}
                className="flex items-center gap-2 px-6 py-3.5 rounded-[18px] bg-red-50 text-red-700 font-bold text-sm hover:bg-red-100 active:scale-95 transition-all border border-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Undo2 className="w-4 h-4" />
                Record Return
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-3.5 rounded-[18px] bg-gray-50 text-gray-700 font-bold text-sm hover:bg-gray-100 active:scale-95 transition-all border border-gray-200"
              >
                <Receipt className="w-4 h-4" /> Print Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
       {/* Bill Breakdown — replace the static one */}
        <div className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <ShieldCheck className="w-6 h-6 text-green-500/20" />
          </div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Bill Breakdown</h3>
          <div className="space-y-4">
            {/* Real order items */}
            {transaction.items && transaction.items.length > 0 && (
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                {transaction.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">
                      {item.name} × {item.quantity} {item.unit}
                    </span>
                    <span className="font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-medium">Subtotal (excl. GST)</span>
              <span className="font-bold text-gray-900">
                ₹{(transaction.amount - parseFloat((transaction.amount * (18 / 118)).toFixed(2))).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-medium">GST (18%)</span>
              <span className="font-bold text-gray-900">
                ₹{parseFloat((transaction.amount * (18 / 118)).toFixed(2)).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="pt-5 mt-2 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-black text-gray-900 uppercase">Total Paid</span>
              <span className="text-3xl font-black text-gray-900 tracking-tighter">
                ₹{transaction.amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

          <InfoCard
            icon={IndianRupee}
            label="Payout Status"
            value={transaction.status === 'refunded' ? 'Refund Initiated' : 'Processing'}
            subValue={transaction.status === 'refunded' ? 'Credit in 5–7 business days' : 'Settlement expected Friday'}
          />

          <div className="p-8 bg-blue-600 rounded-[40px] text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] mb-3">Finance Desk</p>
              <p className="text-sm font-bold leading-relaxed mb-6">Need help with this specific transaction? Open a direct chat with billing.</p>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-[20px] text-xs font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest backdrop-blur-sm">
                Raise Query <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>
      </div>
  )
}


