import { Helmet } from "react-helmet";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import StarRatings from "react-star-ratings";
import axios from "axios";
import styles from "./styles/style.module.css";
import { IoMdShare } from "react-icons/io";
import { FaWhatsapp, FaFacebook, FaTelegram, FaTwitter } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import metaDecorator from "../../metaDecorator.json";

const stripePromise =
  "pk_test_51PrcexJCd7dRiJZhs0rkc6gliw96r0G1AoMoqbjnhZ4Ypx3ExFZLPdPjl4gedJT1myIDg7Hwiye8uk6nX3mjCB5j00cneeEq95";

const ProductDetail = () => {
  const { id } = useParams();
  const [photo, setPhoto] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [copySuccess, setCopySuccess] = useState("");
  const textAreaRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://dummyjson.com/products/${id}`
        );
        setPhoto(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const shareUrl = photo
    ? `${window.location.origin}/product-detail/${photo.id}`
    : window.location.href;

  function copyToClipboard(e) {
    textAreaRef.current.select();
    document.execCommand("copy");
    e.target.focus();
    setCopySuccess("Copied!");
  }

  const openShareLink = (url) => {
    window.open(url, "_blank");
  };

  const navigate = useNavigate();
  const navigatetoHomePage = () => {
    navigate("/homepage");
  };

  const handleStripeCheckout = async () => {
    try {
      const stripe = await stripePromise;

      // You would ideally want to post this request to a custom backend endpoint
      const response = await fetch(
        "https://your-backend-url.com/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            line_items: [
              {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: photo.title,
                    description: photo.description,
                  },
                  unit_amount: photo.price * 100,
                },
                quantity: 1,
              },
            ],
            mode: "payment",
            success_url: `${window.location.origin}/success`,
            cancel_url: `${window.location.origin}/cancel`,
          }),
        }
      );

      const session = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(
          "Error redirecting to Stripe checkout:",
          result.error.message
        );
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>{photo.title || "Product Title"}</title>
        <meta property="og:title" content={photo.title || "Product Title"} />
        <meta
          property="og:description"
          content={photo.description || "Product description goes here."}
        />
        <meta
          property="og:image"
          content={ metaDecorator.hostname + photo.thumbnail || "fallback-image-url"}
        />
        <meta property="og:url" content={metaDecorator.hostname + shareUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className={styles.ProductDetailContainer}>
        <button onClick={navigatetoHomePage} style={{ textAlign: "end" }}>
          Back
        </button>
        <h4 className={styles.titleProductHead}>{photo.title}</h4>
        <div className={styles.ProductDetailContainer1}>
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
                        e.target.src =
                          photo.thumbnail || "fallback-thumbnail-url";
                      }}
                      style={{
                        width: "100%",
                        objectFit: "contain",
                        position: "relative",
                      }}
                    />
                    <div className={styles.absoluteShare}>
                      <div
                        onClick={handleShow}
                        className={styles.absoluteShare1}
                      >
                        Share
                        <IoMdShare />
                      </div>

                      <div className={styles.absoluteShare2}>
                        {photo.tags.map((tag) => {
                          return (
                            <>
                              <div>{tag}</div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No images available for this product.</p>
              )}
            </Carousel>
          </div>

          <div className={styles.itemCard1}>
            <h3>
              Title: <span>{photo.title || "No Title Available"}</span>
            </h3>
            <h3>
              Description:{" "}
              <span>{photo.description || "No Description Available"}</span>
            </h3>
            <h3>
              Price: <span>${photo.price}</span>
            </h3>

            {/* <h3>
              Dimensions: <span>{photo.dimensions.width}</span>X{" "}
              <span>{photo.dimensions.height}</span>X
              <span>{photo.dimensions.depth}</span>
            </h3> */}

            <h3>
              Warranty:{" "}
              <span>{photo.warrantyInformation || "Price not available"}</span>
            </h3>
            <h3>
              Shipping:{" "}
              <span>{photo.shippingInformation || "Price not available"}</span>
            </h3>

            <h3>
              Availability:{" "}
              <span>{photo.availabilityStatus || "Price not available"}</span>
            </h3>
            <h3>
              Return Policy:{" "}
              <span>{photo.returnPolicy || "Price not available"}</span>
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

            {/* Redirects to Stripe Payment Link */}
            {/* <button onClick={handleStripeCheckout}>Buy Now</button> */}
          </div>

          <div className={styles.modalShare}>
            <Modal
              show={show}
              onHide={handleClose}
              dialogClassName={`${styles.modalWidth}`}
            >
              <Modal.Body
                className={`modal-content ${styles.modalContentLink}`}
              >
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
                      onClick={() =>
                        openShareLink(
                          `https://api.whatsapp.com/send?text=${photo.title} - ${photo.thumbnail} -${photo.description} - ${shareUrl}`
                        )
                      }
                    />
                    <FaFacebook
                      size={40}
                      onClick={() =>
                        openShareLink(
                          `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
                        )
                      }
                    />
                    <FaTelegram
                      size={40}
                      onClick={() =>
                        openShareLink(
                          `https://t.me/share/url?url=${shareUrl}&text=${photo.title} - ${photo.description}`
                        )
                      }
                    />
                    <FaTwitter
                      size={40}
                      onClick={() =>
                        openShareLink(
                          `https://twitter.com/intent/tweet?url=${shareUrl}&text=${photo.title} - ${photo.description}`
                        )
                      }
                    />
                  </div>
                </div>

                <div className={styles.footerModal}>
                  <button onClick={handleClose}>cancel</button>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
        {/* Reviews  */}
        <div className={styles.reviewsCustomer}>
          <h2>Reviews-:</h2>
          {photo.reviews && photo.reviews.length > 0 ? (
            photo.reviews.map((review, index) => (
              <div key={index} className={styles.reviewContainer}>
                <h4>Name- {review.reviewerName}</h4>
                <p>Comment- {review.comment}</p>
                <div style={{ marginTop: "-15px" }}>
                  Rating-
                  <StarRatings
                    rating={review.rating}
                    starRatedColor="gold"
                    starDimension="20px"
                    starSpacing="2px"
                    numberOfStars={5}
                    name="review-rating"
                  />
                </div>
                <small>{new Date(review.date).toLocaleDateString()}</small>
              </div>
            ))
          ) : (
            <p>No reviews available for this product.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
