const Product = require("../models/productModels");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncerror = require("../middleware/catchAsyncerror");

//create Product -Admin
exports.createProduct = catchAsyncerror(async (req, res, next) => {
  req.body.user = req.user.id; //this line tell us the person id who added the products
  const product = await Product.create(req.body);

  res.status(201).send({
    success: true,
    product,
  });
});

//Get All Products -User
exports.getAllProducts = catchAsyncerror(async (req, res) => {
  const productCount = await Product.countDocuments();
  const { category, q, page, limit, input, sortBy, price } = req.query;
  const price_low = req.query.price_low;
  const price_high = req.query.price_high;
  
  if (category&&price_low && price_high) {
    let products = await Product.find({
      $and: [{category:category}, { price: { $gte: price_low } }, { price: { $lte: price_high } }],
    })
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).send({
      success: true,
      products,
    });
  }else if (price_low && price_high) {
    let products = await Product.find({
      $and: [{ price: { $gte: price_low } }, { price: { $lte: price_high } }],
    })
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).send({
      success: true,
      products,
    });
  } else if (price_low) {
    let products = await Product.find({
      $and: [{ price: { $lt: price_low } }],
    })
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).send({
      success: true,
      products,
    });
  } else if (price_high) {
    let products = await Product.find({
      $and: [{ price: { $gt: price_high } }],
    })
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).send({
      success: true,
      products,
    });
  } else if (category && q) {
    let temp = new RegExp(q, "i");
    let products = await Product.find({
      $and: [{ name: temp }, { category: category }],
    })
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).send({
      success: true,
      products,
    });
  } else if (category) {
    let products = await Product.find({
      category: category,
    })
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).send({
      success: true,
      products,
    });
  } else if ( price) {
    if (price === "asc") {
      let products = await Product.find()
        .sort({
          price: 1,
        })
        .skip((page - 1) * limit)
        .limit(limit);
      res.status(200).send({
        success: true,
        products,
      });
    } else if (price === "desc") {
      let products = await Product.find()
        .sort({
          price: -1,
        })
        .skip((page - 1) * limit)
        .limit(limit);
      res.status(200).send({
        success: true,
        products,
      });
    }
  } else if (q) {
    const products = await Product.find({
      name: { $regex: q, $options: "i" },
    });
    res.status(200).send({
      success: true,
      products,
    });
  } else {
    let products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).send({
      success: true,
      products,
      productCount,
    });
  }
});

//Get Product detail -User
exports.getSingleProduct = catchAsyncerror(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).send({
    success: true,
    product,
  });
});

//update Products --Admin
exports.updateProduct = catchAsyncerror(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
    // return res.status(500)({
    //   sucess: false,
    //   message: "Product not found",
    // });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  return res.status(200).send({
    sucess: true,
    product,
  });
});

//delete --admin
exports.deleteProduct = catchAsyncerror(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // await Product.findByIdAndDelete(req.params.id)
  await product.remove();
  return res.status(200).send({
    sucess: true,
    message: "Product deleted sucessfully",
  });
});

//create Review or update the review
exports.createProductReview = catchAsyncerror(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (res) => res.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((res) => {
      if (res.user.toString() === req.user._id.toString()) {
        (res.rating = rating), (res.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).send({
    success: true,
  });
});

//Get product review
exports.getAllProductReview = catchAsyncerror(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).send({
    success: true,
    reviews: product.reviews,
  });
});

//delete product review
exports.deleteProductReview = catchAsyncerror(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).send({
    success: true,
    message: "Review deleted",
  });
});
