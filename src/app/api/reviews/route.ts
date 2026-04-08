import connectDB from '@/lib/db';
import Review from '@/models/review.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const groceryId = searchParams.get('groceryId');
    const all       = searchParams.get('all');

    let reviews;

    if (all === 'true') {
      // Admin: all reviews with user info populated
      reviews = await Review.find({})
        .populate('userId', 'name email mobile image')
        .sort({ createdAt: -1 })
        .lean();
    } else if (groceryId) {
      // Product page: reviews for one product
      reviews = await Review.find({ groceryId })
        .populate('userId', 'name email image')
        .sort({ createdAt: -1 })
        .lean();
    } else {
      return NextResponse.json(
        { success: false, message: 'Provide groceryId or all=true' },
        { status: 400 }
      );
    }

    const serialized = JSON.parse(JSON.stringify(reviews));

    return NextResponse.json(
      { success: true, reviews: serialized, total: serialized.length },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/reviews  → submit a review
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId, groceryId, rating, comment } = await req.json();

    if (!userId || !groceryId || !rating || !comment) {
      return NextResponse.json(
        { success: false, message: 'userId, groceryId, rating, comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Upsert: update if already reviewed, create if not
    const review = await Review.findOneAndUpdate(
      { userId, groceryId },
      { rating, comment },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate('userId', 'name email image');

    return NextResponse.json(
      { success: true, review: JSON.parse(JSON.stringify(review)) },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews?id=xxx  → admin delete
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const id = new URL(req.url).searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Review ID required' }, { status: 400 });
    }

    await Review.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}