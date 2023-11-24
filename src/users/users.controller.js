import Users from "./users.model";
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const llave = "padillachristian";
const twofactor = require("node-2fa");

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
    const usuario = await Users.findOne({email: email, isDisable: false});
    if(usuario && await argon2.verify(usuario.password, pass)){
      const token = jwt.sign({IdUsuario: usuario._id, mode: usuario.mode}, llave);
      response ? res.status(200).json(token) : res.sendStatus(404);
    }
    response ? res.status(404).json("Usuario no encontrado") : res.sendStatus(404);

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
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const otp = twofactor.generateToken(user.twofactorSecret);
    console.log('Código OTP generado:', otp);

    const isValid = twofactor.verifyToken(user.twofactorSecret, otp);
    if (isValid) {
      const document = await Users.findOneAndUpdate(
        { _id: decoded.IdUsuario, isDisable: false },
        req.body,
        { runValidators: true }
      );
      document ? res.status(200).json("changes applied") : res.sendStatus(404);
    }else{
      res.status(200).json("Código OTP invalido");
    }

    
  } catch (err) {
    res.status(200).json(err.message);
  }
}

export async function deleteUser(req, res) {
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
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const otp = twofactor.generateToken(user.twofactorSecret);
    console.log('Código OTP generado:', otp);

    const isValid = twofactor.verifyToken(user.twofactorSecret, otp);
    if (isValid) {
      const document = await Users.findByIdAndUpdate(decoded.IdUsuario, { isDisable: true });
      document ? res.status(200).json("changes applied") : res.sendStatus(404);
    }else{
      res.status(200).json("Código OTP invalido");
    }
  } catch (err) {
    res.status(200).json(err.message);
  }
}
