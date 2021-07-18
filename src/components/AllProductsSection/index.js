import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    apiStatus: apiStatusConstant.initial,
    activeOptionId: sortbyOptions[0].optionId,
    activeCategoryId: '',
    activeRatingId: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstant.loading,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      activeCategoryId,
      activeRatingId,
      searchInput,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  clearFilters = () => {
    this.setState(
      {searchInput: '', activeRatingId: '', activeCategoryId: ''},
      this.getProducts,
    )
  }

  onClickEnterSearch = () => {
    this.getProducts()
  }

  changeSearchInput = value => {
    this.setState({searchInput: value})
  }

  changeRating = activeRatingId => {
    this.setState({activeRatingId}, this.getProducts)
  }

  changeCategory = activeCategoryId => {
    this.setState({activeCategoryId}, this.getProducts)
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderAPIFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png "
        alt="products failure"
        className="view-image"
      />
    </div>
  )

  renderNoProducts = () => (
    <div className="no-products-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png "
        alt="no products"
        className="view-image"
      />
    </div>
  )

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    if (productsList.length === 0) {
      return this.renderNoProducts()
    }
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderContent = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderProductsList()
      case apiStatusConstant.loading:
        return this.renderLoader()
      case apiStatusConstant.failure:
        return this.renderAPIFailure()
      default:
        return null
    }
  }

  render() {
    const {activeRatingId, activeCategoryId, searchInput} = this.state

    return (
      <div className="all-products-section">
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          activeCategoryId={activeCategoryId}
          activeRatingId={activeRatingId}
          searchInput={searchInput}
          changeCategory={this.changeCategory}
          changeRating={this.changeRating}
          changeSearchInput={this.changeSearchInput}
          onClickEnterSearch={this.onClickEnterSearch}
          clearFilters={this.clearFilters}
        />
        {this.renderContent()}
      </div>
    )
  }
}

export default AllProductsSection
