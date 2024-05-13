const Category = require("../models/category.model");
const Product = require("../models/product.model");

// Create a new product
async function createProduct(reqData) {
  const product = new Product({
    title: reqData.title,
    color: reqData.color,
    description: reqData.description,
    variations: reqData.variations,
    quantity: reqData.quantity,
    category: reqData.category,
    slug: reqData.slug,
    height: reqData.height,
    width: reqData.width,
    materials: reqData.materials,
  });

  const savedProduct = await product.save();

  return savedProduct;
}
// Delete a product by ID
async function deleteProduct(productId) {
  const product = await findProductById(productId);

  if (!product) {
    throw new Error("product not found with id - : ", productId);
  }

  await Product.findByIdAndDelete(productId);

  return "Product deleted Successfully";
}

// Update a product by ID
async function updateProduct(productId, reqData) {
  const updatedProduct = await Product.findByIdAndUpdate(productId, reqData);
  return updatedProduct;
}

// Find a product by ID
async function findProductById(id) {
  const product = await Product.findById(id).populate("category").exec();

  if (!product) {
    throw new Error("Product not found with id " + id);
  }
  return product;
}

// Get all products with filtering and pagination
async function getAllProducts(reqQuery) {
  let {
    category,
    brand,
    color,
    sizes,
    minPrice,
    maxPrice,
    sort,
    stock,
    pageNumber,
    pageSize,
  } = reqQuery;
  (pageSize = pageSize || 50), (pageNumber = pageNumber || 1);
  let query = Product.find().populate("category");

  if (!brand == null) {
    query = Product.find({ brand: brand })
  }
  if (category) {
    const existCategory = await Product.find({ category: category });
    return existCategory
  }

  if (color) {
    const colorSet = new Set(color.split(",").map(color => color.trim().toLowerCase()));
    const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
    query = query.where("color").regex(colorRegex);
    // query = query.where("color").in([...colorSet]);
  }

  if (sizes) {
    const sizesSet = new Set(sizes);

    query = query.where("sizes.name").in([...sizesSet]);
  }

  if (minPrice && maxPrice) {
    query = query.where("discountedPrice").gte(minPrice).lte(maxPrice);
  }

  // if (minDiscount) {
  //   query = query.where("discountPersent").gt(minDiscount);
  // }

  if (stock) {
    if (stock === "in_stock") {
      query = query.where("quantity").gt(0);
    } else if (stock === "out_of_stock") {
      query = query.where("quantity").lte(0);
    }
  }

  if (sort) {
    const sortDirection = sort === "price_high" ? -1 : 1;
    query = query.sort({ discountedPrice: sortDirection });
  }

  // Apply pagination
  const totalProducts = await Product.countDocuments(query);

  const skip = (pageNumber - 1) * pageSize;

  query = query.skip(skip).limit(pageSize);

  const products = await query.exec();

  const totalPages = Math.ceil(totalProducts / pageSize);


  return { content: products, currentPage: pageNumber, totalPages: totalPages };
}

async function createMultipleProduct(products) {
  for (let product of products) {
    await createProduct(product);
  }
}

const updateproductvariations = async (req, res) => {
  const { product_Id, variationId, images, style, price, discountedPrice } = req.body

  try {

    const product = await Product.findById(product_Id);
    let variation = product.variations.find(obj => obj._id == variationId)
    const index = product.variations.indexOf(variation);

    product.variations[index].discountedPrice = discountedPrice || product.variations[index].discountedPrice
    product.variations[index].price = price || product.variations[index].price
    product.variations[index].images = images || product.variations[index].images
    product.variations[index].style = style || product.variations[index].style
    await product.save()
    res.status(200).send({ success: true })
  } catch (error) {
    res.status(500).send(error)

  }
}
const addproductvariations = async (req, res) => {
  try {
    const { product_Id, images, style, price, discountedPrice } = req.body
    const product = await Product.findById(product_Id);
    const newvariation = {
      images: images,
      style: style,
      price: price,
      discountedPrice: discountedPrice
    }
    product.variations.push(newvariation);
    await product.save();
    res.status(200).send({ success: true })
  } catch (error) {
    res.status(500).send(error)
  }
}
const deleteproductvariations = async (req, res) => {
  try {
    const { product_Id, variationId, } = req.body
    const product = await Product.findById(product_Id);
    let variation = product.variations.find(obj => obj._id == variationId)
    const index = product.variations.indexOf(variation);
    product.variations.splice(index, 1)
    await product.save();
    res.status(200).send({ success: true })
  } catch (error) {
    res.status(500).send(error)
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  createMultipleProduct,
  updateproductvariations,
  addproductvariations,
  deleteproductvariations
};
