import { Helmet } from 'react-helmet';
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import styles from './styles/style.module.css';
import { FaWhatsapp, FaFacebook, FaTelegram, FaTwitter } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';

const ProductDetail = () => {
  const { id } = useParams();
  const [photo, setPhoto] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://dummyjson.com/products/${id}`);
        console.log(response.data); 
        setPhoto(response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };
    fetchProduct();
  }, [id]);
  

  const shareUrl = photo ? `${window.location.origin}/product-detail/${photo.id}` : window.location.href;

  function copyToClipboard(e) {
    textAreaRef.current.select();
    document.execCommand('copy');
    e.target.focus();
    setCopySuccess('Copied!');
  }

  const openShareLink = (url) => {
    window.open(url, '_blank');
  };

  return (
    <>
    <Helmet>
  <title>{photo.title || 'Product Title'}</title>
  <meta property="og:title" content={photo.title || 'Product Title'} />
  <meta property="og:description" content={photo.description || 'Product description goes here.'} />
  <meta property="og:image" content={photo.thumbnail || 'fallback-image-url'} />
  <meta property="og:url" content={shareUrl} />
  <meta property="og:type" content="website" />
</Helmet>

      <div className={styles.ProductDetailContainer}>
        <div className={styles.itemCard}>
          <Carousel autoPlay={true} interval={2000} infiniteLoop={true} showThumbs={false}>
            {photo.images && photo.images.length > 0 ? (
              photo.images.map((image, index) => (
                <div key={index} className={styles.ImgDivCard}>
                  <img
                    src={image}
                    alt={`Product ${index}`}
                    onError={(e) => {
                      e.target.src = photo.thumbnail || 'fallback-thumbnail-url'; // Fallback image
                    }}
                    style={{
                      width: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              ))
            ) : (
              <p>No images available for this product.</p>
            )}
          </Carousel>
        </div>

        <div className={styles.itemCard1}>
          <h1>Product Detail Page</h1>
          <h3>
            Title: <span>{photo.title || 'No Title Available'}</span>
          </h3>
          <h3>
            Description: <span>{photo.description || 'No Description Available'}</span>
          </h3>
          <h3>
            Price: <span>{photo.price || 'Price not available'}</span>
          </h3>
          <h3>
            Rating: 
            <span>
              <StarRatings
                rating={photo.rating || 0}
                starRatedColor="gold"
                starDimension="35px"
                starSpacing="3px"
                numberOfStars={5}
                name="rating"
              />
            </span>
          </h3>
        </div>

        <div className={styles.modalShare}>
          <button onClick={handleShow}>Share</button>

          <Modal show={show} onHide={handleClose} dialogClassName={`${styles.modalWidth}`}>
            <Modal.Body className={`modal-content ${styles.modalContentLink}`}>
              <div className={styles.XModal} onClick={handleClose}>
                X
              </div>
              <div className={styles.copyLinkModal}>
                <form>
                  <textarea ref={textAreaRef} value={shareUrl} readOnly />
                </form>
                <button onClick={copyToClipboard}>Copy</button>
                {copySuccess && <span>{copySuccess}</span>}
              </div>

              <div className={styles.bodyModal}>
                <div>Share on</div>
                <div className={styles.iconContainer}>
                <FaWhatsapp
  size={40}
  onClick={() => openShareLink(`https://api.whatsapp.com/send?text=${photo.title} - ${photo.description} ${shareUrl}`)}
/>
<FaFacebook
  size={40}
  onClick={() => openShareLink(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`)}
/>
<FaTelegram
  size={40}
  onClick={() => openShareLink(`https://t.me/share/url?url=${shareUrl}&text=${photo.title} - ${photo.description}`)}
/>
<FaTwitter
  size={40}
  onClick={() => openShareLink(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${photo.title} - ${photo.description}`)}
/>
                </div>
              </div>

              <div className={styles.footerModal}>
                <button onClick={handleClose}>Close</button>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;

