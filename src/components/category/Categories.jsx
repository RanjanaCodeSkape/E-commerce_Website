import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/style.module.css';
import { CiSearch } from "react-icons/ci";
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const PEXELS_API_KEY = 'qg8SwC3UXNp1Yg78f8ww3A3nhna8Yn5wwgY5TQVEAG8DpGJGIXBfiqFg';

const Categories = () => {
  const [categories] = useState(['All', 'Nature', 'Technology', 'Business', 'People']);
  const [photos, setPhotos] = useState([]);
  const [originalPhotos, setOriginalPhotos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [photosPerPage] = useState(9);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const url = selectedCategory === 'All'
          ? `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${photosPerPage}`
          : `https://api.pexels.com/v1/search?query=${searchTerm || selectedCategory}&page=${currentPage}&per_page=${photosPerPage}`;

        const { data } = await axios.get(url, {
          headers: { Authorization: PEXELS_API_KEY },
        });
        
        setPhotos(data.photos);
        setOriginalPhotos(data.photos); // Store original photos for filtering
        setTotalPhotos(data.total_results || data.photos.length);
      } catch (error) {
        console.error("Error fetching data from Pexels API:", error);
      }
    };

    fetchPhotos();
  }, [selectedCategory, searchTerm, currentPage, photosPerPage]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); 
  };

  const viewPhotoDetails = (photo) => {
    navigate(`/product-detail/${photo.id}`, { state: { photo } });
  };

  const filteredPhotos = originalPhotos.filter((photo) =>
    photo.photographer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalPhotos / photosPerPage);
  const numbers = [...Array(totalPages).keys()].map(n => n + 1);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <div className={styles.HomePageWidth}>
      <div className={styles.HomeMainPage}>
        <div className={styles.HomeHeaderPage}>
          <div className={styles.LogoHeader}>
            <img
              src='https://d1csarkz8obe9u.cloudfront.net/posterpreviews/photography-logo%2C-photography-studio-logo-design-template-42261fff3bd70db2b7e9b5338fa1c03a_screen.jpg?ts=1667205867'
              alt=''
              style={{ width: "100px", height: "50px", borderRadius: "10px" }}
            />
            <h5 style={{ marginLeft: "40px" }}>Home</h5>
            <h5>About</h5>
            <h5>Contact us</h5>
            <h5>Categories</h5>
          </div>
          <div style={{ position: "relative" }} className={styles.SearchDiv}>
            <input
              type="text"
              placeholder="Search by photographer..."
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
            <CiSearch style={{ position: "absolute", left: "5px", top: "13px", fontSize: "25px" }} />
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className={styles.PokemonDiv}>
        <div className={styles.CategoriesSection}>
          <h2>Categories</h2>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className={styles.ItemsSection}>
          {filteredPhotos.length > 0 ? (
            filteredPhotos.map((photo) => (
              <div key={photo.id} className={styles.itemCard} onClick={() => viewPhotoDetails(photo)}>
                <img src={photo.src.medium} alt={photo.alt} />
                <div className={styles.itemDetails}>
                  <h3>{photo.photographer}</h3>
                </div>
              </div>
            ))
          ) : (
            <p>No photos found for this category.</p>
          )}
        </div>
      </div>

      <ul className={`pagination ${styles.pagination}`}>
        <li className='page-item'>
          <a href='#' className='page-link' onClick={prevPage}>Prev</a>
        </li>
        {numbers.map((n) => (
          <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={n}>
            <a href='#' className='page-link' onClick={() => changePage(n)}>{n}</a>
          </li>
        ))}
        <li className='page-item'>
          <a href='#' className='page-link' onClick={nextPage}>Next</a>
        </li>
      </ul>
    </div>
  );
};

export default Categories;
