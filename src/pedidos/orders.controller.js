import ordersModel from "../pedidos/orders.model.js";
import Users from "../users/users.model.js";

const llave = "padillachristian";

export async function createOrder(req, res) {
  try {
    const product = req.body;
    req.body.isDisable = "false";

    const token = req.headers.authorization;
    let decoded;
    try {
      decoded = jwt.verify(token, llave);
    } catch (err) {
      res.status(401).json("Token invalido");
    }
    product.userID = decoded.IdUsuario;

    const user = await Users.findById(decoded.IdUsuario);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const otp = twofactor.generateToken(user.twofactorSecret);
    console.log("Código OTP generado:", otp);

    const isValid = twofactor.verifyToken(user.twofactorSecret, otp.token);
    if (isValid) {
      const document = await ordersModel.create(product);
      res.status(201).json(document);
    } else {
      res.status(200).json("Código OTP invalido");
    }
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
      ...(Date1 &&
        Date2 && {
          createdAt: { $gte: new Date(Date1), $lt: new Date(Date2) },
        }),
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
      status: "Enviado",
    });
    document ? res.status(200).json(document) : res.sendStatus(404);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function UpdateOrder(req, res) {
  try {
    const id = req.params.id;

    const token = req.headers.authorization;
    let decoded;
    try {
      decoded = jwt.verify(token, llave);
    } catch (err) {
      res.status(401).json("Token invalido");
    }

    const user = await Users.findById(decoded.IdUsuario);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const otp = twofactor.generateToken(user.twofactorSecret);
    console.log("Código OTP generado:", otp);

    const isValid = twofactor.verifyToken(user.twofactorSecret, otp.token);
    if (isValid) {
      const document = await ordersModel.findOneAndUpdate(
        {
          _id: id,
          userID: decoded.IdUsuario,
          isDisable: false,
          status: "Creado",
        },
        req.body,
        { runValidators: true }
      );
      document ? res.status(200).json("changes applied") : res.sendStatus(404);
    } else {
      res.status(200).json("Código OTP invalido");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function DeleteOrder(req, res) {
  try {
    const id = req.params.id;
    const token = req.headers.authorization;
    let decoded;
    try {
      decoded = jwt.verify(token, llave);
    } catch (err) {
      res.status(401).json("Token invalido");
    }
    const value = await ordersModel.findOne({ _id: id });
    if (value.userID == decoded.IdUsuario) {
      const user = await Users.findById(decoded.IdUsuario);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      const otp = twofactor.generateToken(user.twofactorSecret);
      console.log("Código OTP generado:", otp);

      const isValid = twofactor.verifyToken(user.twofactorSecret, otp.token);
      if (isValid) {
        const document = await ordersModel.findByIdAndUpdate(id, {
          isDisable: true,
        });

        document
          ? res.status(200).json("changes applied")
          : res.sendStatus(404);
      } else {
        res.status(200).json("Código OTP invalido");
      }
    } else {
      res.status(401).json("No tiene permiso para eliminar pedidos");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
}
