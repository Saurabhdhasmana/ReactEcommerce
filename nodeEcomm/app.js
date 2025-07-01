require("dotenv").config();
const express = require('express');
const path = require('path');
const connectToDb = require("./config/mongoose");
const { upload, cpUpload } = require("./middleware/multer");
const variantModel = require("./models/VariantModel");
const Product = require("./models/productModel");
const Coupon = require("./models/CouponModel");
const userModel = require("./models/userModel");
const Order = require("./models/OrderModel");
const OrderItem = require("./models/OrderItemModel");
const ComboProduct = require("./models/comboproductModel");
const Review = require("./models/productreviewModel")
const adminAuth = require("./middleware/authMiddleware");

//from routes folder..
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subcategoryRoutes = require("./routes/subCategoryRoutes");
const brandRoutes = require("./routes/brandRoutes");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

connectToDb();

app.get('/', (req, res) => {
  res.send('Hello World..');
});

app.use("/api", categoryRoutes);
app.use("/api", userRoutes);
app.use("/api", subcategoryRoutes);
app.use("/api", brandRoutes);

app.get('/api/variants', async (req, res) => {
  try {
    const variants = await variantModel.find().sort({ createdAt: -1 });
    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/variants", async (req, res) => {
  try {
    const { variant, values, status } = req.body;
    if (!variant || !values || status === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newVariant = new variantModel({
      variant,
      values,
      status
    });
    await newVariant.save();
    res.status(201).json(newVariant);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/variants/:id", async (req, res) => {
  try {
    const { variant, values, status } = req.body;
    if (!variant || !values || status === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const updatedVariant = await variantModel.findByIdAndUpdate(
      req.params.id,
      { variant, values, status },
      { new: true }
    );
    if (updatedVariant) {
      res.json(updatedVariant);
    } else {
      res.status(404).json({ message: "Variant not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/variants/:id", async (req, res) => {
  try {
    const deletedVariant = await variantModel.findByIdAndDelete(req.params.id);
    if (deletedVariant) {
      res.json({ message: "Variant deleted successfully", data: deletedVariant });
    } else {
      res.status(404).json({ message: "Variant not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
//product 
app.get('/api/product', async (req, res) => {
  try {
    const products = await Product.find({ deletedAt: null })
      .populate('category')
      .populate('subcategory')
      .populate('brand');
    res.json(products);
  } catch (err) {
    console.error(err); // error ko print karo
    res.status(500).json({ error: "Server error" });
  }
});
// single product 
const mongoose = require('mongoose');
app.get('/api/product/:id', async (req, res) => {
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('subcategory')
      .populate('brand')
      // .populate('variants.variant')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name' }
      });
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    console.error(err); // This will show the real error in your terminal
    res.status(500).json({ error: "Server error" });
  }
});

function generateSKU(category, brand) {
  // Example: CAT-BRAND-XXXX
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${category?.slice(0, 3).toUpperCase() || 'GEN'}-${brand?.slice(0, 3).toUpperCase() || 'GEN'}-${rand}`;
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

// ...existing code...

app.post('/api/product', cpUpload, async (req, res) => {
  try {
    const data = req.body;

    if (typeof data.variants === "string") data.variants = JSON.parse(data.variants);
    if (data.productBenefits) data.productBenefits = JSON.parse(data.productBenefits);
    if (data.productFeatures) data.productFeatures = JSON.parse(data.productFeatures);
    if (data.productVideos) data.productVideos = JSON.parse(data.productVideos);


    const files = req.files || [];


    const imageFile = files.find(f => f.fieldname === 'image');
    if (imageFile) data.image = imageFile.filename;

    // Multiple images
    data.images = files.filter(f => f.fieldname === 'images').map(f => f.filename);


    if (data.productBenefits && Array.isArray(data.productBenefits)) {
      // Sirf ek hi section hai, index 0
      const benefitFiles = files.filter(f => f.fieldname === `productBenefitsImages0`);
      data.productBenefits = [{
        images: benefitFiles.map(f => f.filename)
      }];
    }

    // Product Features images
    if (data.productFeatures && Array.isArray(data.productFeatures)) {
      data.productFeatures = data.productFeatures.map((f, idx) => {
        const featureFile = files.find(file => file.fieldname === `productFeaturesImage${idx}`);
        return {
          ...f,
          image: featureFile ? featureFile.filename : ""
        };
      });
    }

    // Slug
    if (data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 60);
    }
    // SKU
    data.sku = "SKU-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    // status
    let { status } = req.body;
    let statusBool = status === "true" || status === true || status === 1 || status === "Active";
    data.status = statusBool;
    const product = new Product(data);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// ye hai soft delete product..
app.put('/api/product/soft-delete/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date() },
      { new: true }
    );
    res.json({ message: "Product soft deleted", product: deletedProduct });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
app.put('/api/product/:id', cpUpload, async (req, res) => {
  try {
    const data = req.body;
    // Parse JSON fields if needed
    if (typeof data.variants === "string") data.variants = JSON.parse(data.variants);
    if (data.productBenefits) data.productBenefits = JSON.parse(data.productBenefits);
    if (data.productFeatures) data.productFeatures = JSON.parse(data.productFeatures);
    if (data.productVideos) data.productVideos = JSON.parse(data.productVideos);

    const files = req.files || [];

    // Single image
    const imageFile = files.find(f => f.fieldname === 'image');
    if (imageFile) data.image = imageFile.filename;

    // Multiple images
    if (files.some(f => f.fieldname === 'images')) {
      data.images = files.filter(f => f.fieldname === 'images').map(f => f.filename);
    }

    // Product Benefits images
    if (data.productBenefits && Array.isArray(data.productBenefits)) {
      // Sirf ek hi section hai, index 0
      const benefitFiles = files.filter(f => f.fieldname === `productBenefitsImages0`);
      data.productBenefits = [{
        images: benefitFiles.length > 0
          ? benefitFiles.map(f => f.filename)
          : (data.productBenefits[0]?.images || [])
      }];
    }

    // Product Features images
    if (data.productFeatures && Array.isArray(data.productFeatures)) {
      data.productFeatures = data.productFeatures.map((f, idx) => {
        const featureFile = files.find(file => file.fieldname === `productFeaturesImage${idx}`);
        return {
          ...f,
          image: featureFile ? featureFile.filename : (f.image || "")
        };
      });
    }

    // Slug 
    if (data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 60);
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
//create coupon
app.post("/api/coupon", async (req, res) => {
  try {
    const {
      name, code, description, discountType, discountValue,
      startDate, endDate, maxUses, minOrderAmount, /*products,*/ isActive
    } = req.body;

    const coupon = new Coupon({
      name,
      code,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      maxUses,
      minOrderAmount,
      // products: productsToSave,
      isActive
    });

    await coupon.save();
    res.json(coupon);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
//get all coupons
app.get('/api/coupon', async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//update coupon
app.put('/api/coupon/:id', async (req, res) => {
  try {
    const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Coupon updated", coupon: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//delete coupon
app.delete('/api/coupon/:id', async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
function isCouponApplicable(coupon, productId) {
  if (!coupon.products || coupon.products.length === 0) {
    return true;
  }
  return coupon.products.map(String).includes(String(productId));
}
//validate coupon (for checkout)
app.post('/api/coupon/validate', async (req, res) => {
  try {
    const { code, userId, cartItems = [] } = req.body;
    // cartItems = [{ productId, price, quantity }]
    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) return res.status(404).json({ error: "Invalid coupon" });

    const now = new Date();
    if (coupon.startDate && now < coupon.startDate) return res.status(400).json({ error: "Coupon not started yet" });
    if (coupon.endDate && now > coupon.endDate) return res.status(400).json({ error: "Coupon expired" });
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return res.status(400).json({ error: "Coupon usage limit reached" });
    if (coupon.usersUsed && userId && coupon.usersUsed.includes(userId)) return res.status(400).json({ error: "You have already used this coupon" });
    const applicableItems = cartItems;

    const applicableTotal = applicableItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (coupon.minOrderAmount && applicableTotal < coupon.minOrderAmount) {
      return res.status(400).json({ error: "Order amount too low for this coupon" });
    }
    // Calculate discount only on applicable total
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (applicableTotal * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }
    res.json({ valid: true, discount, coupon, discountedProducts: applicableItems.map(i => i.productId) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const {
      user_id,
      items, // [{ product, variant, price, gst, quantity, discount }]
      totalAmount,
      totalQuantity,
      totalDiscount,
      payment_method,
      transaction_id,
      order_date,
      delivery_date,
      cancelled_date,
      reasons,
      remarks
    } = req.body;

    const order = await Order.create({
      user_id,
      items: [],
      totalAmount,
      totalQuantity,
      totalDiscount,
      status: "Pending",
      payment_method,
      transaction_id,
      order_date,
      delivery_date,
      cancelled_date,
      reasons,
      remarks
    });
    // 2. Create OrderItems and push their ids to order.items
    const orderItemIds = [];
    for (const item of items) {
      const orderItem = await OrderItem.create({
        order_id: order._id,
        product: item.product,
        variant: item.variant,
        price: item.price,
        gst: item.gst,
        quantity: item.quantity,
        discount: item.discount,
        status: "Pending"
      });
      orderItemIds.push(orderItem._id);
    }
    order.items = orderItemIds;
    await order.save();

    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "items",
        populate: [{ path: "product" }, { path: "variant" }]
      })
      .populate("user_id");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: "items",
        populate: [{ path: "product" }, { path: "variant" }]
      })
      .populate("user_id");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/orders/:id/status", async (req, res) => {
  try {
    const { status, delivery_date, cancelled_date, reasons, remarks } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, delivery_date, cancelled_date, reasons, remarks },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/orders/item/:itemId/soft-delete", async (req, res) => {
  try {
    const item = await OrderItem.findByIdAndUpdate(
      req.params.itemId,
      { deletedAt: new Date(), status: "Cancelled" },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
//get all product hai..
app.get("/api/products", async (_req, res) => {
  res.json(
    await Product.find({
      status: true,
      deletedAt: null
    }).select("name _id")
  );
});

app.get("/api/combos", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const combos = await ComboProduct.find()
      .sort({ createdAt: -1 }) // 🆕 Newest first
      .skip((page - 1) * limit)
      .limit(limit).lean()
      .populate("comboProducts", "name image");

    console.log("Combos fetched:", JSON.stringify(combos, null, 2));

    const total = await ComboProduct.countDocuments();

    res.json({
      combos,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});


app.post("/api/combos", async (req, res) => {
  try {
    const { name, comboProducts, status } = req.body;
    const combo = await ComboProduct.create({ name, comboProducts, status });
    res.status(201).json(combo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/combos/:id", async (req, res) => {
  try {
    const combo = await ComboProduct.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(combo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/combos/:id", async (req, res) => {
  await ComboProduct.findByIdAndDelete(req.params.id);
  res.json({ message: "Combo deleted" });
});

// PRODUCT REVIEW ROUTES
const requireAuth = (req, res, next) => {
  // Dummy auth for now, replace with real auth in production
  // req.user = { _id: 'USER_ID', isAdmin: false };
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
// Add a review (user must be logged in)
app.post("/api/reviews", requireAuth, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;
    // Check if user already reviewed
    const already = await Review.findOne({ user: userId, product: productId });
    if (already) return res.status(400).json({ message: "You already reviewed this product." });
    // Optionally: check if user purchased and delivered (skip for now)
    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Get all approved reviews for a product
app.get("/api/products/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.id,
      status: "Approved"
    }).populate("user", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Approve/Reject a review
app.put("/api/admin/reviews/:id", requireAuth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Not allowed" });
    const { status } = req.body; // "Approved" or "Rejected"
    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.put("/api/reviews/:id", requireAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (String(review.user) !== String(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }
    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    if (!req.user.isAdmin) review.status = "Pending";
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete review (user or admin)
app.delete("/api/reviews/:id", requireAuth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (String(review.user) !== String(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }
    await review.remove();
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

