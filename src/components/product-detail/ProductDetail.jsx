import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import styles from './styles/style.module.css';
import StarRatings from 'react-star-ratings';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import {
  FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon,
  WhatsappShareButton, WhatsappIcon, TelegramShareButton, TelegramIcon,
} from "react-share";
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
        setPhoto(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const shareUrl = photo ? `${window.location.origin}/product-detail/${photo.id}` : window.location.href;
  // const shareUrl = 'https://www.instagram.com/'

  function copyToClipboard(e) {
    textAreaRef.current.select();
    document.execCommand('copy');
    e.target.focus();
    setCopySuccess('Copied!');
  }

  return (
    <>
      <Helmet>
        <title>{photo.title || 'Product Title'}</title>
        <link href={shareUrl}/>
        <meta name='title' property="og:title" content={photo.title || 'Product Title'} />
        <meta name='description' property="og:description" content={photo.description || 'Product description goes here.'} />
        <meta name='image' property="og:image" content={photo.thumbnail || (photo.images && photo.images[0]) || 'fallback-image-url'} />
        <meta name='url' property="og:url" content={shareUrl} />
        {/* <meta  property="og:type" content="website" /> */}
      </Helmet>

      <div className={styles.ProductDetailContainer}>
        <div className={styles.itemCard}>
          <Carousel
            autoPlay={true}
            interval={2000}
            infiniteLoop={true}
            showThumbs={false}
          >
            {photo.images && photo.images.length > 0 ? (
              photo.images.map((image, index) => (
                <div key={index} className={styles.ImgDivCard}>
                  <img
                    src={image}
                    alt={`Product ${index}`}
                    onError={(e) => {
                      e.target.src = photo.thumbnail || "fallback-thumbnail-url"; // Fallback image
                    }}
                    style={{
                      width: "100%",
                      objectFit: "cover"
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
          <h3>Title: <span>{photo.title || 'No Title Available'}</span></h3>
          <h3>Description: <span>{photo.description || 'No Description Available'}</span></h3>
          <h3>Price: <span>{photo.price ? `${photo.price} $` : 'Price not available'}</span></h3>
          <h3>Rating: <span>
            <StarRatings
              rating={photo.rating || 0}
              starRatedColor="gold"
              starDimension="35px"
              starSpacing="3px"
              numberOfStars={5}
              name="rating"
            />
          </span></h3>
        </div>

        <div className={styles.modalShare}>
          <button onClick={handleShow}>Share</button>

          <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" dialogClassName={`${styles.modalWidth}`}>
            <Modal.Body className={`modal-content ${styles.modalContentLink}`}>
              <div className={styles.XModal} onClick={handleClose}>X</div>
              <div className={styles.copyLinkModal}>
                <form>
                  <textarea ref={textAreaRef} value={shareUrl} readOnly />
                </form>
                <button onClick={copyToClipboard}>Copy</button>
                {copySuccess && <span>{copySuccess}</span>}
              </div>
              <div className={styles.bodyModal}>
                <div>Share on</div>
                <WhatsappShareButton url={shareUrl} title={photo.title} description={photo.description}>
                  <WhatsappIcon size={40} round={true} />
                </WhatsappShareButton>
                <FacebookShareButton url={shareUrl}>
                  <FacebookIcon size={40} round={true} />
                </FacebookShareButton>
                <TelegramShareButton url={shareUrl}>
                  <TelegramIcon size={40} round={true} />
                </TelegramShareButton>
                <TwitterShareButton url={shareUrl}>
                  <TwitterIcon size={40} round={true} />
                </TwitterShareButton>
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
