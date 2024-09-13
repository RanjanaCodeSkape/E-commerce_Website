
import styles from "../styles/style.module.css";
import { CiSearch } from "react-icons/ci";
import { googleLogout } from "@react-oauth/google";
import {  useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
const Navbar = ({ searchQuery, handleSearch, searchResults, viewProductDetails }) => {
    Navbar.propTypes = {
        searchQuery: PropTypes.string,
        handleSearch: PropTypes.func.isRequired,
        searchResults: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number,
            title: PropTypes.string,
            thumbnail: PropTypes.string,
          })
        ),
        viewProductDetails: PropTypes.func.isRequired,
      };
  
    const navigate = useNavigate();

    const onSearchChange = (event) => {
      const query = event.target.value;
      handleSearch(event);

      if (query.trim() === "") {
        searchResults = []; 
      }
    };
    
  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className={styles.HomeMainPage}>
    <div className={styles.HomeHeaderPage}>
      <div className={styles.LogoHeader}>
        <img
          src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/photography-logo%2C-photography-studio-logo-design-template-42261fff3bd70db2b7e9b5338fa1c03a_screen.jpg?ts=1667205867"
          alt="Logo"
          style={{ width: "100px", height: "50px", borderRadius: "10px" }}
        />
        <h5  style={{ marginLeft: "40px" }} >Home</h5>
        <h5>About</h5>
        <h5>Contact Us</h5>
        <h5>Categories</h5>
      </div>
      <div style={{ position: "relative" }} className={styles.SearchDiv}>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={onSearchChange}
          className={styles.inputHeader}
        />
        <CiSearch
          style={{
            position: "absolute",
            left: "5px",
            top: "11px",
            fontSize: "25px",
            color: "black",
          }}
        />

{Array.isArray(searchResults) && searchResults.length > 0 && (
  <div className={styles.searchResultsDropdown}>
    {searchResults.map((result) => (
      <div
        key={result.id}
        className={styles.searchResultItem}
        onClick={() => viewProductDetails(result)}
      >
        <img
          src={result.thumbnail}
          alt={result.title}
          className={styles.searchResultImage}
        />
        <span>{result.title}</span>
      </div>
    ))}
  </div>
)}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
    </div>
  );
};

export default Navbar;

