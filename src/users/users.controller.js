import Users from "./users.model";

export async function createUser(req, res) {
  try {
    const user = req.body;
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
    const response = await Users.findOne({
      email: email,
      password: pass,
      isDisable: false,
    });
    response ? res.status(200).json(response) : res.sendStatus(404);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function patchUser(req, res) {
  try {
    const id = req.params.id;
    const document = await Users.findOneAndUpdate(
      { _id: id, isDisable: false },
      req.body,
      { runValidators: true }
    );
    document ? res.status(200).json("changes applied") : res.sendStatus(404);
  } catch (err) {
    res.status(200).json(err.message);
  }
}

export async function deleteUser(req, res) {
  try {
    const id = req.params.id;
    const document = await Users.findByIdAndUpdate(id, { isDisable: true });
    document ? res.status(200).json("changes applied") : res.sendStatus(404);
  } catch (err) {
    res.status(200).json(err.message);
  }
}
