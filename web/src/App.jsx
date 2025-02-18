import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

// Main component that manages state and renders search bar & product grid
function FilterableProductGrid({ products }) {
  const [filterText, setFilterText] = useState('');      // Stores search text
  const [inStockOnly, setInStockOnly] = useState(false); // Filter for in-stock products
  const [category, setCategory] = useState('');          // Selected category
  const [subCategory, setSubCategory] = useState('');    // Selected sub-category

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} 
        category={category}
        subCategory={subCategory}
        onFilterTextChange={setFilterText} 
        onInStockOnlyChange={setInStockOnly} 
        onCategoryChange={setCategory}
        onSubCategoryChange={setSubCategory}
      />
      <ProductGrid 
        products={products} 
        filterText={filterText} 
        inStockOnly={inStockOnly} 
        category={category}
        subCategory={subCategory}
      />
    </div>
  );
}

// Component to display a single product card, name, price and picture
function ProductCard({ product }) {
  return ( 
    <div className="product-card"> 
    {/*Displays the given picture to the product, and placeholder picture if product doesnt have a picture*/}
      <img src={'/public/bayonet_gamma_doppler.png'}/>
      <h4>{product.name}</h4>
      <p>{product.price}</p>
    </div>
  );
}

// Component that displays products in a grid format
function ProductGrid({ products, filterText, inStockOnly, category, subCategory }) {
  // Filter products based on search, stock status, category, and sub-category
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(filterText.toLowerCase()) &&
    (!inStockOnly || product.stocked) &&
    (category === '' || product.category === category) &&
    (subCategory === '' || product.subCategory === subCategory)
  );

  return (
    <div className="product-grid">
      {filteredProducts.map(product => (
        <ProductCard key={product.name} product={product} />
      ))}
    </div>
  );
}

// Component for the search bar with filters for category and sub-category
function SearchBar({ filterText, category, subCategory, onFilterTextChange, onCategoryChange, onSubCategoryChange }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..." 
        onChange={(e) => onFilterTextChange(e.target.value)} 
      />
      <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="">All Categories</option>
        {/* Add category options dynamically */}
      </select>
      <select value={subCategory} onChange={(e) => onSubCategoryChange(e.target.value)}>
        <option value="">All Sub-Categories</option>
        {/* Add sub-category options dynamically */}
      </select>
    </form>
  );
}

// Sample product data (to be replaced with a real database)
const PRODUCTS = [
  // Future database entries
  { category: 'Fruits', subCategory: 'Tropical', price: '$1', stocked: true, name: 'Apple', picture: 'path/to/apple.jpg' },
  { category: 'Fruits', subCategory: 'Tropical', price: '$1', stocked: true, name: 'Dragonfruit', picture: 'path/to/dragonfruit.jpg' },
  { category: 'Fruits', subCategory: 'Citrus', price: '$2', stocked: false, name: 'Passionfruit', picture: 'path/to/passionfruit.jpg' },
  { category: 'Vegetables', subCategory: 'Leafy', price: '$2', stocked: true, name: 'Spinach', picture: 'path/to/spinach.jpg' },
  { category: 'Vegetables', subCategory: 'Root', price: '$4', stocked: false, name: 'Pumpkin', picture: 'path/to/pumpkin.jpg' },
  { category: 'Vegetables', subCategory: 'Root', price: '$1', stocked: true, name: 'Peas', picture: 'path/to/peas.jpg' }
];

// Main application component
export default function App() {
  let products;
  const [count, setCount] = useState(0)

  const fetchUsers = async () =>{
      const response = await axios.get('http://localhost:9000/api/skins');
      console.log(response.data);
  }

  useEffect(() =>{
    products = fetchUsers();
  },
  []);
  return <FilterableProductGrid products={PRODUCTS} />;
}

