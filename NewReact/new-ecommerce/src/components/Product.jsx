import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FaPlus, FaMinus } from "react-icons/fa";
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
    setVariantDetails({
      ...variantDetails,
      [key]: {
        ...variantDetails[key],
        [field]: value
      }
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
        mrp: details.mrp || "",
        price: details.price || "",
        salePrice: details.salePrice || "",
        sku,
        openingStock: details.openingStock || "",
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


    let url = '/api/product';
    let method = 'POST';
    if (editProduct && editProduct._id) {
      url = `/api/product/${editProduct._id}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method,
      body: formData
    });
    const data = await res.json();
    if (data && data._id) {
      alert(editProduct ? "Product updated!" : "Product created!");
      if (editProduct && onProductUpdated) onProductUpdated();
      // onProductAdded sirf create ke liye hota hai, edit me nahi
    } else {
      alert("Error: " + (data.error || "Unknown error"));
    }
  };


  return (
    <div className="page-wrapper pt-0" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container py-4">
        <div className="card shadow-lg border-0 mb-4">
          <div className="card-header bg-primary text-white sticky-top" style={{ zIndex: 2 }}>
            <h3 className="mb-0">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Product Name</label>
                  <input
                    name="name"
                    required
                    className="form-control mb-2 shadow-sm"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Image</label>
                  {editProduct && editProduct.image && (
                    <img
                      src={`http://localhost:3000/images/uploads/${editProduct.image}`}
                      alt="Product"
                      className="d-block mb-2 rounded shadow-sm border"
                      style={{ width: 60 }}
                    />
                  )}
                  <input
                    type="file"
                    className="form-control mb-2 shadow-sm"
                    onChange={e => setImageFile(e.target.files[0])}
                  />
                </div>
                <div className="col-md-12">
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
                        />
                      ))}
                    </div>
                  )}
                  <input
                    type="file"
                    multiple
                    className="form-control mb-2 shadow-sm"
                    onChange={e => setImagesArray(Array.from(e.target.files))}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Price</label>
                  <input
                    name="price"
                    type="number"
                    className="form-control mb-2 shadow-sm"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">MRP Price</label>
                  <input
                    name="mrpPrice"
                    type="number"
                    className="form-control mb-2 shadow-sm"
                    value={mrpPrice}
                    onChange={e => setMrpPrice(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Sale Price</label>
                  <input
                    name="salePrice"
                    type="number"
                    className="form-control mb-2 shadow-sm"
                    value={salePrice}
                    onChange={e => setSalePrice(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Unit</label>
                  <input
                    name="unit"
                    className="form-control mb-2 shadow-sm"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Category</label>
                  <Select
                    options={categories.map(c => ({ value: c._id, label: c.name }))}
                    className="mb-2"
                    value={categories.find(c => c._id === category) ? { value: category, label: categories.find(c => c._id === category).name } : null}
                    onChange={option => setCategory(option ? option.value : "")}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Subcategory</label>
                  <Select
                    options={subcategories.map(sc => ({ value: sc._id, label: sc.name }))}
                    className="mb-2"
                    value={subcategories.find(sc => sc._id === subcategory) ? { value: subcategory, label: subcategories.find(sc => sc._id === subcategory).name } : null}
                    onChange={option => setSubcategory(option ? option.value : "")}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Brand</label>
                  <Select
                    options={brands.map(b => ({ value: b._id, label: b.name }))}
                    className="mb-2"
                    value={brands.find(b => b._id === brand) ? { value: brand, label: brands.find(b => b._id === brand).name } : null}
                    onChange={option => setBrand(option ? option.value : "")}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Description (Short)</label>
                  <textarea
                    name="descriptionShort"
                    className="form-control mb-2 shadow-sm"
                    value={descriptionShort}
                    onChange={e => setDescriptionShort(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Description (Long)</label>
                  <textarea
                    name="descriptionLong"
                    className="form-control mb-2 shadow-sm"
                    value={descriptionLong}
                    onChange={e => setDescriptionLong(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Status</label>
                  <select
                    name="status"
                    className="form-control mb-2 shadow-sm"
                    value={status}
                    onChange={e => setStatus(e.target.value === "true")}
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
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
              {/* For each selected variant, show value select */}
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
              {/* Move the variant table here, above Product Benefits */}
              {variantCombinations.length > 0 && (
                <div className="table-responsive mb-4">
                  <table className="table table-bordered align-middle shadow-sm bg-white">
                    <thead className="table-primary">
                      <tr>
                        <th>Product Variant Name</th>
                        <th>Base Price (Excl. GST)</th>
                        <th>Price (Incl. GST)</th>
                        <th>GST (18%)</th>
                        <th>MRP Price</th>
                        <th>Sale Price</th>
                        <th>SKU</th>
                        <th>Opening Stock</th>
                        <th>Publish</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variantCombinations.map(combo => {
                        const key = combo.join("|");
                        const details = variantDetails[key] || {};
                        // Calculate GST and price including GST
                        const basePrice = parseFloat(details.basePrice || "");
                        const gst = basePrice ? (basePrice * 0.18).toFixed(2) : "";
                        const priceInclGST = basePrice ? (basePrice * 1.18).toFixed(2) : "";
                        return (
                          <tr key={key}>
                            <td>
                              <input
                                className="form-control shadow-sm"
                                value={combo.join(" ")}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control shadow-sm"
                                placeholder="Base Price"
                                value={details.basePrice || ""}
                                onChange={e => handleComboDetailChange(combo, "basePrice", e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control shadow-sm bg-light"
                                value={priceInclGST}
                                readOnly
                                tabIndex={-1}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control shadow-sm bg-light"
                                value={gst}
                                readOnly
                                tabIndex={-1}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control shadow-sm"
                                placeholder="MRP"
                                value={details.mrp || ""}
                                onChange={e => handleComboDetailChange(combo, "mrp", e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control shadow-sm"
                                placeholder="Sale Price"
                                value={details.salePrice || ""}
                                onChange={e => handleComboDetailChange(combo, "salePrice", e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control shadow-sm"
                                value={"-" + combo.map(v => v.toLowerCase()).join("-")}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control shadow-sm"
                                placeholder="Opening Stock"
                                value={details.openingStock || ""}
                                onChange={e => handleComboDetailChange(combo, "openingStock", e.target.value)}
                              />
                            </td>
                            <td>
                              <div className="form-check form-switch d-flex justify-content-center">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={details.status !== undefined ? details.status : true}
                                  onChange={e => handleComboDetailChange(combo, "status", e.target.checked)}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <hr className="my-4" />
              {/* Product Benefits Section */}
              <div className="mb-4">
                <h5 className="mb-2 fw-bold">Product Benefits</h5>
                {editProduct && editProduct.productBenefits && editProduct.productBenefits[0] && editProduct.productBenefits[0].images && (
                  <div className="mb-2">
                    {editProduct.productBenefits[0].images.map((img, idx) => (
                      <img
                        key={idx}
                        src={`http://localhost:3000/images/uploads/${img}`}
                        alt="Benefit"
                        className="me-2 mb-1 rounded shadow-sm border"
                        style={{ width: 40 }}
                      />
                    ))}
                  </div>
                )}
                <div className="mb-3 border p-2 rounded bg-light">
                  <label className="form-label fw-bold">Benefit Images (Multiple)</label>
                  <input
                    type="file"
                    multiple
                    className="form-control mb-2 shadow-sm"
                    onChange={e => setProductBenefits([{ images: Array.from(e.target.files) }])}
                  />
                </div>
              </div>
              <hr className="my-4" />
              {/* Product Features Section */}
              <div className="mb-4">
                <h5 className="mb-2 fw-bold">Product Features</h5>
                {productFeatures.map((feature, idx) => (
                  <div key={idx} className="row align-items-end mb-2 border p-2 rounded bg-light">
                    <div className="col-md-3">
                      <label className="form-label">Title</label>
                      <input
                        className="form-control shadow-sm"
                        value={feature.title}
                        onChange={e => handleFeatureChange(idx, "title", e.target.value)}
                      />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label">Description</label>
                      <input
                        className="form-control shadow-sm"
                        value={feature.description}
                        onChange={e => handleFeatureChange(idx, "description", e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Image</label>
                      {feature.image && typeof feature.image === "string" && (
                        <img
                          src={`http://localhost:3000/images/uploads/${feature.image}`}
                          alt="Feature"
                          className="me-2 mb-1 rounded shadow-sm border"
                          style={{ width: 40 }}
                        />
                      )}
                      <input
                        type="file"
                        className="form-control shadow-sm"
                        onChange={e => handleFeatureImageChange(idx, e)}
                      />
                    </div>
                    <div className="col-md-1 d-flex align-items-center">
                      {productFeatures.length > 1 && (
                        <button type="button" className="btn btn-danger btn-sm me-1" onClick={() => removeFeature(idx)}>
                          <FaMinus />
                        </button>
                      )}
                      <button type="button" className="btn btn-success btn-sm" onClick={addFeature}>
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <hr className="my-4" />
              {/* Product Videos Section */}
              <div className="mb-4">
                <h5 className="mb-2 fw-bold">Product Videos</h5>
                {productVideos.map((video, idx) => (
                  <div key={idx} className="row align-items-end mb-2">
                    <div className="col-md-10">
                      <label className="form-label">Video Link</label>
                      <input
                        className="form-control shadow-sm"
                        value={video.link}
                        onChange={e => handleVideoChange(idx, e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 d-flex align-items-center">
                      {productVideos.length > 1 && (
                        <button type="button" className="btn btn-danger btn-sm me-1" onClick={() => removeVideo(idx)}>
                          <FaMinus />
                        </button>
                      )}
                      <button type="button" className="btn btn-success btn-sm" onClick={addVideo}>
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-secondary px-4 py-2" onClick={onClose}>Close</button>
                <button type="submit" className="btn btn-primary px-4 py-2 shadow">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;