import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/productService";
import { useCart } from "../context/CartContext";
import { getProductImage } from "../utils/images";

interface Product {
  id: number;
  name: string;
  description: string | null;
  available: boolean;
  price: string;
  image: string | null;
  categoryId: number;
  category: {
    id: number;
    name: string;
    description: string | null;
  };
}

function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((error) => console.error("Erreur produits :", error));
  }, []);

  const categoryNames = useMemo(() => {
    const names = products.map((p) => p.category?.name).filter(Boolean);
    return ["Tous", ...Array.from(new Set(names))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === "Tous" || p.category?.name === activeCategory;
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, search, activeCategory]);

  return (
    <section className="menu-page">
      <p className="section-small-title">notre carte</p>
      <h2>Tout ce qu'on aime préparer</h2>

      <div className="menu-search">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="menu-filters">
        {categoryNames.map((name) => (
          <button
            key={name}
            className={`filter-pill ${activeCategory === name ? "active" : ""}`}
            onClick={() => setActiveCategory(name as string)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-card-image">
              {product.image && (
                <img
                  src={getProductImage(product.image) ?? ""}
                  alt={product.name}
                />
              )}
              <span
                className={`availability-badge ${
                  product.available ? "available" : "unavailable"
                }`}
              >
                {product.available ? "Disponible" : "Rupture"}
              </span>
            </div>

            <div className="product-card-body">
              <p className="product-category">{product.category?.name}</p>
              <h3>{product.name}</h3>
              <div className="product-footer">
                <span className="product-price">{product.price} MAD</span>
                <button
                  className="add-btn"
                  disabled={!product.available}
                  onClick={() => addToCart(product)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="no-results">Aucun produit trouvé.</p>
      )}
    </section>
  );
}

export default Menu;