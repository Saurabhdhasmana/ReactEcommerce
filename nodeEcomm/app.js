require("dotenv").config();

const express = require('express');
const path = require('path');
const connectToDb = require("./config/mongoose");
const { upload, cpUpload } = require("./middleware/multer");
const categoryModel = require("./models/categoryModel");
const subcategoryModel = require("./models/subcategoryModel");
const BrandModel = require("./models/BrandModel");
const variantModel = require("./models/VariantModel");
const Product = require("./models/ProductModel");
const Coupon = require("./models/CouponModel");
const userModel = require("./models/userModel");
const Order=require("./models/OrderModel");
const OrderItem=require("./models/OrderItemModel");
const ComboProduct=require("./models/comboproductModel");
const Review=require("./models/productreviewModel")
const adminAuth=require("./middleware/authMiddleware");


//from routes folder
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subcategoryRoutes = require("./routes/subCategoryRoutes");
const brandRoutes=require("./routes/brandRoutes");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve public folder statically (for images, icons, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

connectToDb();

app.get('/', (req, res) => {
  res.send('Hello World..');
});

// CATEGORY ROUTES
app.use("/api", categoryRoutes);
app.use("/api", userRoutes);
app.use("/api",subcategoryRoutes);
app.use("/api",brandRoutes);

//delete kr pehle neeche ke 2 ko
app.get('/api/category', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await categoryModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const category = await categoryModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      category,
      totalPages,
      currentPage: page,
      totalItems: total
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete("/api/subcategory/:id", async (req, res) => {
  try {
    const deleted = await subcategoryModel.findByIdAndDelete(req.params.id);
    if (deleted) {
      res.status(200).json({
        message: "Subcategory deleted successfully",
        data: deleted
      });
    } else {
      res.status(404).json({
        message: "Subcategory not found"
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
//Brand

app.post("/api/brand", upload.single("image"), async (req, res) => {
  try {
    const { name, status } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Brand image is required" });
    }
    if (!name) {
      return res.status(400).json({ error: "Brand name is required" });
    }
    const image = req.file.filename;
    const statusBool = status === "true" || status === true || status === 1 || status === "Active";
    const brand = await BrandModel.create({
      name,
      image,
      status: typeof status === "undefined" ? true : statusBool,
    });
    res.status(201).json({ message: "Brand created successfully", brand });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
app.use("/api",brandRoutes);
// Get All Brands (no pagination)
app.get("/api/brand", async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const total = await BrandModel.countDocuments();
    const brands = await BrandModel.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      brands,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update Brand
app.put("/api/brand/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, status } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (typeof status !== "undefined") {
      updateData.status = status === "true" || status === true || status === 1 || status === "Active";
    }
    if (req.file) updateData.image = req.file.filename;

    const updated = await BrandModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (updated) {
      res.json({ message: "Brand updated successfully", brand: updated });
    } else {
      res.status(404).json({ error: "Brand not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete Brand
app.delete("/api/brand/:id", async (req, res) => {
  try {
    const deleted = await BrandModel.findByIdAndDelete(req.params.id);
    if (deleted) {
      res.json({ message: "Brand deleted successfully", brand: deleted });
    } else {
      res.status(404).json({ error: "Brand not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// variants

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
app.get('/api/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('subcategory')
      .populate('brand')
      .populate('variants.variant')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name' } // User ka naam bhi laane ke liye
      });
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
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
    // Parse JSON fields if needed
    if (typeof data.variants === "string") data.variants = JSON.parse(data.variants);
    if (data.productBenefits) data.productBenefits = JSON.parse(data.productBenefits);
    if (data.productFeatures) data.productFeatures = JSON.parse(data.productFeatures);
    if (data.productVideos) data.productVideos = JSON.parse(data.productVideos);

    // Multer .any() => req.files is array
    const files = req.files || [];

    // Single image
    const imageFile = files.find(f => f.fieldname === 'image');
    if (imageFile) data.image = imageFile.filename;

    // Multiple images
    data.images = files.filter(f => f.fieldname === 'images').map(f => f.filename);

    // Product Benefits images
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
// ...existing code...soft delete product
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


app.put('/api/product/:id', cpUpload,  async (req, res) => {
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
app.post("/api/coupon",  async (req, res) => {
  try {
    const {
      name, code, description, discountType, discountValue,
      startDate, endDate, maxUses, minOrderAmount, /*products,*/ isActive
    } = req.body;
    // If "ALL" is selected, save empty array (means all products)
    //  let productsToSave = Array.isArray(products) && products.includes("ALL") ? [] : products;


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
app.put('/api/coupon/:id',  async (req, res) => {
  try {
    const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Coupon updated", coupon: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//delete coupon
app.delete('/api/coupon/:id',  async (req, res) => {
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

    // Filter only applicable products
    //const applicableItems = (!coupon.products || coupon.products.length === 0)
    //  ? cartItems
    // : cartItems.filter(item => coupon.products.map(String).includes(String(item.productId)));

    // if (applicableItems.length === 0) {
    // return res.status(400).json({ error: "Coupon not valid for these products" });
    //}
    const applicableItems = cartItems;
    // Calculate applicable total
    const applicableTotal = applicableItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Min order amount check (on applicable total)
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
//admin login





app.post("/api/orders",async (req,res)=>{
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

//combo products

// GET all active products

/* ---------- PRODUCTS (dummy fetch) ---------- */
app.get("/api/products", async (_req, res) => {
   res.json(
    await Product.find({
      status: true,
      deletedAt: { $ne: null } // not equal to null
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

//product Review
// Route: POST /api/reviews
// Middleware: requireAuth (only logged-in users)

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
