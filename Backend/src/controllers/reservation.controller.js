const Reservation = require("../models/reservation.model");
const Restaurant = require("../models/restaurant.model");
const Table = require("../models/table.model");

exports.createReservation = async (req, res, next) => {
  try {
    const {
      restaurant: restaurantId,
      table: tableId,
      date,
      time,
      partySize,
    } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || restaurant.status !== "approved") {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    const table = await Table.findById(tableId);
    if (
      !table ||
      table.restaurant.toString() !== restaurantId.toString() ||
      !table.isActive
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or inactive table selected",
        });
    }

    if (table.capacity < partySize) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Table capacity is smaller than party size",
        });
    }

    // Check for overlapping reservations (2-hour window)
    const requestedDateTime = new Date(`${date}T${time}`);
    const twoHoursBefore = new Date(
      requestedDateTime.getTime() - 2 * 60 * 60 * 1000,
    );
    const twoHoursAfter = new Date(
      requestedDateTime.getTime() + 2 * 60 * 60 * 1000,
    );

    const overlappingReservation = await Reservation.findOne({
      table: tableId,
      status: { $in: ["pending", "confirmed"] },
      $expr: {
        $and: [
          {
            $gt: [
              {
                $dateFromString: {
                  dateString: {
                    $concat: [
                      { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                      "T",
                      "$time",
                    ],
                  },
                },
              },
              twoHoursBefore,
            ],
          },
          {
            $lt: [
              {
                $dateFromString: {
                  dateString: {
                    $concat: [
                      { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                      "T",
                      "$time",
                    ],
                  },
                },
              },
              twoHoursAfter,
            ],
          },
        ],
      },
    });

    if (overlappingReservation) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Table is already booked during this time window",
        });
    }

    const reservation = await Reservation.create({
      ...req.body,
      customer: req.user._id,
    });
    res.status(201).json({ success: true, data: reservation });
  } catch (err) {
    next(err);
  }
};

exports.getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ customer: req.user._id })
      .populate("restaurant", "name address")
      .sort("-date");
    res.status(200).json({ success: true, data: reservations });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/reservations/restaurant/:restaurantId
// Owner gets reservations for their restaurant
exports.getRestaurantReservations = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }
    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }

    const { status, date } = req.query;
    const filter = { restaurant: req.params.restaurantId };
    if (status) filter.status = status;
    if (date) filter.date = new Date(date);

    const reservations = await Reservation.find(filter)
      .populate("customer", "name email phone")
      .populate("table", "tableNumber capacity")
      .sort("-date");
    res.status(200).json({ success: true, count: reservations.length, data: reservations });
  } catch (err) {
    next(err);
  }
};

exports.updateReservationStatus = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate(
      "restaurant",
    );
    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });
    }
    if (
      reservation.restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }
    reservation.status = req.body.status;
    await reservation.save();
    res.status(200).json({ success: true, data: reservation });
  } catch (err) {
    next(err);
  }
};

exports.cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });
    }
    if (reservation.customer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    }
    if (["cancelled", "completed"].includes(reservation.status)) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot cancel this reservation" });
    }
    reservation.status = "cancelled";
    await reservation.save();
    res.status(200).json({ success: true, message: "Reservation cancelled" });
  } catch (err) {
    next(err);
  }
};
