
const Address = require("../models/address.model");
const User = require("../models/user.model");
const orderService = require("../services/order.service");

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    return res.status(202).send(orders);
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" });
  }
};
const getAllOrdersAddress = async (req, res) => {
  try {
    const address = await Address.find();
    return res.status(202).send(address);
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" });
  }
};
const getAllusers = async (req, res) => {
  try {
    const users = await User.find();
    return   res.status(202).send(users);
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" });
  }
};
const confirmedOrder = (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = orderService.confirmedOrder(orderId);
    res.status(202).json(order);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const shippOrder = (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = orderService.shipOrder(orderId);
    return res.status(202).send(order);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const deliverOrder = (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = orderService.deliveredOrder(orderId);
    return res.status(202).send(order);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const cancelledOrder = (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = orderService.cancelledOrder(orderId);
    return res.status(202).send(order);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteOrder = (req, res) => {
  try {
    const orderId = req.params.orderId;
    orderService.deleteOrder(orderId);
    res
      .status(202)
      .json({ message: "Order Deleted Successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};



module.exports = {
  getAllOrders,
  confirmedOrder,
  shippOrder,
  deliverOrder,
  cancelledOrder,
  deleteOrder,
  getAllOrdersAddress,
  getAllusers
};
