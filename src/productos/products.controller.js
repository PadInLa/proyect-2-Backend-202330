import productsModel from "./products.model";
import restaurantModel from "./restaurantes/restaurant.model";

const llave = "padillachristian";


export async function createProduct(req, res) {
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

    const document1 = await restaurantModel.findOne({
      _id: product.restaurantID,
      isDisable: false,
    });

    if(document1.idAdministrador == decoded.IdUsuario){
      const document2 = await productsModel.create(product);
      res.status(201).json(document2);
    }else{  
      res.status(401).json("No tiene permiso para crear productos");
    }

  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function getProduct(req, res) {
  try {
    const id = req.params.id;
    const document = await productsModel.findOne({ _id: id, isDisable: false });
    document ? res.status(200).json(document) : res.sendStatus(404);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function getproducts(req, res) {
  try {
    const cat = req.query.category;
    const restID = req.query.restaurantID;
    const query = { isDisable: false };
    if (restID) {
      query.restaurant = restID;
    }
    if (cat) {
      query.category = {$in: cat.split(",")};
    }
    const document = await productsModel.find(query);
    document.length > 0 ? res.status(200).json(document) : res.sendStatus(404);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function UpdateProduct(req, res) {
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

    if(document1.idAdministrador == decoded.IdUsuario){
      const document = await productsModel.findOneAndUpdate(
        { _id: id, isDisable: false },
        req.body,
        { runValidators: true }
      );
      document ? res.status(200).json("changes applied") : res.sendStatus(404);
    }else{  
      res.status(401).json("No tiene permiso para cambiar productos");
    }

  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function DeleteProduct(req, res) {
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

    if(document1.idAdministrador == decoded.IdUsuario){
      const document = await productsModel.findByIdAndUpdate(id, {
        isDisable: true,
      });
      document ? res.status(200).json("changes applied") : res.sendStatus(404);
    }else{  
      res.status(401).json("No tiene permiso para eliminar productos");
    }
    
  } catch (err) {
    res.status(500).json(err.message);
  }
}
