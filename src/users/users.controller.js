import Users from "./users.model.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import twofactor from "node-2fa";

const llave = "padillachristian";

export async function createUser(req, res) {
  try {
    const user = req.body;
    const hashedPassword = await argon2.hash(user.password);
    user.password = hashedPassword;
    const { secret } = twofactor.generateSecret();
    user.twofactorSecret = secret;
    req.body.isDisable = "false";

    const document = await Users.create(user);
    res.status(201).json(document);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function getUserbyID(req, res) {
  try {
    const filter = req.params.number;
    const value = await Users.findOne({ _id: id, isDisable: false });
    value ? res.status(200).json(value) : res.sendStatus(404);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function getUserbyName_pass(req, res) {
  try {
    const { email, pass } = req.params;
    const usuario = await Users.findOne({ email: email, isDisable: false });
    console.log(await argon2.verify(usuario.password, pass));
    if (usuario && (await argon2.verify(usuario.password, pass))) {
      if (usuario.mode == "administrador de restaurante") {
        const otp = twofactor.generateToken(usuario.twofactorSecret);

        const isValid = twofactor.verifyToken(usuario.twofactorSecret, otp.token);

        if (isValid && isValid.delta === 0) {
          const token = jwt.sign(
            { IdUsuario: usuario._id, mode: usuario.mode },
            llave
          );
          return res.status(200).json(token); // Añade 'return' aquí
        } else {
          return res.status(200).json("Código OTP inválido");
        }        
        
      }else{
        const token = jwt.sign(
          { IdUsuario: usuario._id, mode: usuario.mode },
          llave
        );
        res.status(200).json(token); 
      }
    }
    res.status(404).json("Usuario no encontrado"); 
  } catch (err) {
    res.status(500).json(err.message);
  }
}


export async function patchUser(req, res) {
  try {
    //const id = req.params.id;
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
      const document = await Users.findOneAndUpdate(
        { _id: decoded.IdUsuario, isDisable: false },
        req.body,
        { runValidators: true }
      );
      document ? res.status(200).json("changes applied") : res.sendStatus(404);
    } else {
      res.status(200).json("Código OTP invalido");
    }
  } catch (err) {
    res.status(200).json(err.message);
  }
}

export async function deleteUser(req, res) {
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
      const document = await Users.findByIdAndUpdate(decoded.IdUsuario, {
        isDisable: true,
      });
      document ? res.status(200).json("changes applied") : res.sendStatus(404);
    } else {
      res.status(200).json("Código OTP invalido");
    }
  } catch (err) {
    res.status(200).json(err.message);
  }
}
