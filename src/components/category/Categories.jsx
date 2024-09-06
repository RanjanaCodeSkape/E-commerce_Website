import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import styles from './styles/style.module.css';

const PEXELS_API_KEY = 'qg8SwC3UXNp1Yg78f8ww3A3nhna8Yn5wwgY5TQVEAG8DpGJGIXBfiqFg';

const Categories = () => {
  const [categories] = useState(['All', 'Nature', 'Technology', 'Business', 'People']);
  const [photos, setPhotos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const url = selectedCategory === 'All'
          ? `https://api.pexels.com/v1/curated`
          : `https://api.pexels.com/v1/search?query=${selectedCategory}`;
        
        const { data } = await axios.get(url, {
          headers: { Authorization: PEXELS_API_KEY },
        });
        
        setPhotos(data.photos);
      } catch (error) {
        console.error("Error fetching data from Pexels Data:", error);
      }
    };

    fetchPhotos();
  }, [selectedCategory]);

  const handleCategoryChange = (category) => setSelectedCategory(category);

  return (
    <div className={styles.HomePageWidth}>
      <div className={styles.MarginCategory}>
        <div className={styles.CategoryDiv}>
          <h2>Categories</h2>
          <div className={styles.CategoriesSection}>
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
        </div>
        <div className={styles.ItemsSection}>
          {photos.length > 0 ? (
            photos.map((photo) => (
              <Card key={photo.id} className={styles.itemCard}>
                <img src={photo.src.medium} alt={photo.alt} />
                <Card.Body>
                  <Card.Title>Photographer: <span>{photo.photographer}</span></Card.Title>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No photos found for this category.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
