import {BiSearchAlt2} from 'react-icons/bi'
import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    activeCategoryId,
    activeRatingId,
    searchInput,
    changeCategory,
    changeRating,
    changeSearchInput,
    clearFilters,
    onClickEnterSearch,
  } = props

  const onChangeSearchInput = event => {
    changeSearchInput(event.target.value)
  }

  const onEnterKeyPress = event => {
    if (event.key === 'Enter') {
      onClickEnterSearch()
    }
  }

  return (
    <div className="filters-group-container">
      <div className="input-container">
        <input
          type="search"
          className="search-input"
          placeholder="search"
          value={searchInput}
          onChange={onChangeSearchInput}
          onKeyDown={onEnterKeyPress}
        />
        <BiSearchAlt2 className="search-icon" />
      </div>
      <div className="options-container">
        <h1 className="heading">Category</h1>
        <ul className="options-list">
          {categoryOptions.map(eachCategory => {
            const onChangeCategory = () =>
              changeCategory(eachCategory.categoryId)
            const activeStyle =
              eachCategory.categoryId === activeCategoryId ? 'active-item' : ''
            return (
              <li key={eachCategory.categoryId} onClick={onChangeCategory}>
                <p className={`category-text ${activeStyle}`}>
                  {eachCategory.name}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="options-container">
        <h1 className="heading">Rating</h1>
        <ul className="options-list">
          {ratingsList.map(eachRating => {
            const onChangeRating = () => changeRating(eachRating.ratingId)
            const activeStyle =
              eachRating.ratingId === activeRatingId ? 'active-item' : ''
            return (
              <li
                className="rating-item"
                key={eachRating.ratingId}
                onClick={onChangeRating}
              >
                <img
                  src={eachRating.imageUrl}
                  className="rating-icon"
                  alt={`rating-${eachRating.ratingId}`}
                />
                <p className={`rating-text ${activeStyle}`}> & up</p>
              </li>
            )
          })}
        </ul>
      </div>
      <button type="button" className="clear-button" onClick={clearFilters}>
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
