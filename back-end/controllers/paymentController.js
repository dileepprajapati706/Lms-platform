const paymentService = require("../services/paymentService");
const sendResponse = require("../utils/responseHandler");

const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    return sendResponse(res, 200, true, "All payments fetched", payments);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getMyPayments = async (req, res) => {
  try {
    const payments = await paymentService.getPaymentsByLearner(req.user._id);
    return sendResponse(res, 200, true, "My payments fetched", payments);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    return sendResponse(res, 200, true, "Payment fetched", payment);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

module.exports = {
  getAllPayments,
  getMyPayments,
  getPaymentById,
};