import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate, useLoaderData } from "react-router-dom";

function NewPostPage() {
  const data = useLoaderData(); // Gets post data if editing
  const [value, setValue] = useState(data?.postDetail?.desc || "");
  const [images, setImages] = useState(data?.images || []);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    const postPayload = {
      postData: {
        title: inputs.title,
        price: parseInt(inputs.price),
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
        // --- EDIT MODE ---
        await apiRequest.put(`/posts/${data.id}`, postPayload);
        navigate("/" + data.id);
      } else {
        // --- CREATE MODE ---
        const res = await apiRequest.post("/posts", postPayload);
        navigate("/" + res.data.id);
      }
    } catch (err) {
      console.error(err);
      setError("Data transmission failed. Please verify all telemetry fields.");
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>{data ? "Modify Listing Assets" : "Initialize New Listing"}</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" defaultValue={data?.title} placeholder="e.g. Neo-Tokyo Penthouse" />
            </div>
            <div className="item">
              <label htmlFor="price">Price ($)</label>
              <input id="price" name="price" type="number" defaultValue={data?.price} />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" defaultValue={data?.address} />
            </div>
            <div className="item description">
              <label htmlFor="desc">Detailed Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" defaultValue={data?.city} />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedrooms</label>
              <input min={1} id="bedroom" name="bedroom" type="number" defaultValue={data?.bedroom} />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathrooms</label>
              <input min={1} id="bathroom" name="bathroom" type="number" defaultValue={data?.bathroom} />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" defaultValue={data?.latitude} placeholder="e.g. 51.5074" />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" defaultValue={data?.longitude} placeholder="e.g. -0.1278" />
            </div>
            <div className="item">
              <label htmlFor="type">Transaction Type</label>
              <select name="type" defaultValue={data?.type}>
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property Type</label>
              <select name="property" defaultValue={data?.property}>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities" defaultValue={data?.postDetail?.utilities}>
                <option value="owner">Owner Responsible</option>
                <option value="tenant">Tenant Responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet" defaultValue={data?.postDetail?.pet}>
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Requirement</label>
              <input id="income" name="income" type="text" defaultValue={data?.postDetail?.income} placeholder="e.g. 3x Rent" />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" defaultValue={data?.postDetail?.size} />
            </div>
            <div className="item">
              <label htmlFor="school">Nearby School (m)</label>
              <input min={0} id="school" name="school" type="number" defaultValue={data?.postDetail?.school} />
            </div>
            <div className="item">
              <label htmlFor="bus">Nearby Bus (m)</label>
              <input min={0} id="bus" name="bus" type="number" defaultValue={data?.postDetail?.bus} />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Nearby Restaurant (m)</label>
              <input min={0} id="restaurant" name="restaurant" type="number" defaultValue={data?.postDetail?.restaurant} />
            </div>
            <button className="sendButton">{data ? "Commit Updates" : "Publish Listing"}</button>
            {error && <span className="error">{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        <div className="imageGrid">
          {images.map((image, index) => (
            <img src={image} key={index} alt="Preview" />
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
        <p className="uploadHint">Upload High-Res Assets</p>
      </div>
    </div>
  );
}

export default NewPostPage;