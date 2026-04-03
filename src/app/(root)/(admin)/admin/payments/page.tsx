"use client"

import React, { useState, useEffect, useCallback } from "react"
import { 
  CreditCard, User, Mail, Calendar, Receipt, RefreshCcw, 
  Undo2, Truck, CheckCircle2, Clock, AlertCircle,
  ExternalLink, ShieldCheck, IndianRupee, Search, 
  ArrowLeft, Filter, ChevronRight, Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import axios from "axios"

// --- TYPES ---
interface Transaction {
  _id: string; // MongoDB typically uses _id
  customerName: string;
  email: string;
  amount: number;
  createdAt: string;
  status: 'completed' | 'pending' | 'refunded';
  method: 'Online' | 'COD';
  txnId: string;
  address?: string;
}

export default function PaymentManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- REAL DATA FETCH ---
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
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

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filteredData = transactions.filter(t => 
    t.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t._id.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-8 font-sans">
      <AnimatePresence mode="wait">
        {!selectedTxn ? (
          <motion.div 
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
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
          <motion.div 
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button 
              onClick={() => setSelectedTxn(null)}
              className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Payments
            </button>
            <PaymentDetailsView transaction={selectedTxn} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- SUB-COMPONENT: TABLE VIEW ---
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
        <table className="w-full text-left border-collapse min-w-200">
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
                      <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-400 text-xs shadow-xs">
                        {txn.customerName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">#{txn._id.slice(-6).toUpperCase()}</p>
                        <p className="text-[11px] text-gray-400 font-medium">{txn.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-600">
                    {new Date(txn.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-900 text-sm">₹{txn.amount.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${txn.method === 'Online' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                      {txn.method}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-tight ${
                      txn.status === 'completed' ? 'text-green-600' : txn.status === 'refunded' ? 'text-amber-600' : 'text-blue-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                        txn.status === 'completed' ? 'bg-green-500' : txn.status === 'refunded' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
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

// --- SUB-COMPONENT: DETAILS VIEW ---
function PaymentDetailsView({ transaction }: { transaction: Transaction }) {
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
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 tracking-wider">ORDER #{transaction._id.slice(-8).toUpperCase()}</span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-400 font-medium">
                {new Date(transaction.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info Card */}
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Customer</h3>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[24px] bg-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-100">
                        {transaction.customerName?.charAt(0)}
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
                  {transaction.address || "123 Tech Avenue, Silicon Valley, CA - 94027, United States"}
                </p>
              </div>
            </div>
            <User className="absolute -right-4 -bottom-4 w-32 h-32 text-gray-50/50 -rotate-12" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`rounded-[32px] p-8 text-white relative overflow-hidden group shadow-xl ${transaction.method === 'Online' ? 'bg-gray-900' : 'bg-amber-600'}`}>
              <div className="relative z-10 flex flex-col h-full justify-between min-h-40">
                <div className="flex justify-between items-start">
                  {transaction.method === 'Online' ? <CreditCard className="w-10 h-10 opacity-50" /> : <Truck className="w-10 h-10 opacity-50" />}
                  <div className="text-right">
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Gateway</p>
                    <p className="text-sm font-bold">Razorpay Secure</p>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-mono tracking-[0.2em] mb-2">
                    {transaction.method === 'Online' ? "**** 4421" : "CASH ON DELIVERY"}
                  </p>
                  <p className="text-[10px] font-bold opacity-50 uppercase">Transaction ID: {transaction.txnId}</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            </div>

            <div className="bg-white border border-gray-100 rounded-[32px] p-8 flex flex-col justify-center border-dashed">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Audit Log</p>
              <div className="space-y-3">
                <div className="flex gap-3">
                    <div className="w-1 h-8 bg-green-500 rounded-full" />
                    <p className="text-xs text-gray-500 italic">"Payment authorized successfully via customer banking portal."</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[32px] p-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Management Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 px-6 py-3.5 rounded-[18px] bg-amber-50 text-amber-700 font-bold text-sm hover:bg-amber-100 active:scale-95 transition-all border border-amber-100">
                <RefreshCcw className="w-4 h-4" /> Initiate Refund
              </button>
              <button className="flex items-center gap-2 px-6 py-3.5 rounded-[18px] bg-red-50 text-red-700 font-bold text-sm hover:bg-red-100 active:scale-95 transition-all border border-red-100">
                <Undo2 className="w-4 h-4" /> Record Return
              </button>
              <button className="flex items-center gap-2 px-6 py-3.5 rounded-[18px] bg-gray-50 text-gray-700 font-bold text-sm hover:bg-gray-100 active:scale-95 transition-all border border-gray-200">
                <Receipt className="w-4 h-4" /> Print Invoice
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
                <ShieldCheck className="w-6 h-6 text-green-500/20" />
            </div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Bill Breakdown</h3>
            <div className="space-y-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">Subtotal</span>
                <span className="font-bold text-gray-900">₹{(transaction.amount * 0.82).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">Tax (GST 18%)</span>
                <span className="font-bold text-gray-900">₹{(transaction.amount * 0.18).toFixed(2)}</span>
              </div>
              <div className="pt-5 mt-5 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-black text-gray-900 uppercase">Total Paid</span>
                <span className="text-3xl font-black text-gray-900 tracking-tighter">₹{transaction.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <InfoCard icon={IndianRupee} label="Payout Status" value="Processing" subValue="Settlement expected Friday" />
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
    </div>
  )
}















// "use client"

// import React, { useState } from "react"
// import { 
//   CreditCard, User, Mail, Calendar, Receipt, RefreshCcw, 
//   Undo2, Truck, CheckCircle2, Clock, AlertCircle,
//   ExternalLink, ShieldCheck, IndianRupee, Search, 
//   ArrowLeft, ArrowUpDown, Filter, ChevronRight
// } from "lucide-react"
// import { motion, AnimatePresence } from "motion/react"

// // --- TYPES ---
// interface Transaction {
//   id: string;
//   customerName: string;
//   email: string;
//   amount: number;
//   date: string;
//   status: 'completed' | 'pending' | 'refunded';
//   method: 'Online' | 'COD';
//   txnId: string;
// }

// // --- MOCK DATA ---
// const MOCK_TRANSACTIONS: Transaction[] = [
//   { id: "88291", customerName: "Johnathan Doe", email: "john.doe@example.com", amount: 2948.82, date: "Mar 24, 2026", status: "completed", method: "Online", txnId: "TXN_99201XLM02" },
//   { id: "88292", customerName: "Sarah Smith", email: "sarah.s@outlook.com", amount: 1250.00, date: "Mar 25, 2026", status: "pending", method: "COD", txnId: "N/A" },
//   { id: "88293", customerName: "Mike Ross", email: "mike.r@gmail.com", amount: 5600.50, date: "Mar 22, 2026", status: "refunded", method: "Online", txnId: "TXN_44102BBC99" },
// ];

// export default function PaymentManager() {
//   const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredData = MOCK_TRANSACTIONS.filter(t => 
//     t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     t.id.includes(searchTerm)
//   );

//   return (
//     <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-8">
//       <AnimatePresence mode="wait">
//         {!selectedTxn ? (
//           <motion.div 
//             key="table"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//           >
//             <TableSection 
//               data={filteredData} 
//               onSelect={setSelectedTxn} 
//               searchTerm={searchTerm} 
//               setSearchTerm={setSearchTerm} 
//             />
//           </motion.div>
//         ) : (
//           <motion.div 
//             key="details"
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//           >
//             <button 
//               onClick={() => setSelectedTxn(null)}
//               className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors"
//             >
//               <ArrowLeft className="w-4 h-4" /> Back to Payments
//             </button>
//             <PaymentDetailsView transaction={selectedTxn} />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// // --- SUB-COMPONENT: TABLE VIEW ---
// function TableSection({ data, onSelect, searchTerm, setSearchTerm }: any) {
//   return (
//     <div className="max-w-6xl mx-auto space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-black text-gray-900">Payments</h1>
//           <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Manage transactions & refunds</p>
//         </div>
        
//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input 
//               type="text" 
//               placeholder="Search name, email, or ID..."
//               className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all w-64"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
//             <Filter className="w-4 h-4 text-gray-500" />
//           </button>
//         </div>
//       </div>

//       <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-gray-50/50 border-b border-gray-100">
//               <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order / Customer</th>
//               <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
//               <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
//               <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Method</th>
//               <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
//               <th className="px-6 py-4"></th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-50">
//             {data.map((txn: Transaction) => (
//               <tr 
//                 key={txn.id} 
//                 onClick={() => onSelect(txn)}
//                 className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
//               >
//                 <td className="px-6 py-5">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs">
//                       {txn.customerName.charAt(0)}
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">#{txn.id}</p>
//                       <p className="text-[11px] text-gray-400 font-medium">{txn.email}</p>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-5 text-sm font-medium text-gray-600">{txn.date}</td>
//                 <td className="px-6 py-5 font-bold text-gray-900 text-sm">₹{txn.amount.toLocaleString()}</td>
//                 <td className="px-6 py-5">
//                   <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${txn.method === 'Online' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
//                     {txn.method}
//                   </span>
//                 </td>
//                 <td className="px-6 py-5">
//                   <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter ${
//                     txn.status === 'completed' ? 'text-green-500' : txn.status === 'refunded' ? 'text-amber-500' : 'text-blue-500'
//                   }`}>
//                     <span className={`w-1.5 h-1.5 rounded-full ${
//                       txn.status === 'completed' ? 'bg-green-500' : txn.status === 'refunded' ? 'bg-amber-500' : 'bg-blue-500'
//                     }`} />
//                     {txn.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-5 text-right">
//                   <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// // --- SUB-COMPONENT: DETAILS VIEW ---
// function PaymentDetailsView({ transaction }: { transaction: Transaction }) {
//   const InfoCard = ({ icon: Icon, label, value, subValue }: any) => (
//     <div className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
//       <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
//         <Icon className="w-5 h-5 text-gray-400" />
//       </div>
//       <div>
//         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
//         <p className="text-sm font-bold text-gray-900">{value}</p>
//         {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
//       </div>
//     </div>
//   )

//   return (
//     <div className="max-w-6xl mx-auto space-y-8 pb-12">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">ORDER #{transaction.id}</span>
//             <span className="text-gray-300">•</span>
//             <span className="text-xs text-gray-400">{transaction.date}, 04:30 PM</span>
//           </div>
//           <h1 className="text-2xl font-black text-gray-900">Payment Transaction</h1>
//         </div>

//         <div className={`flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-sm
//             ${transaction.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' : 
//               transaction.status === 'refunded' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
//               'bg-blue-50 text-blue-600 border-blue-100'}`}>
//           {transaction.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
//           {transaction.status.toUpperCase()}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-6">
//           {/* Customer Profile */}
//           <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
//             <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
//               <User className="w-5 h-5 text-green-500" /> Customer Information
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-400">
//                   {transaction.customerName.charAt(0)}
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-gray-900">{transaction.customerName}</p>
//                   <p className="text-xs text-gray-500 flex items-center gap-1">
//                     <Mail className="w-3 h-3" /> {transaction.email}
//                   </p>
//                 </div>
//               </div>
//               <div>
//                 <p className="text-[10px] font-bold text-gray-400 uppercase">Billing Address</p>
//                 <p className="text-xs text-gray-600">123 Tech Avenue, Silicon Valley, CA - 94027</p>
//               </div>
//             </div>
//           </div>

//           {/* Payment Method Details */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className={`rounded-[32px] p-6 text-white overflow-hidden relative group shadow-lg ${transaction.method === 'Online' ? 'bg-gray-900' : 'bg-amber-600'}`}>
//               <div className="relative z-10">
//                 <div className="flex justify-between items-start mb-12">
//                   {transaction.method === 'Online' ? <CreditCard className="w-8 h-8 text-white/40" /> : <Truck className="w-8 h-8 text-white/40" />}
//                   <p className="text-xs font-bold text-white/50 tracking-widest uppercase">Method: {transaction.method}</p>
//                 </div>
//                 <p className="text-xl font-mono mb-2 tracking-widest">
//                   {transaction.method === 'Online' ? "**** **** **** 4421" : "Pay on Delivery"}
//                 </p>
//                 <p className="text-[10px] text-white/40 uppercase">Transaction ID</p>
//                 <p className="text-sm font-semibold uppercase">{transaction.txnId}</p>
//               </div>
//               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
//             </div>

//             <div className="bg-white border border-gray-100 rounded-[32px] p-6 flex flex-col justify-center">
//               <p className="text-sm font-bold text-gray-900 mb-2">Internal Notes</p>
//               <p className="text-xs text-gray-400 leading-relaxed italic">"Verified customer. Package ready for shipping."</p>
//             </div>
//           </div>

//           {/* Action Panel */}
//           <div className="bg-white border border-gray-100 rounded-[32px] p-8">
//             <h3 className="text-sm font-bold text-gray-900 mb-6">Payment Actions</h3>
//             <div className="flex flex-wrap gap-4">
//               <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-50 text-amber-700 font-bold text-sm hover:bg-amber-100 transition-all">
//                 <RefreshCcw className="w-4 h-4" /> Initiate Refund
//               </button>
//               <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-50 text-red-700 font-bold text-sm hover:bg-red-100 transition-all">
//                 <Undo2 className="w-4 h-4" /> Mark as Returned
//               </button>
//               <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-50 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-all">
//                 <Receipt className="w-4 h-4" /> Download Invoice
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Right Column Summary */}
//         <div className="space-y-6">
//           <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
//             <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
//             <div className="space-y-4">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-400">Subtotal</span>
//                 <span className="font-semibold text-gray-900">₹{(transaction.amount * 0.82).toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-400">Tax (GST 18%)</span>
//                 <span className="font-semibold text-gray-900">₹{(transaction.amount * 0.18).toFixed(2)}</span>
//               </div>
//               <div className="h-px bg-gray-100 my-4" />
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-bold text-gray-900">Total Paid</span>
//                 <span className="text-2xl font-black text-gray-900 tracking-tight">₹{transaction.amount.toLocaleString()}</span>
//               </div>
//             </div>
//           </div>

//           <InfoCard icon={IndianRupee} label="Payment Gateway" value="Razorpay" subValue="Settled in T+2" />
//           <InfoCard icon={ShieldCheck} label="Fraud Status" value="Low Risk" subValue="IP: 192.168.1.1" />
//         </div>
//       </div>
//     </div>
//   )
// }