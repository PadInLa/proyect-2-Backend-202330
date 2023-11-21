import restaurantModel from "./restaurant.model";

export async function createRestaurant(req, res) {
  try {
    const product = req.body;
    req.body.isDisable = "false";
    const document = await restaurantModel.create(product);
    res.status(201).json(document);
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
      query.name = {$regex: name, $options: 'i'};
    }
    if (cat) {
      query.category = {$in: cat.split(",")};
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
    const document = await restaurantModel.findOneAndUpdate(
      { _id: id, isDisable: false },
      req.body,
      {
        runValidators: true,
      }
    );
    document ? res.status(200).json("changes applied") : res.sendStatus(404);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function DeleteRestaurant(req, res) {
  try {
    const id = req.params.id;
    const document = await restaurantModel.findByIdAndUpdate(id, {
      isDisable: true,
    });
    document ? res.status(200).json("changes applied") : res.sendStatus(404);
  } catch (err) {
    res.status(500).json(err.message);
  }
}
