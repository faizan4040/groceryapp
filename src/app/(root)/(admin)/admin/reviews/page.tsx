'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Star, Trash2, RefreshCcw, Search, AlertCircle,
  MessageSquare, User, Mail, Phone
} from 'lucide-react'
import axios from 'axios'

interface Review {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
    mobile?: string
    image?: string
  }
  groceryId: string
  rating: number
  comment: string
  createdAt: string
}

export default function Reviews() {
  const [reviews, setReviews]     = useState<Review[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [searchTerm, setSearch]   = useState('')
  const [deletingId, setDeleting] = useState<string | null>(null)

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/reviews?all=true')
      setReviews(data.reviews || [])
      setError(null)
    } catch {
      setError('Failed to load reviews.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchReviews() }, [fetchReviews])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return
    setDeleting(id)
    try {
      await axios.delete(`/api/reviews?id=${id}`)
      setReviews(prev => prev.filter(r => r._id !== id))
    } catch {
      alert('Failed to delete review.')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = reviews.filter(r =>
    r.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0'

  const StarDisplay = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Reviews</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
              Customer Feedback
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, email, review..."
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all w-full md:w-72"
                value={searchTerm}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={fetchReviews}
              className="p-2.5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all"
            >
              <RefreshCcw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Reviews', value: reviews.length },
            { label: 'Avg Rating',    value: `${avgRating} ★` },
            { label: '5-Star Reviews', value: reviews.filter(r => r.rating === 5).length },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-[24px] border border-gray-100 p-5 text-center shadow-sm">
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-175">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {['Customer', 'Contact', 'Rating', 'Review', 'Date', ''].map(h => (
                  <th key={h} className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-5">
                      <div className="h-8 bg-gray-100 rounded-xl w-full" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400 font-medium">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                filtered.map(review => (
                  <tr key={review._id} className="hover:bg-gray-50/50 transition-colors group">
                    {/* Customer */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {review.userId?.image
                            ? <img src={review.userId.image} className="w-9 h-9 rounded-xl object-cover" />
                            : review.userId?.name?.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                          {review.userId?.name || 'Unknown'}
                        </p>
                      </div>
                    </td>
                    {/* Contact */}
                    <td className="px-6 py-5">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {review.userId?.email || '—'}
                      </p>
                      {review.userId?.mobile && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3" /> {review.userId.mobile}
                        </p>
                      )}
                    </td>
                    {/* Rating */}
                    <td className="px-6 py-5">
                      <StarDisplay rating={review.rating} />
                      <p className="text-xs text-gray-400 mt-1 font-bold">{review.rating}/5</p>
                    </td>
                    {/* Review text */}
                    <td className="px-6 py-5 max-w-xs">
                      <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                    </td>
                    {/* Date */}
                    <td className="px-6 py-5 text-sm text-gray-400 font-medium whitespace-nowrap">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    {/* Delete */}
                    <td className="px-6 py-5">
                      <button
                        onClick={() => handleDelete(review._id)}
                        disabled={deletingId === review._id}
                        className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 active:scale-95 transition-all disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}