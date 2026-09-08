import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import { useReveal } from "../hooks/useReveal";
import cafeImage from "../assets/cafe-hero.png";
import drinksImg from "../assets/drinks.png";
import pastriesImg from "../assets/pastries.png";
import brunchImg from "../assets/brunch.png";
import cafeDetail1 from "../assets/cafe-detail1.png";
import cafeDetail2 from "../assets/cafe-detail2.png";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

interface Category {
  id: number;
  name: string;
}

function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const menuReveal = useReveal<HTMLElement>();
  const stepsReveal = useReveal<HTMLElement>();
  const footerReveal = useReveal<HTMLElement>();

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch((error) => console.error("Erreur catégories :", error));
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <p className="small-title">The café that feels like you</p>
          <h1>Your break,<br /><i>reinvented.</i></h1>
          <p className="description">
            Order, book your table, and track your order in real
            time — from your phone, tablet, or computer.
          </p>
          <div className="hero-buttons">
  <Link to="/menu">
    <button>Order Now</button>
  </Link>

  <Link to="/reservation">
    <button className="secondary">Book a Table</button>
  </Link>
</div></div>


        <div className="hero-image">
          <img src={cafeImage} alt="Tucopili Café interior" className="blob-main" />
          <img src={cafeDetail1} alt="Coffee at Tucopili" className="blob-small blob-small-1" />
          <img src={cafeDetail2} alt="Pastry at Tucopili" className="blob-small blob-small-2" />
        </div>
      </section>

      {/* MENU (aperçu) */}
      <section className={`menu-section ${menuReveal.className}`} id="menu" ref={menuReveal.ref}>
        <p className="section-small-title">from the menu</p>
        <h2>What we prepare for you</h2>
        <p className="section-description">
          A curated selection of drinks, pastries, and dishes made with care.
        </p>

        <div className="categories">
          {categories.length > 0 ? (
            categories.slice(0, 3).map((category) => (
              <div className="category-card" key={category.id}>
                <div className="category-card-image">
                  <img src={drinksImg} alt={category.name} />
                </div>
                <h3>{category.name}</h3>
                <p>Discover our selection</p>
              </div>
            ))
          ) : (
            <>
              <div className="category-card">
                <div className="category-card-image"><img src={drinksImg} alt="Drinks" /></div>
                <h3>Drinks</h3>
                <p>Coffee, tea, and fresh beverages</p>
              </div>
              <div className="category-card">
                <div className="category-card-image"><img src={pastriesImg} alt="Pastries" /></div>
                <h3>Pastries</h3>
                <p>Tarts and sweet treats</p>
              </div>
              <div className="category-card">
                <div className="category-card-image"><img src={brunchImg} alt="Brunch" /></div>
                <h3>Brunch</h3>
                <p>Poached eggs & sourdough</p>
              </div>
            </>
          )}
        </div>

        <Link className="menu-link" to="/menu">View full menu →</Link>
      </section>

      {/* HOW IT WORKS */}
      <section className={`steps-section ${stepsReveal.className}`} ref={stepsReveal.ref}>
        <p className="section-small-title">as easy as it gets</p>
        <h2>From craving to table</h2>
        <div className="steps">
          <div className="step">
            <span>01</span>
            <h3>Choose.</h3>
            <p>Browse the menu, filter by category, and add your favorites to your cart.</p>
          </div>
          <div className="step">
            <span>02</span>
            <h3>Dine in or take out.</h3>
            <p>Place your order and enjoy it right here or on the go.</p>
          </div>
          <div className="step">
            <span>03</span>
            <h3>Get settled.</h3>
            <p>Book your table ahead of time and find your order history on every visit.</p>
          </div>
        </div>
      </section>

      <footer id="contact" className={footerReveal.className} ref={footerReveal.ref}>
        <div className="footer-logo">
          <img src={logo} alt="Tucopili Café" />
        </div>
        <p>© TUCOPILI Café — order, reserve, savor.</p>
      </footer>
    </>
  );
}

export default Home;