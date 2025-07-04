import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FaPlus, FaMinus } from "react-icons/fa";
import { toast } from 'react-toastify';
// import { API_BASE_URL, IMAGE_BASE_URL } from "../config/api";

const ProductForm = ({ editProduct, onProductUpdated, onClose }) => {
  // Product fields
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagesArray, setImagesArray] = useState([]);
  const [price, setPrice] = useState("");
  const [mrpPrice, setMrpPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [descriptionShort, setDescriptionShort] = useState("");
  const [descriptionLong, setDescriptionLong] = useState("");
  const [status, setStatus] = useState(true);
  const [brand, setBrand] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Variant logic
  const [variantOptions, setVariantOptions] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [variantValues, setVariantValues] = useState({});
  const [variantCombinations, setVariantCombinations] = useState([]);
  const [variantDetails, setVariantDetails] = useState({});

  const [productBenefits, setProductBenefits] = useState([]); // [{images: [File, ...]}]
  const [productFeatures, setProductFeatures] = useState([
    { title: "", description: "", image: null }
  ]);
  const [productVideos, setProductVideos] = useState([{ link: "" }]);

  // Tab state
  const [activeTab, setActiveTab] = useState('basic');
  const [gstPercent, setGstPercent] = useState(18); // Default GST rate

  // Fetch dropdown data
  useEffect(() => {
    fetch("/api/category").then(res => res.json()).then(data => setCategories(data.category || []));
    fetch("/api/subcategory").then(res => res.json()).then(data => setSubcategories(data.subcategories || []));
    fetch("/api/brand").then(res => res.json()).then(data => setBrands(data.brands || []));
    fetch("/api/variants")
      .then(res => res.json())
      .then(data => setVariantOptions(
        data.map(v => ({
          value: v._id,
          label: v.variant,
          values: v.values
        }))
      ));
  }, []);

  useEffect(() => {
    if (editProduct) {
      setName(editProduct.name || "");
      setPrice(editProduct.price || "");
      setMrpPrice(editProduct.mrpPrice || "");
      setSalePrice(editProduct.salePrice || "");
      setUnit(editProduct.unit || "");
      setCategory(editProduct.category?._id || editProduct.category || "");
      setSubcategory(editProduct.subcategory?._id || editProduct.subcategory || "");
      setDescriptionShort(editProduct.descriptionShort || "");
      setDescriptionLong(editProduct.descriptionLong || "");
      setStatus(editProduct.status !== undefined ? editProduct.status : true);
      setBrand(editProduct.brand?._id || editProduct.brand || "");
      setGstPercent(editProduct.gst || 18); // <-- Set GST dropdown value from product
      setProductBenefits(editProduct.productBenefits && editProduct.productBenefits.length > 0
        ? editProduct.productBenefits
        : [{ images: [] }]
      );
      setProductFeatures(editProduct.productFeatures && editProduct.productFeatures.length > 0
        ? editProduct.productFeatures.map(f => ({ ...f, image: null }))
        : [{ title: "", description: "", image: null }]
      );
      setProductVideos(editProduct.productVideos && editProduct.productVideos.length > 0
        ? editProduct.productVideos
        : [{ link: "" }]
      );

      // ----------- VARIANTS PREFILL -----------
      // 1. selectedVariants
      if (editProduct.variants && editProduct.variants.length > 0 && variantOptions.length > 0) {
        // Find all unique variant types used in this product
        const usedVariantTypes = [];
        editProduct.variants.forEach(v => {
          v.variantValues.forEach((val, idx) => {
            const variantType = variantOptions[idx];
            if (variantType && !usedVariantTypes.find(u => u.value === variantType.value)) {
              usedVariantTypes.push(variantType);
            }
          });
        });
        setSelectedVariants(usedVariantTypes);

        // 2. variantValues
        // For each variant type, collect all values used
        const valuesObj = {};
        usedVariantTypes.forEach((variantType, idx) => {
          const allValues = [];
          editProduct.variants.forEach(v => {
            if (v.variantValues[idx]) {
              allValues.push(v.variantValues[idx]);
            }
          });
          valuesObj[variantType.value] = Array.from(new Set(allValues));
        });
        setVariantValues(valuesObj);

        // 3. variantDetails (for each combination)
        const detailsObj = {};
        editProduct.variants.forEach(v => {
          const key = v.variantValues.join("|");
          detailsObj[key] = {
            mrp: v.mrp,
            price: v.price,
            salePrice: v.salePrice,
            sku: v.sku,
            openingStock: v.openingStock,
            currentStock: v.currentStock !== undefined ? v.currentStock : v.openingStock,
            minimumStock: v.minimumStock !== undefined ? v.minimumStock : 5,
            reorderLevel: v.reorderLevel !== undefined ? v.reorderLevel : 10,
            status: v.status,
            images: v.images || []
          };
        });
        setVariantDetails(detailsObj);
      } else {
        setSelectedVariants([]);
        setVariantValues({});
        setVariantDetails({});
      }

    }
  }, [editProduct, variantOptions]);

  // Handle variant selection
  const handleVariantChange = (selected) => {
    setSelectedVariants(selected || []);
    const newValues = {};
    (selected || []).forEach(v => {
      newValues[v.value] = variantValues[v.value] || [];
    });
    setVariantValues(newValues);
  };

  // Handle variant value selection
  const handleValuesChange = (variantId, selected) => {
    setVariantValues({
      ...variantValues,
      [variantId]: selected ? selected.map(s => s.value) : []
    });
  };

  // Generate all combinations (cartesian product)
  useEffect(() => {
    if (selectedVariants.length === 0) {
      setVariantCombinations([]);
      return;
    }
    const valueArrays = selectedVariants.map(v => variantValues[v.value] || []);
    if (valueArrays.some(arr => arr.length === 0)) {
      setVariantCombinations([]);
      return;
    }
    const combine = (arr) => arr.reduce((a, b) => a.flatMap(d => b.map(e => [...d, e])), [[]]);
    const combos = combine(valueArrays);
    setVariantCombinations(combos);
  }, [selectedVariants, variantValues]);

  // Handle details for each combination
  const handleComboDetailChange = (combo, field, value) => {
    const key = combo.join("|");
    setVariantDetails(prev => {
      let parsedValue = value;
      // For stock fields, always store as number or undefined
      if (["openingStock", "currentStock", "minimumStock", "reorderLevel", "mrp", "salePrice", "price"].includes(field)) {
        parsedValue = value === '' ? undefined : Number(value);
      }
      const updated = {
        ...prev,
        [key]: {
          ...prev[key],
          [field]: parsedValue
        }
      };
      // If basePrice is updated, also update price and salePrice
      if (field === "basePrice") {
        updated[key].price = parsedValue;
        updated[key].salePrice = parsedValue;
      }
      return updated;
    });
  };

  // --- Product Benefits handlers ---
  const handleBenefitImagesChange = (e, idx) => {
    const files = Array.from(e.target.files);
    setProductBenefits(benefits =>
      benefits.map((b, i) => i === idx ? { ...b, images: files } : b)
    );
  };
  const addBenefitSection = () => setProductBenefits([...productBenefits, { images: [] }]);
  const removeBenefitSection = idx =>
    setProductBenefits(productBenefits.filter((_, i) => i !== idx));

  // --- Product Features handlers ---
  const handleFeatureChange = (idx, field, value) => {
    setProductFeatures(features =>
      features.map((f, i) => i === idx ? { ...f, [field]: value } : f)
    );
  };
  const handleFeatureImageChange = (idx, e) => {
    setProductFeatures(features =>
      features.map((f, i) => i === idx ? { ...f, image: e.target.files[0] } : f)
    );
  };
  const addFeature = () => setProductFeatures([...productFeatures, { title: "", description: "", image: null }]);
  const removeFeature = idx => setProductFeatures(productFeatures.filter((_, i) => i !== idx));

  const handleVideoChange = (idx, value) => {
    setProductVideos(videos =>
      videos.map((v, i) => i === idx ? { link: value } : v)
    );
  };
  const addVideo = () => setProductVideos([...productVideos, { link: "" }]);
  const removeVideo = idx => setProductVideos(productVideos.filter((_, i) => i !== idx));


  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const variants = variantCombinations.map(combo => {
      const key = combo.join("|");
      const details = variantDetails[key] || {};
      const variantName = combo.join(" ");
      const sku = "-" + combo.map(v => v.toLowerCase()).join("-");
      let images = [];
      if (details.images && details.images.length > 0 && details.images[0] instanceof File) {
        images = details.images;
      }
      return {
        variantName,
        variantValues: combo,
        images,
        mrp: details.mrp,
        price: details.price,
        salePrice: details.salePrice,
        sku,
        openingStock: details.openingStock,
        currentStock: details.currentStock,
        minimumStock: details.minimumStock,
        reorderLevel: details.reorderLevel,
        status: details.status !== undefined ? details.status : true
      };
    });



    const formData = new FormData();
    formData.append('name', name);
    if (imageFile) formData.append('image', imageFile);
    imagesArray.forEach(img => formData.append('images', img));
    formData.append('price', price);
    formData.append('mrpPrice', mrpPrice);
    formData.append('salePrice', salePrice);
    formData.append('unit', unit);
    formData.append('category', category);
    formData.append('subcategory', subcategory);
    formData.append('descriptionShort', descriptionShort);
    formData.append('descriptionLong', descriptionLong);
    formData.append('status', status);
    formData.append('brand', brand);
    formData.append('gst', gstPercent);
    formData.append('variants', JSON.stringify(variants));

    formData.append('productBenefits', JSON.stringify([{ images: [] }]));
    if (productBenefits[0] && productBenefits[0].images && productBenefits[0].images.length > 0) {
      productBenefits[0].images.forEach(img =>
        formData.append(`productBenefitsImages0`, img)
      );
    }

    formData.append('productFeatures', JSON.stringify(productFeatures.map(f => ({
      title: f.title,
      description: f.description,
      image: ""
    }))));
    productFeatures.forEach((f, idx) => {
      if (f.image) formData.append(`productFeaturesImage${idx}`, f.image);
    });
    formData.append('productVideos', JSON.stringify(productVideos));


    let url = 'https://backend-darze-4.onrender.com/api/product';
    let method = 'POST';
    if (editProduct && editProduct._id) {
      url = `https://backend-darze-4.onrender.com/api/product/${editProduct._id}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method,
      body: formData
    });
    const data = await res.json();
    if (data && data._id) {
      toast.success(editProduct ? "Product updated successfully!" : "Product created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
      if (onProductUpdated) onProductUpdated();
      if (!editProduct) {
        // Reset form after adding new product
        setName("");
        setImageFile(null);
        setImagesArray([]);
        setPrice("");
        setMrpPrice("");
        setSalePrice("");
        setUnit("");
        setCategory("");
        setSubcategory("");
        setDescriptionShort("");
        setDescriptionLong("");
        setStatus(true);
        setBrand("");
        setSelectedVariants([]);
        setVariantValues({});
        setVariantCombinations([]);
        setVariantDetails({});
        setProductBenefits([{ images: [] }]);
        setProductFeatures([{ title: "", description: "", image: null }]);
        setProductVideos([{ link: "" }]);
        // Delay closing so toast is visible
        if (onClose) setTimeout(onClose, 1200);
      } else {
        // For update, also delay close
        if (onClose) setTimeout(onClose, 1200);
      }
    } else {
      toast.error("Error: " + (data.error || "Unknown error"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
    }
  };


  return (
    <div className="page-wrapper pt-0" style={{ background: '#f4f6fb', minHeight: '100vh' }}>
      <div className="container py-4">
        <div className="card shadow-lg border-0 mb-4" style={{ borderRadius: 18 }}>
          <div className="card-header bg-gradient text-white sticky-top d-flex align-items-center" style={{ background: 'linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%)', borderTopLeftRadius: 18, borderTopRightRadius: 18, zIndex: 2 }}>
            <h3 className="mb-0 flex-grow-1"><span role="img" aria-label="box">📦</span> {editProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <button type="button" className="btn btn-light btn-sm ms-2" onClick={onClose} style={{ borderRadius: 8 }}>Close</button>
          </div>
          <div className="card-body p-4">
            {/* Tab Navigation */}
            <ul className="nav nav-tabs mb-4" style={{ borderBottom: '2px solid #e0e3ea' }}>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('basic')}><span role="img" aria-label="info">📝</span> Basic Info</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'variants' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('variants')}><span role="img" aria-label="variants">🧩</span> Variants</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'benefits' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('benefits')}><span role="img" aria-label="benefits">🌟</span> Benefits</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'features' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('features')}><span role="img" aria-label="features">✨</span> Features</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'videos' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('videos')}><span role="img" aria-label="videos">🎬</span> Videos</button>
              </li>
            </ul>
            <form onSubmit={handleSubmit}>
              {/* Tab Content */}
              <div>
                {activeTab === 'basic' && (
                  <div className="p-4 bg-white rounded shadow-sm" style={{ borderLeft: '5px solid #4e54c8' }}>
                    <h5 className="fw-bold mb-3 text-primary"><span role="img" aria-label="info">📝</span> Basic Information</h5>
                    <div className="row">
                      {/* Product Name */}
                      <div className="col-md-6 form-group mb-3">
                        <label className="form-label fw-bold">Product Name</label>
                        <input
                          name="name"
                          required
                          className="form-control shadow-sm"
                          value={name}
                          onChange={e => setName(e.target.value)}
                        />
                      </div>
                     
                      {/* Price, MRP, Sale Price */}
                      <div className="col-md-2 form-group mb-3">
                        <label className="form-label fw-bold">MRP Price</label>
                        <input
                          name="mrpPrice"
                          type="number"
                          className="form-control shadow-sm"
                          value={mrpPrice}
                          onChange={e => setMrpPrice(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2 form-group mb-3">
                        <label className="form-label fw-bold">Sale Price</label>
                        <input
                          name="salePrice"
                          type="number"
                          className="form-control shadow-sm"
                          value={salePrice}
                          onChange={e => setSalePrice(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2 form-group mb-3">
                        <label className="form-label fw-bold">GST Rate (%)</label>
                        <select
                         name="gst"
                          className="form-select shadow-sm"
                          value={gstPercent}
                          onChange={e => setGstPercent(Number(e.target.value))}
                          style={{  borderRadius: 8 }}
                        >
                          <option value={5}>5% GST</option>
                          <option value={12}>12% GST</option>
                          <option value={18}>18% GST</option>
                        </select>
                      </div>
                      {/* Image */}
                      <div className="col-md-4 form-group mb-3">
                        <label className="form-label fw-bold">Image</label>
                        {editProduct && editProduct.image && (
                          <img
                            src={`http://localhost:3000/images/uploads/${editProduct.image}`}
                            alt="Product"
                            className="d-block mb-2 rounded shadow-sm border"
                            style={{ width: 60 }}
                            onError={(e) => {
                              console.log("Edit image failed to load:", e.target.src);
                              e.target.src = "https://via.placeholder.com/60x60?text=No+Image";
                            }}
                          />
                        )}
                        <input
                          type="file"
                          className="form-control shadow-sm"
                          onChange={e => setImageFile(e.target.files[0])}
                        />
                      </div>
                      {/* Images (Multiple) */}
                      <div className="col-md-6 form-group mb-3">
                        <label className="form-label fw-bold">Images (Multiple)</label>
                        {editProduct && editProduct.images && editProduct.images.length > 0 && (
                          <div className="mb-2">
                            {editProduct.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={`http://localhost:3000/images/uploads/${img}`}
                                alt="Product"
                                className="me-2 mb-1 rounded shadow-sm border"
                                style={{ width: 40 }}
                                onError={(e) => {
                                  console.log("Multiple image failed to load:", e.target.src);
                                  e.target.src = "https://via.placeholder.com/40x40?text=No+Image";
                                }}
                              />
                            ))}
                          </div>
                        )}
                        <input
                          type="file"
                          multiple
                          className="form-control shadow-sm"
                          onChange={e => setImagesArray(Array.from(e.target.files))}
                        />
                      </div>
                      <div className="col-md-2 form-group mb-3">
                        <label className="form-label fw-bold">Status</label>
                        <select
                          name="status"
                          className="form-control shadow-sm"
                          value={status}
                          onChange={e => setStatus(e.target.value === "true")}
                        >
                          <option value={true}>Active</option>
                          <option value={false}>Inactive</option>
                        </select>
                      </div> 
                      {/* Unit, Category, Subcategory, Brand */}
                      <div className="col-md-3 form-group mb-3">
                        <label className="form-label fw-bold">Unit</label>
                        <input
                          name="unit"
                          className="form-control shadow-sm"
                          value={unit}
                          onChange={e => setUnit(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3 form-group mb-3">
                        <label className="form-label fw-bold">Category</label>
                        <Select
                          options={categories.map(c => ({ value: c._id, label: c.name }))}
                          className="mb-2"
                          value={categories.find(c => c._id === category) ? { value: category, label: categories.find(c => c._id === category).name } : null}
                          onChange={option => setCategory(option ? option.value : "")}
                        />
                      </div>
                      <div className="col-md-3 form-group mb-3">
                        <label className="form-label fw-bold">Subcategory</label>
                        <Select
                          options={subcategories.map(sc => ({ value: sc._id, label: sc.name }))}
                          className="mb-2"
                          value={subcategories.find(sc => sc._id === subcategory) ? { value: subcategory, label: subcategories.find(sc => sc._id === subcategory).name } : null}
                          onChange={option => setSubcategory(option ? option.value : "")}
                        />
                      </div>
                      <div className="col-md-3 form-group mb-3">
                        <label className="form-label fw-bold">Brand</label>
                        <Select
                          options={brands.map(b => ({ value: b._id, label: b.name }))}
                          className="mb-2"
                          value={brands.find(b => b._id === brand) ? { value: brand, label: brands.find(b => b._id === brand).name } : null}
                          onChange={option => setBrand(option ? option.value : "")}
                        />
                      </div>
</div>
                       
                      {/* Descriptions */}
                      <div className="col-md-12 form-group mb-3">
                        <label className="form-label fw-bold">Description (Short)</label>
                        <textarea
                          name="descriptionShort"
                          className="form-control shadow-sm"
                          value={descriptionShort}
                          onChange={e => setDescriptionShort(e.target.value)}
                        />
                      </div>                 

                      <div className="col-md-12 form-group mb-3">
                        <label className="form-label fw-bold">Description (Long)</label>
                        <textarea
                          name="descriptionLong"
                          className="form-control shadow-sm"
                          value={descriptionLong}
                          onChange={e => setDescriptionLong(e.target.value)}
                          style={{ minHeight: 150, background: '#fff' }}
                        />
                      </div>
                      {/* Status */}
                     
                    </div>
                )}
                {activeTab === 'variants' && (
                  <div className="p-4 bg-white rounded shadow-sm" style={{ borderLeft: '5px solid #8f94fb' }}>
                    <h5 className="fw-bold mb-3 text-info"><span role="img" aria-label="variants">🧩</span> Variants</h5>
                    <div className="row mb-3">
                      <div className="col-md-8">
                        <label className="form-label fw-bold">Product Attribute Name (Variants)</label>
                        <Select
                          isMulti
                          options={variantOptions}
                          value={selectedVariants}
                          onChange={handleVariantChange}
                          placeholder="Select variants"
                          className="mb-2"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      {selectedVariants.map(v => (
                        <div key={v.value} className="mb-3 col-md-6">
                          <label className="form-label fw-bold mb-1" style={{ fontSize: "16px" }}>
                            {v.label} <span style={{ color: "red" }}>*</span>
                          </label>
                          <Select
                            isMulti
                            options={v.values.map(val => ({ value: val, label: val }))}
                            value={(variantValues[v.value] || []).map(val => ({ value: val, label: val }))}
                            onChange={selected => handleValuesChange(v.value, selected)}
                            placeholder={`Select ${v.label}`}
                            className="mb-2"
                          />
                        </div>
                      ))}
                    </div>
                    {variantCombinations.length > 0 && (
                      <div className="table-responsive mb-4">
                        <table className="table table-bordered align-middle shadow-sm bg-white">
                          <thead className="table-info">
                            <tr>
                              <th>Product Variant Name</th>
                              <th>MRP Price</th>
                              <th>Sale Price</th>
                              <th>SKU</th>
                              <th>Opening Stock</th>
                              <th>Current Stock</th>
                              <th>Min Stock</th>
                              <th>Reorder Level</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {variantCombinations.map(combo => {
                              const key = combo.join("|");
                              const details = variantDetails[key] || {};
                              return (
                                <tr key={key}>
                                  <td>
                                    <input className="form-control shadow-sm" value={combo.join(" ")} readOnly />
                                  </td>
                                  <td>
                                    <input type="number" className="form-control shadow-sm" placeholder="MRP" value={details.mrp || ""} onChange={e => handleComboDetailChange(combo, "mrp", e.target.value)} />
                                  </td>
                                  <td>
                                    <input type="number" className="form-control shadow-sm" placeholder="Sale Price" value={details.salePrice || ""} onChange={e => handleComboDetailChange(combo, "salePrice", e.target.value)} />
                                  </td>
                                  <td>
                                    <input className="form-control shadow-sm" value={"-" + combo.map(v => v.toLowerCase()).join("-")} readOnly />
                                  </td>
                                  <td>
                                    <input type="number" className="form-control shadow-sm" placeholder="Opening Stock" value={details.openingStock || ""} onChange={e => handleComboDetailChange(combo, "openingStock", e.target.value)} />
                                  </td>
                                  <td>
                                    <input type="number" className="form-control shadow-sm" placeholder="Current Stock" value={details.currentStock || ""} onChange={e => handleComboDetailChange(combo, "currentStock", e.target.value)} />
                                  </td>
                                  <td>
                                    <input type="number" className="form-control shadow-sm" placeholder="Min Stock" value={details.minimumStock || ""} onChange={e => handleComboDetailChange(combo, "minimumStock", e.target.value)} />
                                  </td>
                                  <td>
                                    <input type="number" className="form-control shadow-sm" placeholder="Reorder Level" value={details.reorderLevel || ""} onChange={e => handleComboDetailChange(combo, "reorderLevel", e.target.value)} />
                                  </td>
                                  <td>
                                    <div className="form-check form-switch d-flex justify-content-center">
                                      <input className="form-check-input" type="checkbox" checked={details.status !== undefined ? details.status : true} onChange={e => handleComboDetailChange(combo, "status", e.target.checked)} />
                                      <label className="form-check-label ms-2">
                                        {details.status !== undefined ? (details.status ? 'Active' : 'Inactive') : 'Active'}
                                      </label>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'benefits' && (
                  <div className="p-4 bg-white rounded shadow-sm" style={{ borderLeft: '5px solid #43e97b' }}>
                    <h5 className="fw-bold mb-3 text-success"><span role="img" aria-label="benefits">🌟</span> Benefits</h5>
                    {editProduct && editProduct.productBenefits && editProduct.productBenefits[0] && editProduct.productBenefits[0].images && (
                      <div className="mb-2">
                        {editProduct.productBenefits[0].images.map((img, idx) => (
                          <img 
                            key={idx} 
                            src={`http://localhost:3000/images/uploads/${img}`} 
                            alt="Benefit" 
                            className="me-2 mb-1 rounded shadow-sm border" 
                            style={{ width: 40 }}
                            onError={(e) => {
                              console.log("Benefit image failed to load:", e.target.src);
                              e.target.src = "https://via.placeholder.com/40x40?text=No+Image";
                            }}
                          />
                        ))}
                      </div>
                    )}
                    <div className="mb-3 border p-2 rounded bg-light">
                      <label className="form-label fw-bold">Benefit Images (Multiple)</label>
                      <input type="file" multiple className="form-control shadow-sm" onChange={e => setProductBenefits([{ images: Array.from(e.target.files) }])} />
                    </div>
                  </div>
                )}
                {activeTab === 'features' && (
                  <div className="p-4 bg-white rounded shadow-sm" style={{ borderLeft: '5px solid #f7971e' }}>
                    <h5 className="fw-bold mb-3 text-warning"><span role="img" aria-label="features">✨</span> Features</h5>
                    {productFeatures.map((feature, idx) => (
                      <div key={idx} className="row align-items-end mb-2 border p-2 rounded bg-light">
                        <div className="col-md-3">
                          <label className="form-label">Title</label>
                          <input className="form-control shadow-sm" value={feature.title} onChange={e => handleFeatureChange(idx, "title", e.target.value)} />
                        </div>
                        <div className="col-md-5">
                          <label className="form-label">Description</label>
                          <input className="form-control shadow-sm" value={feature.description} onChange={e => handleFeatureChange(idx, "description", e.target.value)} />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Image</label>
                          {feature.image && typeof feature.image === "string" && (
                            <img 
                              src={`http://localhost:3000/images/uploads/${feature.image}`} 
                              alt="Feature" 
                              className="me-2 mb-1 rounded shadow-sm border" 
                              style={{ width: 40 }}
                              onError={(e) => {
                                console.log("Feature image failed to load:", e.target.src);
                                e.target.src = "https://via.placeholder.com/40x40?text=No+Image";
                              }}
                            />
                          )}
                          <input type="file" className="form-control shadow-sm" onChange={e => handleFeatureImageChange(idx, e)} />
                        </div>
                        <div className="col-md-1 d-flex align-items-center">
                          {productFeatures.length > 1 && (
                            <button type="button" className="btn btn-danger btn-sm me-1" onClick={() => removeFeature(idx)}><FaMinus /></button>
                          )}
                          <button type="button" className="btn btn-success btn-sm" onClick={addFeature}><FaPlus /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'videos' && (
                  <div className="p-4 bg-white rounded shadow-sm" style={{ borderLeft: '5px solid #43cea2' }}>
                    <h5 className="fw-bold mb-3 text-info"><span role="img" aria-label="videos">🎬</span> Videos</h5>
                    {productVideos.map((video, idx) => (
                      <div key={idx} className="row align-items-end mb-2">
                        <div className="col-md-10">
                          <label className="form-label">Video Link</label>
                          <input className="form-control shadow-sm" value={video.link} onChange={e => handleVideoChange(idx, e.target.value)} />
                        </div>
                        <div className="col-md-2 d-flex align-items-center">
                          {productVideos.length > 1 && (
                            <button type="button" className="btn btn-danger btn-sm me-1" onClick={() => removeVideo(idx)}><FaMinus /></button>
                          )}
                          <button type="button" className="btn btn-success btn-sm" onClick={addVideo}><FaPlus /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Form Actions */}
              {activeTab === 'videos' && (
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="submit" className="btn btn-gradient px-4 py-2 shadow" style={{ background: 'linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%)', color: '#fff', border: 'none', borderRadius: 8 }}>Save Product</button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;