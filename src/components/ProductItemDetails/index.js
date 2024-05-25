import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Component} from 'react'
import Header from '../Header'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstatn = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAIL',
  progress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarList: [],
    count: 1,
    apiStatus: apiStatusConstatn.initial,
    errmsg: '',
  }

  componentDidMount() {
    this.getProductDetails()
  }

  onDecrease = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState({count: count - 1})
    }
  }

  onIncrease = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  getDetails = data => {
    const updatedData = {
      id: data.id,
      imageUrl: data.image_url,
      description: data.description,
      title: data.title,
      availability: data.availability,
      rating: data.rating,
      price: data.price,
      totalReviews: data.total_reviews,
      brand: data.brand,
    }

    const updatedList = data.similar_products.map(eachItem => ({
      id: eachItem.id,
      imageUrl: eachItem.image_url,
      description: eachItem.description,
      title: eachItem.title,
      availability: eachItem.availability,
      rating: eachItem.rating,
      price: eachItem.price,
      totalReviews: eachItem.total_reviews,
      brand: eachItem.brand,
    }))

    this.setState({
      productDetails: updatedData,
      similarList: updatedList,
      apiStatus: apiStatusConstatn.success,
    })
  }

  onFail = data => {
    console.log(data)
    this.setState({
      errmsg: data.error_msg,
      apiStatus: apiStatusConstatn.failure,
    })
  }

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstatn.progress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt_token')}`,
      },
    }
    const url = `https://apis.ccbp.in/products/${id}`
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.getDetails(data)
    } else {
      this.onFail(data)
    }
  }

  goBack = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderProgress = () => (
    <div data-testid="loader" className="con">
      <Loader type="ThreeDots" color="#0b69ff" width={80} height={80} />
    </div>
  )

  renderFailure = () => {
    const {errmsg} = this.state
    return (
      <div className="con">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="err-img"
        />
        <h1 className="desc"> {errmsg} </h1>
        <button className="cart-btn" onClick={this.goBack} type="button">
          {' '}
          Continue Shopping{' '}
        </button>
      </div>
    )
  }

  renderSuccess = () => {
    const {productDetails, count, similarList} = this.state
    const {title, imageUrl, availability, rating} = productDetails
    const {description, price, totalReviews, brand} = productDetails
    return (
      <div>
        <Header />
        <div className="details-con">
          <img src={imageUrl} alt="product" className="details-img" />
          <div className="text-con">
            <h1 className="name"> {title} </h1>
            <p className="price"> RS {price}/- </p>
            <div className="rating-review">
              <div className="rating-con">
                <p> {rating} </p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p> {totalReviews} Reviews </p>
            </div>
            <p className="desc"> {description} </p>
            <p className="desc">
              {' '}
              <span className="price"> Available:</span> {availability}{' '}
            </p>
            <p className="desc">
              {' '}
              <span className="price"> Brand:</span> {brand}{' '}
            </p>
            <hr className="hr-line" />
            <div className="cart-con">
              <div className="cart-val">
                <button
                  type="button"
                  className="inc"
                  data-testid="minus"
                  onClick={this.onDecrease}
                >
                  {' '}
                  <BsDashSquare />{' '}
                </button>
                <p> {count} </p>
                <button
                  type="button"
                  className="inc"
                  data-testid="plus"
                  onClick={this.onIncrease}
                >
                  {' '}
                  <BsPlusSquare />{' '}
                </button>
              </div>
              <button className="cart-btn" type="button">
                {' '}
                ADD TO CART{' '}
              </button>
            </div>
          </div>
        </div>
        <div className="similar-con">
          <h1 className="name"> Similar Products </h1>
          <ul className="similarproducts">
            {similarList.map(eachItem => (
              <SimilarProductItem details={eachItem} key={eachItem.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstatn.success:
        return this.renderSuccess()
      case apiStatusConstatn.failure:
        return this.renderFailure()
      case apiStatusConstatn.progress:
        return this.renderProgress()
      default:
        return null
    }
  }
}

export default ProductItemDetails
