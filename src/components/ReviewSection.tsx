'use client'

import axios from 'axios'
import {
  MessageSquare, Star, BadgeCheck,
  Sparkles, TrendingUp, ChevronDown, ChevronUp
} from 'lucide-react'
import { useEffect, useState } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  'from-violet-500 to-purple-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-600',
  'from-sky-400 to-blue-600',
  'from-fuchsia-400 to-pink-500',
]
const RATING_LABELS = ['', 'Terrible', 'Poor', 'Okay', 'Good', 'Excellent!']

// ─── Sub-components ───────────────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          className="transition-transform hover:scale-125 focus:outline-none"
        >
          <Star
            size={28}
            className={`transition-colors duration-150 ${
              i <= (hovered || value)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
      {(hovered || value) > 0 && (
        <span className="ml-1 text-sm font-semibold text-amber-600">
          {RATING_LABELS[hovered || value]}
        </span>
      )}
    </div>
  )
}

function StarDisplay({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-gray-200 text-gray-200'
          }
        />
      ))}
    </div>
  )
}

function RatingBar({
  stars, pct, count, active, onClick,
}: {
  stars: number; pct: number; count: number; active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 hover:opacity-100 transition-opacity"
    >
      <span className="text-xs font-bold text-gray-500 w-3 shrink-0">{stars}</span>
      <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            active
              ? 'bg-linear-to-r from-amber-400 to-orange-400'
              : 'bg-linear-to-r from-amber-300 to-amber-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-5 text-right shrink-0">{count}</span>
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ReviewSection({
  groceryId,
  userId,
}: {
  groceryId: string
  userId: string | null
}) {
  const [reviews, setReviews]       = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating]         = useState(0)
  const [comment, setComment]       = useState('')
  const [error, setError]           = useState<string | null>(null)
  const [success, setSuccess]       = useState(false)
  const [showForm, setShowForm]     = useState(false)
  const [filterStar, setFilterStar] = useState<number | null>(null)
  const [sortBy, setSortBy]         = useState<'recent' | 'rating'>('recent')

  // Fetch reviews from real API
  useEffect(() => {
    setLoading(true)
    axios
      .get(`/api/reviews?groceryId=${groceryId}`)
      .then((r) => setReviews(r.data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }, [groceryId])

  // Submit review to real API
  const handleSubmit = async () => {
    if (!userId)        { setError('Please login to submit a review.'); return }
    if (!rating)        { setError('Please select a star rating.'); return }
    if (!comment.trim()) { setError('Please write a comment.'); return }

    setSubmitting(true)
    setError(null)
    try {
      const { data } = await axios.post('/api/reviews', {
        userId, groceryId, rating, comment: comment.trim(),
      })
      // If user already reviewed, replace; else prepend
      setReviews((prev) => {
        const idx = prev.findIndex((r) => r.userId?._id === userId)
        if (idx >= 0) {
          const updated = [...prev]
          updated[idx] = data.review
          return updated
        }
        return [data.review, ...prev]
      })
      setSuccess(true)
      setRating(0)
      setComment('')
      setShowForm(false)
      setTimeout(() => setSuccess(false), 4000)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Derived stats ──────────────────────────────────────────
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const ratingDist = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length
    return {
      stars,
      count,
      pct: reviews.length ? Math.round((count / reviews.length) * 100) : 0,
    }
  })

  const sorted = [...reviews]
    .filter((r) => filterStar === null || r.rating === filterStar)
    .sort((a, b) =>
      sortBy === 'recent'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : b.rating - a.rating
    )

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { transform: scale(0.85); opacity: 0; }
          70%  { transform: scale(1.04); }
          100% { transform: scale(1);   opacity: 1; }
        }
        .rs-slide  { animation: slideDown 0.28s ease forwards; }
        .rs-pop    { animation: popIn 0.4s cubic-bezier(.34,1.56,.64,1) forwards; }
        .rs-card   { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .rs-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.09); }
        .rs-chip   { transition: all 0.15s ease; }
        .rs-chip:hover { transform: translateY(-1px); }
      `}</style>

      <section className="border-t pt-8 mt-2 space-y-6">

        {/* ── Section Header ──────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 rounded-full bg-linear-to-b from-green-400 to-emerald-600" />
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              Customer Reviews
            </h3>
            {reviews.length > 0 && (
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {reviews.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="rs-chip flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-4 py-2 rounded-xl"
          >
            <MessageSquare size={14} />
            Write a Review
            {showForm ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {/* ── Overview Card (only if reviews exist) ───────────── */}
        {reviews.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              {/* Big score */}
              <div className="flex flex-col items-center shrink-0">
                <span className="text-6xl font-black text-gray-900 leading-none">
                  {avgRating}
                </span>
                <div className="mt-1.5">
                  <StarDisplay rating={Math.round(Number(avgRating))} size={18} />
                </div>
                <span className="text-xs text-gray-400 mt-1.5 font-medium">
                  {reviews.length} {reviews.length === 1 ? 'rating' : 'ratings'}
                </span>
              </div>

              {/* Rating bars — click to filter */}
              <div className="flex-1 w-full space-y-2.5">
                {ratingDist.map(({ stars, count, pct }) => (
                  <RatingBar
                    key={stars}
                    stars={stars}
                    count={count}
                    pct={pct}
                    active={filterStar === stars}
                    onClick={() => setFilterStar(filterStar === stars ? null : stars)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Success Banner ───────────────────────────────────── */}
        {success && (
          <div className="rs-pop flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-3.5 text-green-800">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0 text-white font-bold">
              ✓
            </div>
            <div>
              <p className="font-bold text-sm">Review submitted!</p>
              <p className="text-xs text-green-600">Thank you for sharing your experience.</p>
            </div>
          </div>
        )}

        {/* ── Write Review Form ────────────────────────────────── */}
        {showForm && (
          <div className="rs-slide bg-linear-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-green-600" />
              <p className="text-sm font-bold text-gray-800">Share your experience</p>
            </div>

            {/* Star picker */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Your Rating
              </label>
              <StarPicker value={rating} onChange={setRating} />
            </div>

            {/* Comment */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Your Review
              </label>
              <textarea
                rows={3}
                placeholder="Share what you liked or didn't like about this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                className="w-full border border-green-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80"
              />
              <p className="text-xs text-gray-400 text-right mt-0.5">{comment.length}/500</p>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-500 font-semibold bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                ⚠️ {error}
              </p>
            )}

            {/* Login warning */}
            {!userId && (
              <p className="text-xs text-center text-amber-600 font-medium bg-amber-50 border border-amber-100 rounded-lg py-2">
                🔐 You must be logged in to submit a review.
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
                  boxShadow: '0 4px 14px rgba(22,163,74,0.35)',
                }}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <MessageSquare size={15} />
                    Submit Review
                  </>
                )}
              </button>
              <button
                onClick={() => { setShowForm(false); setError(null) }}
                className="text-sm text-gray-500 hover:text-gray-700 font-semibold px-4 py-3 rounded-xl hover:bg-white/60 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Sort / Filter bar ────────────────────────────────── */}
        {reviews.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
              <TrendingUp size={12} /> Sort:
            </span>
            {(['recent', 'rating'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                className={`rs-chip text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                  sortBy === opt
                    ? 'bg-green-600 text-white border-green-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                }`}
              >
                {opt === 'recent' ? '🕐 Most Recent' : '⭐ Top Rated'}
              </button>
            ))}
            {filterStar && (
              <button
                onClick={() => setFilterStar(null)}
                className="rs-chip text-xs font-semibold px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 flex items-center gap-1.5"
              >
                {filterStar}★ only
                <span className="font-bold">✕</span>
              </button>
            )}
          </div>
        )}

        {/* ── Reviews List ──────────────────────────────────────── */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-28" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-14 text-gray-400">
            <MessageSquare size={44} className="mx-auto mb-3 opacity-20" />
            <p className="font-semibold text-sm">
              {filterStar
                ? `No ${filterStar}-star reviews yet.`
                : 'No reviews yet. Be the first!'}
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 text-sm text-green-600 font-bold underline underline-offset-2"
              >
                Write a review →
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((review, idx) => {
              const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length]
              const name: string = review.userId?.name || 'User'
              const initial = name.charAt(0).toUpperCase()

              return (
                <div
                  key={review._id}
                  className="rs-card bg-white border border-gray-100 rounded-2xl p-4 space-y-3 shadow-sm"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-xl bg-linear-to-br ${colorClass} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm overflow-hidden`}
                      >
                        {review.userId?.image ? (
                          <img
                            src={review.userId.image}
                            alt={name}
                            className="w-9 h-9 object-cover"
                          />
                        ) : (
                          initial
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-gray-900 truncate">{name}</p>
                          {review.userId?._id && (
                            <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                              <BadgeCheck size={10} />
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Stars (right-aligned) */}
                    <div className="shrink-0">
                      <StarDisplay rating={review.rating} size={13} />
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}









// 'use client'
// import axios from 'axios';
// import { MessageSquare, Star } from 'lucide-react';
// import { useEffect, useState } from 'react'

// // Add this ReviewSection component in the same file or import it
// function ReviewSection({ groceryId, userId }: { groceryId: string; userId: string | null }) {
//   const [reviews, setReviews]       = useState<any[]>([])
//   const [loading, setLoading]       = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [rating, setRating]         = useState(0)
//   const [hovered, setHovered]       = useState(0)
//   const [comment, setComment]       = useState('')
//   const [error, setError]           = useState<string | null>(null)
//   const [success, setSuccess]       = useState(false)

//   useEffect(() => {
//     axios.get(`/api/reviews?groceryId=${groceryId}`)
//       .then(r => setReviews(r.data.reviews || []))
//       .finally(() => setLoading(false))
//   }, [groceryId])

//   const handleSubmit = async () => {
//     if (!userId)  { setError('Please login to submit a review.'); return }
//     if (!rating)  { setError('Please select a rating.'); return }
//     if (!comment.trim()) { setError('Please write a review.'); return }

//     setSubmitting(true)
//     setError(null)
//     try {
//       const { data } = await axios.post('/api/reviews', {
//         userId, groceryId, rating, comment: comment.trim()
//       })
//       setReviews(prev => {
//         const exists = prev.findIndex(r => r.userId?._id === userId)
//         if (exists >= 0) {
//           const updated = [...prev]
//           updated[exists] = data.review
//           return updated
//         }
//         return [data.review, ...prev]
//       })
//       setSuccess(true)
//       setRating(0)
//       setComment('')
//       setTimeout(() => setSuccess(false), 3000)
//     } catch (err: any) {
//       setError(err?.response?.data?.message || 'Failed to submit. Try again.')
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const avgRating = reviews.length
//     ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
//     : null

//   return (
//     <div className="border-t pt-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <h3 className="font-bold text-gray-800 text-lg">Customer Reviews</h3>
//         {avgRating && (
//           <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
//             <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
//             <span className="font-black text-amber-700 text-sm">{avgRating}</span>
//             <span className="text-amber-500 text-xs">({reviews.length})</span>
//           </div>
//         )}
//       </div>

//       {/* Write a review */}
//       <div className="bg-gray-50 rounded-2xl p-5 space-y-4 border border-gray-100">
//         <p className="text-sm font-semibold text-gray-700">Write a Review</p>

//         {/* Star picker */}
//         <div className="flex items-center gap-1">
//           {[1,2,3,4,5].map(i => (
//             <button
//               key={i}
//               onMouseEnter={() => setHovered(i)}
//               onMouseLeave={() => setHovered(0)}
//               onClick={() => setRating(i)}
//               className="transition-transform hover:scale-110"
//             >
//               <Star
//                 className={`w-7 h-7 transition-colors ${
//                   i <= (hovered || rating)
//                     ? 'fill-amber-400 text-amber-400'
//                     : 'fill-gray-200 text-gray-200'
//                 }`}
//               />
//             </button>
//           ))}
//           {rating > 0 && (
//             <span className="ml-2 text-sm text-gray-500 font-medium">
//               {['','Terrible','Poor','Okay','Good','Excellent'][rating]}
//             </span>
//           )}
//         </div>

//         {/* Comment */}
//         <textarea
//           rows={3}
//           placeholder="Share your experience with this product..."
//           value={comment}
//           onChange={e => setComment(e.target.value)}
//           maxLength={500}
//           className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
//         />
//         <div className="flex items-center justify-between">
//           <span className="text-xs text-gray-400">{comment.length}/500</span>
//           {error  && <p className="text-xs text-red-500 font-medium">{error}</p>}
//           {success && <p className="text-xs text-green-600 font-medium">✅ Review submitted!</p>}
//         </div>

//         <button
//           onClick={handleSubmit}
//           disabled={submitting}
//           className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//         >
//           <MessageSquare size={16} />
//           {submitting ? 'Submitting...' : 'Submit Review'}
//         </button>
//       </div>

//       {/* Reviews list */}
//       {loading ? (
//         <div className="space-y-3">
//           {[...Array(2)].map((_, i) => (
//             <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-24" />
//           ))}
//         </div>
//       ) : reviews.length === 0 ? (
//         <p className="text-sm text-gray-400 text-center py-8">
//           No reviews yet. Be the first to review!
//         </p>
//       ) : (
//         <div className="space-y-4">
//           {reviews.map(review => (
//             <div key={review._id} className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
//                     {review.userId?.image
//                       ? <img src={review.userId.image} className="w-8 h-8 rounded-xl object-cover" />
//                       : review.userId?.name?.charAt(0).toUpperCase()}
//                   </div>
//                   <div>
//                     <p className="text-sm font-bold text-gray-800">{review.userId?.name || 'User'}</p>
//                     <p className="text-xs text-gray-400">
//                       {new Date(review.createdAt).toLocaleDateString('en-IN', {
//                         day: 'numeric', month: 'short', year: 'numeric'
//                       })}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-0.5">
//                   {[1,2,3,4,5].map(i => (
//                     <Star
//                       key={i}
//                       className={`w-3.5 h-3.5 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
//                     />
//                   ))}
//                 </div>
//               </div>
//               <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }


// export default ReviewSection;