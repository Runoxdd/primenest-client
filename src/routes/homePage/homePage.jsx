import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">
            Elevate Your Living Standard with <span>PrimeNest</span>
          </h1>
          <p className="description">
            Discover a curated collection of premium properties tailored to your 
            lifestyle. From high-rise urban sanctuaries to serene coastal retreats, 
            we connect you with the most exclusive real estate opportunities 
            through seamless AI-driven technology.
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>12k+</h1>
              <h2>Elite Properties</h2>
            </div>
            <div className="box">
              <h1>450</h1>
              <h2>Luxury Partners</h2>
            </div>
            <div className="box">
              <h1>24/7</h1>
              <h2>Smart Support</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="Modern Architecture" />
        <div className="glow"></div>
      </div>
    </div>
  );
}

export default HomePage;