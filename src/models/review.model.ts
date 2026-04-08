import mongoose, { Document, Schema, model, models } from 'mongoose';

export interface IReview extends Document {
  userId:     mongoose.Types.ObjectId;
  groceryId:  mongoose.Types.ObjectId;
  rating:     number;
  comment:    string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewSchema = new Schema<IReview>({
  userId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  groceryId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Grocery',
    required: true,
  },
  rating: {
    type:     Number,
    required: true,
    min:      1,
    max:      5,
  },
  comment: {
    type:     String,
    required: true,
    trim:     true,
    maxlength: 500,
  },
}, { timestamps: true });

// One review per user per product
ReviewSchema.index({ userId: 1, groceryId: 1 }, { unique: true });

const Review = models.Review || model<IReview>('Review', ReviewSchema);
export default Review;