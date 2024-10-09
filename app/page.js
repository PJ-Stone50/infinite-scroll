"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]); // State for currently displayed products
  const [page, setPage] = useState(0); // Start from page 0
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8; // Number of items to display per page

  const fetchProducts = async () => {
    setLoading(true);
    const response = await axios.get(
      `https://api.escuelajs.co/api/v1/products`
    );
    setProducts(response.data);
    setDisplayedProducts(response.data.slice(0, itemsPerPage)); // Set initial displayed products
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    console.warn("DP", displayedProducts);
  }, [displayedProducts]);

  useEffect(() => {
    if (products.length > 0) {
      const start = page * itemsPerPage;
      const newDisplayedProducts = products.slice(0, start + itemsPerPage); // Show products up to the current page
      setDisplayedProducts(newDisplayedProducts);
    }
  }, [page, products]);

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !loading &&
      displayedProducts.length < products.length
    ) {
      setPage((prev) => prev + 1); // Increment the page count to load more products
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, displayedProducts]);

  return (
    <div className="w-full flex flex-col items-center p-5 gap-3">
      <h1>Products</h1>
      <div className="product-list">
        {displayedProducts.map((product) => (
          <div key={product.id} className="product">
            <h2>{product.title}</h2>
            <p>${product.price}</p>
            <img
              src={JSON.parse(product.images)[0]} // Parse the images string into an array and get the first image URL
              alt={product.title}
              style={{ width: "100px" }}
            />
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      <style jsx>{`
        .product-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        .product {
          border: 1px solid #ccc;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
