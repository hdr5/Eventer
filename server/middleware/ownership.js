import Event from "../models/event.js";

export const checkOwnership = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }
console.log('checkownership ----');

    req.event = event;

    next();
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};