import ordersModel from "./orders.model";

export async function createOrder(req, res) {
  try {
    const product = req.body;
    req.body.isDisable = "false";
    const document = await ordersModel.create(product);
    res.status(201).json(document);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function getOrder(req, res) {
  try {
    const id = req.params.id;
    const document = await ordersModel.findOne({
      _id: id,
      isDisable: false,
    });
    document ? res.status(200).json(document) : res.sendStatus(404);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function getOrders(req, res) {
  try {
    const user = req.query.userID;
    const restID = req.query.restaurantID;
    const Date1 = req.query.Date1;
    const Date2 = req.query.Date2;
    const query = { 
      isDisable: false,
      ...(Date1 && Date2 && {createdAt:{$gte: new Date(Date1), $lt: new Date(Date2)}})
     };
    if (restID) {
      query.restaurantID = restID;
    }
    if (user) {
      query.userID = user;
    }
    
    const document = await productsModel.find(query);
    document.length > 0 ? res.status(200).json(document) : res.sendStatus(404);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function getOrderssended(req, res) {
  try {
    const document = await ordersModel.find({
      isDisable: false,
      status: "Enviado"
    });
    document ? res.status(200).json(document) : res.sendStatus(404);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function UpdateOrder(req, res) {
  try {
    const id = req.params.id;
    const document = await ordersModel.findOneAndUpdate(
      { _id: id, isDisable: false, status: "Creado" },
      req.body,
      { runValidators: true }
    );
    document ? res.status(200).json("changes applied") : res.sendStatus(404);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function DeleteOrder(req, res) {
  try {
    const id = req.params.id;
    const document = await ordersModel.findByIdAndUpdate(id, {
      isDisable: true,
    });
    document ? res.status(200).json("changes applied") : res.sendStatus(404);
  } catch (err) {
    res.status(500).json(err.message);
  }
}
