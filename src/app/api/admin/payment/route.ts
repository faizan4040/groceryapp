import connectDB from '@/lib/db';
import Order from '@/models/order.model';
import User from '@/models/user.models';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Map Order fields → Payment UI fields
    const payments = await Promise.all(
      orders.map(async (order: any) => {
        // Try to get user email from User model
        let email = 'N/A';
        try {
          const user = await User.findById(order.userId).select('email').lean() as any;
          if (user?.email) email = user.email;
        } catch (_) {}

        return {
          _id: order._id.toString(),
          customerName: order.address?.fullName || 'Unknown',
          email,
          amount: order.totalAmount,
          createdAt: order.createdAt,
          status: order.isPaid
            ? 'completed'
            : order.status === 'cancelled'
            ? 'refunded'
            : 'pending',
          method: order.paymentMethod === 'online' ? 'Online' : 'COD',
          txnId: order.razorpayPaymentId || order.razorpayOrderId || order._id.toString().slice(-10).toUpperCase(),
          address: order.address?.fullAddress
            ? `${order.address.fullName}, ${order.address.fullAddress}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`
            : 'Address not provided',
          orderStatus: order.status,
          items: order.items || [],
        };
      })
    );

    return NextResponse.json(
      { success: true, payments, total: payments.length },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ message: 'Missing ID or Status' }, { status: 400 });
    }

    // Map UI status back to Order fields
    let updateFields: any = {};
    if (status === 'refunded') {
      updateFields = { status: 'cancelled', isPaid: false };
    } else if (status === 'completed') {
      updateFields = { isPaid: true };
    } else if (status === 'pending') {
      updateFields = { status: 'pending', isPaid: false };
    }

    const updated = await Order.findByIdAndUpdate(id, updateFields, { new: true }).lean() as any;

    if (!updated) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      payment: {
        _id: updated._id.toString(),
        status: updated.isPaid ? 'completed' : updated.status === 'cancelled' ? 'refunded' : 'pending',
      },
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}










// import connectDB from '@/lib/db';
// import { Payment } from '@/models/payments.model';
// import { NextResponse } from 'next/server';


// // GET: Fetch all payments for the Table
// export async function GET() {
//   try {
//     await connectDB();
    
//     // Use .populate('items') or .populate('orderId') 
//     // depending on how your schema is linked
//     const payments = await Payment.find()
//       .populate('cartItems') 
//       .sort({ createdAt: -1 });

//     return NextResponse.json({ success: true, payments }, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }

// // PATCH: Update status (Refund/Return logic)
// export async function PATCH(request: Request) {
//   try {
//     await connectDB();
//     const { id, status } = await request.json();

//     if (!id || !status) {
//       return NextResponse.json({ message: "Missing ID or Status" }, { status: 400 });
//     }

//     const updatedPayment = await Payment.findByIdAndUpdate(
//       id, 
//       { status }, 
//       { new: true }
//     );

//     return NextResponse.json({ 
//       success: true, 
//       payment: updatedPayment 
//     }, { status: 200 });

//   } catch (error: any) {
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }