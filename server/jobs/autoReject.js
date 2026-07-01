import Order from "../models/Order.js";
import Payment from "../models/Payment.js";

export const autoRejectPendingPayments = async () => {
  try {
    console.log("Running auto reject pending payments job...");

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const orders = await Order.find({
      paymentStatus: "verification_pending",
      status: "placed",
      createdAt: {
        $lte: twentyFourHoursAgo,
      },
    });

    for (const order of orders) {
      // Update order
      order.paymentStatus = "failed";
      order.status = "cancelled";
      order.cancelledAt = new Date();

      order.paymentVerification = {
        rejectionReason: "Payment verification timeout (24 hours exceeded)",
        verifiedAt: new Date(),
      };

      order.adminNote =
        "Auto rejected because admin did not verify within 24 hours.";

      await order.save();

      // Update payment
      await Payment.updateOne(
        {
          order: order._id,
        },
        {
          status: "failed",
          failedAt: new Date(),
          rejectionReason: "Payment verification timeout (24 hours exceeded)",
        },
      );

      console.log(`Auto rejected order: ${order.orderNumber}`);
    }
  } catch (error) {
    console.error("Auto reject cron error:", error.message);
  }
};
