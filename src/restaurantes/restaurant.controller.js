import restaurantModel from "./restaurant.model.js";
import Users from "../users/users.model.js";

const llave = "padillachristian";

export async function createRestaurant(req, res) {
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
    if (decoded.mode != "administrador de restaurante") {
      res.status(401).json("No tiene permiso para crear restaurantes");
    } else {
      const user = await Users.findById(decoded.IdUsuario);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      const otp = twofactor.generateToken(user.twofactorSecret);
      console.log("Código OTP generado:", otp);

      const isValid = twofactor.verifyToken(user.twofactorSecret, otp);
      if (isValid) {
        product.idAdministrador = decoded.IdUsuario;
        const document = await restaurantModel.create(product);
        res.status(201).json(document);
      } else {
        res.status(200).json("Código OTP invalido");
      }
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function getRestaurant(req, res) {
  try {
    const id = req.params.id;
    const document = await restaurantModel.findOne({
      _id: id,
      isDisable: false,
    });
    document ? res.status(200).json(document) : res.sendStatus(404);
  } catch (err) {
    res.status(500).json(err.message);
  }
}
export async function getRestaurants(req, res) {
  try {
    const cat = req.query.category;
    const name = req.query.name;
    const query = { isDisable: false };
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }
    if (cat) {
      query.category = { $in: cat.split(",") };
    }
    const document = await restaurantModel.find(query);
    document.length > 0 ? res.status(200).json(document) : res.sendStatus(404);
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function UpdateRestaurant(req, res) {
  try {
    const id = req.params.id;

    const token = req.headers.authorization;
    let decoded;
    try {
      decoded = jwt.verify(token, llave);
    } catch (err) {
      res.status(401).json("Token invalido");
    }

    const document1 = await restaurantModel.findOne({
      _id: id,
      isDisable: false,
    });

    if (document1.idAdministrador == decoded.IdUsuario) {
      const user = await Users.findById(decoded.IdUsuario);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      const otp = twofactor.generateToken(user.twofactorSecret);
      console.log("Código OTP generado:", otp);

      const isValid = twofactor.verifyToken(user.twofactorSecret, otp);
      if (isValid) {
        const document = await restaurantModel.findOneAndUpdate(
          { _id: id, isDisable: false },
          req.body,
          {
            runValidators: true,
          }
        );
        document
          ? res.status(200).json("changes applied")
          : res.sendStatus(404);
      } else {
        res.status(200).json("Código OTP invalido");
      }
    } else {
      res.status(401).json("No tiene permiso para modificar restaurantes");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function DeleteRestaurant(req, res) {
  try {
    const id = req.params.id;

    const token = req.headers.authorization;
    let decoded;
    try {
      decoded = jwt.verify(token, llave);
    } catch (err) {
      res.status(401).json("Token invalido");
    }

    const document1 = await restaurantModel.findOne({
      _id: id,
      isDisable: false,
    });

    if (document1.idAdministrador == decoded.IdUsuario) {
      const user = await Users.findById(decoded.IdUsuario);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      const otp = twofactor.generateToken(user.twofactorSecret);
      console.log("Código OTP generado:", otp);

      const isValid = twofactor.verifyToken(user.twofactorSecret, otp);
      if (isValid) {
        const document = await restaurantModel.findByIdAndUpdate(id, {
          isDisable: true,
        });
        document
          ? res.status(200).json("changes applied")
          : res.sendStatus(404);
      } else {
        res.status(200).json("Código OTP invalido");
      }
    } else {
      res.status(401).json("No tiene permiso para eliminar restaurantes");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
}
