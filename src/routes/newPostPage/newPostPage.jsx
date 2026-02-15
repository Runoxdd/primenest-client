import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate, useLoaderData } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, 
  DollarSign, 
  MapPin, 
  FileText, 
  Building2,
  Bed, 
  Bath, 
  Maximize,
  MapPinned,
  Tag,
  PawPrint,
  Wrench,
  Wallet,
  GraduationCap,
  Bus,
  UtensilsCrossed,
  Loader2,
  AlertCircle,
  ChevronDown,
  Send,
  Coins
} from "lucide-react";
import { getAvailableCurrencies, getCurrencySymbol } from "../../lib/utils";

function NewPostPage() {
  const data = useLoaderData();
  const [value, setValue] = useState(data?.postDetail?.desc || "");
  const [images, setImages] = useState(data?.images || []);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    const postPayload = {
      postData: {
        title: inputs.title,
        price: parseInt(inputs.price),
        currency: inputs.currency,
        address: inputs.address,
        city: inputs.city,
        bedroom: parseInt(inputs.bedroom),
        bathroom: parseInt(inputs.bathroom),
        type: inputs.type,
        property: inputs.property,
        latitude: inputs.latitude,
        longitude: inputs.longitude,
        images: images,
      },
      postDetail: {
        desc: value,
        utilities: inputs.utilities,
        pet: inputs.pet,
        income: inputs.income,
        size: parseInt(inputs.size),
        school: parseInt(inputs.school),
        bus: parseInt(inputs.bus),
        restaurant: parseInt(inputs.restaurant),
      },
    };

    try {
      if (data) {
        await apiRequest.put(`/posts/${data.id}`, postPayload);
        navigate("/" + data.id);
      } else {
        const res = await apiRequest.post("/posts", postPayload);
        navigate("/" + res.data.id);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save listing. Please check all fields and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="new-post-page">
      {/* Form Section */}
      <motion.div 
        className="form-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="form-container">
          <div className="form-header">
            <h1>{data ? "Edit Listing" : "Create New Listing"}</h1>
            <p>Fill in the details below to {data ? "update your" : "create a new"} property listing</p>
          </div>

          <form onSubmit={handleSubmit} className="listing-form">
            {/* Error Message */}
            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Basic Information */}
            <div className="form-section-group">
              <h2 className="section-title">
                <Home size={18} />
                Basic Information
              </h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="title">Title</label>
                  <div className="input-wrapper">
                    <input
                      id="title"
                      name="title"
                      type="text"
                      defaultValue={data?.title}
                      placeholder="e.g. Modern Downtown Apartment"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="currency">Currency</label>
                  <div className="select-wrapper">
                    <select name="currency" defaultValue={data?.currency || "USD"} required>
                      <option value="USD">USD ($)</option>
                      <option value="NGN">NGN (₦)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CNY">CNY (¥)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="AED">AED (د.إ)</option>
                      <option value="SAR">SAR (﷼)</option>
                      <option value="ZAR">ZAR (R)</option>
                      <option value="KES">KES (KSh)</option>
                      <option value="GHS">GHS (GH₵)</option>
                    </select>
                    <ChevronDown size={18} className="select-icon" />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price</label>
                  <div className="input-wrapper">
                    <Coins size={18} className="input-icon" />
                    <input
                      id="price"
                      name="price"
                      type="number"
                      defaultValue={data?.price}
                      placeholder="Enter price"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <div className="input-wrapper">
                    <MapPin size={18} className="input-icon" />
                    <input
                      id="address"
                      name="address"
                      type="text"
                      defaultValue={data?.address}
                      placeholder="Enter address"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <div className="input-wrapper">
                    <Building2 size={18} className="input-icon" />
                    <input
                      id="city"
                      name="city"
                      type="text"
                      defaultValue={data?.city}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="type">Transaction Type</label>
                  <div className="select-wrapper">
                    <select name="type" defaultValue={data?.type || "rent"} required>
                      <option value="rent">For Rent</option>
                      <option value="buy">For Sale</option>
                    </select>
                    <ChevronDown size={18} className="select-icon" />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="property">Property Type</label>
                  <div className="select-wrapper">
                    <select name="property" defaultValue={data?.property || "apartment"} required>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="condo">Condo</option>
                      <option value="land">Land</option>
                    </select>
                    <ChevronDown size={18} className="select-icon" />
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="form-section-group">
              <h2 className="section-title">
                <Maximize size={18} />
                Property Details
              </h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="bedroom">Bedrooms</label>
                  <div className="input-wrapper">
                    <Bed size={18} className="input-icon" />
                    <input
                      id="bedroom"
                      name="bedroom"
                      type="number"
                      min={1}
                      defaultValue={data?.bedroom || 1}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bathroom">Bathrooms</label>
                  <div className="input-wrapper">
                    <Bath size={18} className="input-icon" />
                    <input
                      id="bathroom"
                      name="bathroom"
                      type="number"
                      min={1}
                      defaultValue={data?.bathroom || 1}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="size">Size (sqft)</label>
                  <div className="input-wrapper">
                    <Maximize size={18} className="input-icon" />
                    <input
                      id="size"
                      name="size"
                      type="number"
                      min={0}
                      defaultValue={data?.postDetail?.size}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="utilities">Utilities</label>
                  <div className="select-wrapper">
                    <select name="utilities" defaultValue={data?.postDetail?.utilities || "owner"}>
                      <option value="owner">Owner Responsible</option>
                      <option value="tenant">Tenant Responsible</option>
                      <option value="shared">Shared</option>
                    </select>
                    <ChevronDown size={18} className="select-icon" />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="pet">Pet Policy</label>
                  <div className="select-wrapper">
                    <select name="pet" defaultValue={data?.postDetail?.pet || "allowed"}>
                      <option value="allowed">Pets Allowed</option>
                      <option value="not-allowed">No Pets</option>
                    </select>
                    <ChevronDown size={18} className="select-icon" />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="income">Income Requirement</label>
                  <div className="input-wrapper">
                    <Wallet size={18} className="input-icon" />
                    <input
                      id="income"
                      name="income"
                      type="text"
                      defaultValue={data?.postDetail?.income}
                      placeholder="e.g. 3x Rent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="form-section-group">
              <h2 className="section-title">
                <MapPinned size={18} />
                Location Coordinates
              </h2>
              <div className="form-grid two-col">
                <div className="form-group">
                  <label htmlFor="latitude">Latitude</label>
                  <div className="input-wrapper">
                    <input
                      id="latitude"
                      name="latitude"
                      type="text"
                      defaultValue={data?.latitude}
                      placeholder="e.g. 51.5074"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="longitude">Longitude</label>
                  <div className="input-wrapper">
                    <input
                      id="longitude"
                      name="longitude"
                      type="text"
                      defaultValue={data?.longitude}
                      placeholder="e.g. -0.1278"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby Amenities */}
            <div className="form-section-group">
              <h2 className="section-title">
                <GraduationCap size={18} />
                Nearby Amenities (meters)
              </h2>
              <div className="form-grid three-col">
                <div className="form-group">
                  <label htmlFor="school">School</label>
                  <div className="input-wrapper">
                    <GraduationCap size={18} className="input-icon" />
                    <input
                      id="school"
                      name="school"
                      type="number"
                      min={0}
                      defaultValue={data?.postDetail?.school || 0}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bus">Bus Stop</label>
                  <div className="input-wrapper">
                    <Bus size={18} className="input-icon" />
                    <input
                      id="bus"
                      name="bus"
                      type="number"
                      min={0}
                      defaultValue={data?.postDetail?.bus || 0}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="restaurant">Restaurant</label>
                  <div className="input-wrapper">
                    <UtensilsCrossed size={18} className="input-icon" />
                    <input
                      id="restaurant"
                      name="restaurant"
                      type="number"
                      min={0}
                      defaultValue={data?.postDetail?.restaurant || 0}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="form-section-group">
              <h2 className="section-title">
                <FileText size={18} />
                Description
              </h2>
              <div className="form-group full-width">
                <ReactQuill 
                  theme="snow" 
                  onChange={setValue} 
                  value={value}
                  placeholder="Write a detailed description of your property..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="submit-button"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.99 }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>{data ? "Update Listing" : "Publish Listing"}</span>
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Image Upload Section */}
      <motion.div 
        className="upload-section"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="upload-container">
          <div className="upload-header">
            <h2>Property Images</h2>
            <p>Upload high-quality images of your property</p>
          </div>

          <div className="image-grid">
            {images.map((image, index) => (
              <motion.div 
                key={index} 
                className="image-preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <img src={image} alt={`Preview ${index + 1}`} />
                <button 
                  className="remove-image"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  type="button"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </div>

          <UploadWidget
            uwConfig={{
              multiple: true,
              cloudName: "dfui2sgjw",
              uploadPreset: "estate",
              folder: "posts",
            }}
            setState={setImages}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default NewPostPage;
