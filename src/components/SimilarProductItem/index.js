import './index.css'

const SimilarProductItem = props => {
  const {details} = props
  const {imageUrl, title, brand, price, rating} = details
  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-thumbnail"
      />
      <h1 className="similar-title">{title}</h1>
      <p className="similar-brand">by {brand}</p>
      <div className="similar-product-details">
        <p className="similar-price">Rs {price}/-</p>
        <div className="similar-rating-con">
          <p className="similar-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
