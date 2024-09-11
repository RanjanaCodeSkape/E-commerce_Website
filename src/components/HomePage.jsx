import { useState, useEffect } from "react";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import styles from "./styles/style.module.css";
import { googleLogout } from "@react-oauth/google";
import { CiSearch } from "react-icons/ci";
import StarRatings from "react-star-ratings";


const HomePage = () => {
  const [productData, setProductData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  
  const recordsPerPage = 9;
  const navigate = useNavigate();

  
  useEffect(() => {
    const savedPage = localStorage.getItem("currentPage");
    const savedSearch = localStorage.getItem("searchQuery");
    const savedCategory = localStorage.getItem("selectedCategory");

    if (savedCategory) {
      setSelectedCategory(savedCategory);
      setCurrentPage(1);
    }

    if (savedPage) setCurrentPage(parseInt(savedPage, 10));
    if (savedSearch) setSearchQuery(savedSearch);

    fetchProducts(savedPage || 1, savedSearch || "", savedCategory || "");
    fetchCategories();
  }, []);

  const fetchProducts = (page, query = "", category = "") => {
    const skip = (page - 1) * recordsPerPage;
    let url = "";

    if (category) {
      url = `https://dummyjson.com/products/category/${category}?limit=${recordsPerPage}&skip=${skip}`;
    } else if (query) {
      url = `https://dummyjson.com/products/search?q=${query}&limit=${recordsPerPage}&skip=${skip}`;
    } else {
      url = `https://dummyjson.com/products?limit=${recordsPerPage}&skip=${skip}`;
    }

    axios
      .get(url)
      .then((response) => {
        if (response.data.products.length === 0 && page !== 1) {
          // setCurrentPage(1);
          fetchProducts(1, query, category);
        } else {
          setProductData(response.data.products);
          setTotalPages(Math.ceil(response.data.total / recordsPerPage));
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  };

  const fetchCategories = () => {
    axios
      .get("https://dummyjson.com/products/categories")
      .then((response) => {
        setCategories(response.data);
     
      })
      .catch((error) => console.error("Error fetching categories:", error));
  };
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  
    if (query) {
      axios
        .get(`https://dummyjson.com/products/search?q=${query}`)
        .then((response) => {
          setSearchResults(response.data.products); 
        })
        .catch((error) => console.error("Error fetching search results:", error));
    } else {
      setSearchResults([]); 
    }

    localStorage.setItem("searchQuery", query);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setCurrentPage(1);
    fetchProducts(1, searchQuery, category);
    localStorage.setItem("selectedCategory", category);
    localStorage.setItem("currentPage", 1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchProducts(newPage, searchQuery, selectedCategory);
    localStorage.setItem("currentPage", newPage);
  };

  const viewProductDetails = (photo) => {
    navigate(`/product-detail/${photo.id}`);
  };

  const renderPagination = () => {
    if (totalPages <= 1) {
      return null;
    }
    const pageNumbers = [];
    const visiblePages = 2;
    const startPage = Math.max(2, currentPage - visiblePages);
    const endPage = Math.min(totalPages - 1, currentPage + visiblePages);

    pageNumbers.push(
      <li key="prev" className="page-item">
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
      </li>
    );

    pageNumbers.push(
      <li key={1} className={`page-item ${currentPage === 1 ? "active" : ""}`}>
        <button className="page-link" onClick={() => handlePageChange(1)}>
          1
        </button>
      </li>
    );

    if (startPage > 2) {
      pageNumbers.push(
        <li key="start-ellipsis" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push(
        <li key="end-ellipsis" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    pageNumbers.push(
      <li
        key={totalPages}
        className={`page-item ${currentPage === totalPages ? "active" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      </li>
    );

    pageNumbers.push(
      <li key="next" className="page-item">
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </li>
    );

    return <ul className={`pagination ${styles.pagination}`}>{pageNumbers}</ul>;
  };



  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className={styles.HomePageWidth}>
      <div className={styles.HomeMainPage}>
        <div className={styles.HomeHeaderPage}>
          <div className={styles.LogoHeader}>

          <img src='https://d1csarkz8obe9u.cloudfront.net/posterpreviews/photography-logo%2C-photography-studio-logo-design-template-42261fff3bd70db2b7e9b5338fa1c03a_screen.jpg?ts=1667205867' alt='' style={{ width: "100px", height: "50px", borderRadius: "10px" }} />
            <h5 style={{ marginLeft: "40px" }}>Home</h5>
            <h5>About</h5>
            <h5>Contact Us</h5>
            <h5>Categories</h5>
          </div>
          <div style={{ position: "relative" }} className={styles.SearchDiv}>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
              className={styles.inputHeader}
            />
            <CiSearch
              style={{
                position: "absolute",
                left: "5px",
                top: "13px",
                fontSize: "25px",
              }}
            />
            {searchResults.length > 0 && (
              <div className={styles.searchResultsDropdown} onMouseLeave={false}>
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

      <div className={styles.PokemonDiv}>
      <div className={styles.CategoriesSection}>
  <h5>Filter by Category:</h5>
  <div className={styles.FilterDiv}>
  <p
    className={`${!selectedCategory ? styles.selectedCategory : styles.defaultCategory}`}
    onClick={() => handleCategoryChange({ target: { value: "" } })}
    defaultValue
  >
    All Categories
  </p>
  {categories.map((category) => (
    <p
      key={category.slug}
      className={`${selectedCategory === category.slug ? styles.selectedCategory : styles.defaultCategory}`}
      onClick={() => handleCategoryChange({ target: { value: category.slug } })}
    >
      {category.name}
    </p>
  ))}
</div>

</div>


        <div className={styles.ItemsSection}>
          {productData.length > 0 ? (
            productData.map((product) => (
              <div
                className={styles.pokemonPartDiv}
                key={product.id}
                
              >
                <Card className={styles.pokemonPartDiv1}>
                  <Carousel
                    autoPlay={true}
                    interval={2000}
                    showArrows={false}
                    infiniteLoop={true}
                    showThumbs={false}
                  >
                    {product.images.map((image, index) => (
                      <div key={index.id} 
                      className={styles.ImgDivCard}
                     
                      >
                        <Card.Img
                          src={image}
                          alt={`Product ${index.id}`}
                          onError={(e) => {
                            e.target.src = product.thumbnail;
                          }}
                          style={{
                            width: "100%",
                            objectFit: "cover",
                            position:"relative"
                          }}
                        />
                     
                      </div>
                    ))}
                  </Carousel>
                  <Card.Body
                    style={{ width: "100%", background: "#f0eeee" , cursor:"pointer"}}
                    className={styles.cardDivCont}
                    onClick={() => viewProductDetails(product)}
                  >
                    <Card.Title>{product.title}</Card.Title>
                    <p className={styles.paraCard}>{product.description}</p>
                    <p> price-: {product.price} </p>
                    <p>
                      rating-:
                      <StarRatings
                        rating={product.rating}
                        starRatedColor="gold"
                        starDimension="25px"
                        starSpacing="0px"
                        numberOfStars={5}
                        name={product.rating}
                      />
                    </p>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <p>No data found</p>
          )}
        </div>
      </div>
      {renderPagination()}
    </div>
  );
};

export default HomePage;
