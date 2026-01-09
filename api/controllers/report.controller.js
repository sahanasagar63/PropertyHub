import Report from "../models/report.model.js";
import createError from "../utils/error.js";
import { sendAdminEmail } from "../utils/sendEmail.js";
import Listing from "../models/listing.model.js";

export const reportListing = async (req, res, next) => {
  try {
    const { reason, message } = req.body;

    if (!reason) {
      return next(createError(400, "Reason is required"));
    }

    const listing = await Listing.findById(req.params.listingId);
    if (!listing) return next(createError(404, "Listing not found"));

    await Report.create({
      listingRef: listing._id,
      reportedBy: req.user.id,
      reason,
      message,
    });

    await sendAdminEmail({
      subject: "🚨 PropertyHub | Abuse Report",
      html: `
        <h3>Abuse Report</h3>
        <p><b>Property:</b> ${listing.name}</p>
        <p><b>City:</b> ${listing.city}</p>
        <p><b>Reason:</b> ${reason}</p>
        <p><b>Message:</b> ${message || "N/A"}</p>
        <p><b>Listing ID:</b> ${listing._id}</p>
      `,
    });

    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
};