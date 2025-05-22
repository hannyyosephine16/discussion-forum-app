import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategory } from '../../store/threadsSlice';

function CategoryFilter() {
  const dispatch = useDispatch();
  const { categories, selectedCategory } = useSelector((state) => state.threads);

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
  };

  return (
    <div className="category-filter">
      <label htmlFor="category-select">Filter by category:</label>
      <select
        id="category-select"
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="category-select"
      >
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategoryFilter;