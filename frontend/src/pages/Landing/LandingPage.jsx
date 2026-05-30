import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/common/Navbar";
import useAuth from "../../hooks/useAuth";
import { 
  FaCalendarCheck, 
  FaTruckFast, 
  FaHandHoldingDollar, 
  FaLeaf,
  FaRegNewspaper,
  FaBox,
  FaBottleWater,
  FaWrench,
  FaCoins,
  FaGlassWater,
  FaLaptop,
  FaChampagneGlasses,
  FaCalculator,
  FaIndianRupeeSign
} from "react-icons/fa6";
import "./LandingPage.css";

// ==========================================
// CALCULATOR CONFIG
// ==========================================
const calculatorRates = {
  NEWSPAPER: { price: 14.50, co2: 1.5, unit: "kg" },
  CARDBOARD: { price: 8.20, co2: 1.2, unit: "kg" },
  PLASTIC: { price: 12.00, co2: 2.1, unit: "kg" },
  IRON: { price: 28.00, co2: 3.5, unit: "kg" },
  COPPER: { price: 412.00, co2: 4.8, unit: "kg" },
  ALUMINUM: { price: 145.00, co2: 4.2, unit: "kg" },
  EWASTE: { price: 95.00, co2: 5.6, unit: "kg" },
  GLASS: { price: 3.50, co2: 0.9, unit: "kg" },
};

// ==========================================
// ANIMATION VARIANTS
// ==========================================
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const hoverCardEffect = {
  initial: { y: 0, rotateX: 0, rotateY: 0, scale: 1 },
  hover: { 
    y: -8, 
    scale: 1.03,
    transition: { duration: 0.3, ease: "easeOut" } 
  }
};

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Calculator State
  const [calcMaterial, setCalcMaterial] = useState("NEWSPAPER");
  const [calcQty, setCalcQty] = useState(25);

  useEffect(() => {
    if (location.hash) {
      const section = document.querySelector(location.hash);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  // Calculations
  const rateData = calculatorRates[calcMaterial] || calculatorRates.NEWSPAPER;
  const estPayout = calcQty * rateData.price;
  const estCo2 = calcQty * rateData.co2;
  const treesEquivalent = (estCo2 / 21.8).toFixed(1); // 1 mature tree absorbs ~21.8kg CO2/year

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero-section">
        {/* Floating Blur Blobs */}
        <div className="hero-blur-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>

        <div className="container hero-container">
          {/* LEFT CONTENT */}
          <motion.div 
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.span className="hero-badge glowing-neon-border" variants={fadeInUp}>
              ⚡ SMART SCRAP MANAGEMENT
            </motion.span>

            <motion.h1 variants={fadeInUp} className="glitch-text" data-text="Turn Your Scrap Into Wealth">
              Turn Your Scrap Into
              <span> Wealth ♻️</span>
            </motion.h1>

            <motion.p variants={fadeInUp}>
              Schedule doorstep pickups, track live scrap rates, monitor environmental impact, 
              and earn rewards for recycling in our next-gen digital ecosystem.
            </motion.p>

            <motion.div className="hero-buttons" variants={fadeInUp}>
              {isAuthenticated ? (
                <Link to={`/${user?.role || "user"}/dashboard`}>
                  <button className="primary-btn neo-btn-tactile">
                    Go to Dashboard
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <button className="primary-btn neo-btn-tactile">
                      Get Started
                    </button>
                  </Link>
                  <Link to="/login">
                    <button className="secondary-btn neo-btn-tactile">
                      Login
                    </button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src="https://cdn-icons-png.flaticon.com/512/6797/6797200.png"
              alt="Scrapify Console"
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 0.5, -0.5, 0]
              }}
              transition={{
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="features-section section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <span className="section-tag">01 / WORKFLOW</span>
            <h2>Simple Recycling Process</h2>
            <p>Scrapify makes waste recycling fast, transparent, and rewarding.</p>
          </motion.div>

          <motion.div 
            className="features-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {/* Step 1 */}
            <motion.div className="card feature-card cyber-panel" variants={fadeInUp}>
              <div className="feature-icon"><FaCalendarCheck /></div>
              <h3>Schedule Pickup</h3>
              <p>Book scrap collection directly from your home with a few taps.</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div className="card feature-card cyber-panel" variants={fadeInUp}>
              <div className="feature-icon"><FaTruckFast /></div>
              <h3>Collector Assigned</h3>
              <p>Nearby eco-collectors accept and track your request on GPS.</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div className="card feature-card cyber-panel" variants={fadeInUp}>
              <div className="feature-icon"><FaHandHoldingDollar /></div>
              <h3>Instant Earnings</h3>
              <p>Get paid on-the-spot matching verified live scrap market rates.</p>
            </motion.div>

            {/* Step 4 */}
            <motion.div className="card feature-card cyber-panel" variants={fadeInUp}>
              <div className="feature-icon"><FaLeaf /></div>
              <h3>Eco Impact</h3>
              <p>Accumulate green points and track carbon offsets in real time.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* LIVE RATES WITH CALCULATOR */}
      <section id="live-rates" className="rates-section section">
        <div className="container">
          <motion.div 
            className="rates-heading-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="rates-heading-left">
              <span className="rates-small-tag">02 / RATES</span>
              <h2>Live Market Prices</h2>
              <p>Updated every 15 minutes from verified scrap markets. What you see is what you get.</p>
            </div>
            <div className="rates-heading-right">
              Last updated: <span>just now</span>
            </div>
          </motion.div>

          <div className="rates-content-split">
            {/* Rates Grid */}
            <motion.div 
              className="rates-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {/* NEWSPAPER */}
              <motion.div className="rate-card cyber-panel" variants={hoverCardEffect} whileHover="hover">
                <div className="rate-top">
                  <div className="rate-card-icon text-blue-500">
                    <FaRegNewspaper />
                  </div>
                  <span className="rate-up">+0.4</span>
                </div>
                <h3>NEWSPAPER</h3>
                <p>₹14.50 <span>/kg</span></p>
              </motion.div>

              {/* CARDBOARD */}
              <motion.div className="rate-card cyber-panel" variants={hoverCardEffect} whileHover="hover">
                <div className="rate-top">
                  <div className="rate-card-icon text-amber-600">
                    <FaBox />
                  </div>
                  <span className="rate-down">-0.3</span>
                </div>
                <h3>CARDBOARD</h3>
                <p>₹8.20 <span>/kg</span></p>
              </motion.div>

              {/* PLASTIC */}
              <motion.div className="rate-card cyber-panel" variants={hoverCardEffect} whileHover="hover">
                <div className="rate-top">
                  <div className="rate-card-icon text-emerald-500">
                    <FaBottleWater />
                  </div>
                  <span className="rate-up">+0.5</span>
                </div>
                <h3>PLASTIC (PET)</h3>
                <p>₹12.00 <span>/kg</span></p>
              </motion.div>

              {/* IRON */}
              <motion.div className="rate-card cyber-panel" variants={hoverCardEffect} whileHover="hover">
                <div className="rate-top">
                  <div className="rate-card-icon text-slate-500">
                    <FaWrench />
                  </div>
                  <span className="rate-up">+1.2</span>
                </div>
                <h3>IRON SCRAP</h3>
                <p>₹28.00 <span>/kg</span></p>
              </motion.div>

              {/* COPPER */}
              <motion.div className="rate-card cyber-panel" variants={hoverCardEffect} whileHover="hover">
                <div className="rate-top">
                  <div className="rate-card-icon text-orange-500">
                    <FaCoins />
                  </div>
                  <span className="rate-up">+6.0</span>
                </div>
                <h3>COPPER</h3>
                <p>₹412.00 <span>/kg</span></p>
              </motion.div>

              {/* ALUMINUM */}
              <motion.div className="rate-card cyber-panel" variants={hoverCardEffect} whileHover="hover">
                <div className="rate-top">
                  <div className="rate-card-icon text-cyan-600">
                    <FaGlassWater />
                  </div>
                  <span className="rate-neutral">--</span>
                </div>
                <h3>ALUMINUM</h3>
                <p>₹145.00 <span>/kg</span></p>
              </motion.div>

              {/* E-WASTE */}
              <motion.div className="rate-card cyber-panel" variants={hoverCardEffect} whileHover="hover">
                <div className="rate-top">
                  <div className="rate-card-icon text-violet-500">
                    <FaLaptop />
                  </div>
                  <span className="rate-up">+2.0</span>
                </div>
                <h3>E-WASTE</h3>
                <p>₹95.00 <span>/kg</span></p>
              </motion.div>

              {/* GLASS */}
              <motion.div className="rate-card cyber-panel" variants={hoverCardEffect} whileHover="hover">
                <div className="rate-top">
                  <div className="rate-card-icon text-lime-600">
                    <FaChampagneGlasses />
                  </div>
                  <span className="rate-neutral">--</span>
                </div>
                <h3>GLASS</h3>
                <p>₹3.50 <span>/kg</span></p>
              </motion.div>
            </motion.div>

            {/* Interactive Calculator Sidebar */}
            <motion.div 
              className="rates-calculator-sidebar neo-card-flat glowing-neon-border"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="calculator-header">
                <FaCalculator className="calc-icon" />
                <h3>Eco Earnings Calculator</h3>
              </div>
              <p className="calc-description">Choose a material and drag the slider to calculate instant earnings and carbon savings.</p>

              {/* Material Dropdown */}
              <div className="calc-control-group">
                <label>Select Material</label>
                <select 
                  value={calcMaterial} 
                  onChange={(e) => setCalcMaterial(e.target.value)}
                  className="calc-select"
                >
                  <option value="NEWSPAPER">📰 Newspaper (₹14.50/kg)</option>
                  <option value="CARDBOARD">📦 Cardboard (₹8.20/kg)</option>
                  <option value="PLASTIC">🧴 Plastic PET (₹12.00/kg)</option>
                  <option value="IRON">🔩 Iron Scrap (₹28.00/kg)</option>
                  <option value="COPPER">🪙 Copper (₹412.00/kg)</option>
                  <option value="ALUMINUM">🥫 Aluminum (₹145.00/kg)</option>
                  <option value="EWASTE">💻 E-Waste (₹95.00/kg)</option>
                  <option value="GLASS">🍾 Glass (₹3.50/kg)</option>
                </select>
              </div>

              {/* Range Slider */}
              <div className="calc-control-group">
                <div className="slider-label-row">
                  <label>Quantity</label>
                  <span className="slider-value">{calcQty} kg</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="500" 
                  step="5"
                  value={calcQty} 
                  onChange={(e) => setCalcQty(Number(e.target.value))}
                  className="calc-slider"
                />
              </div>

              {/* Results Matrix */}
              <div className="calc-results">
                <div className="result-tile payout">
                  <span>Est. Payout</span>
                  <h4>₹{estPayout.toLocaleString("en-IN", { maximumFractionDigits: 1 })}</h4>
                </div>
                <div className="result-tile co2">
                  <span>CO₂ Prevented</span>
                  <h4>{estCo2.toFixed(1)} kg</h4>
                </div>
              </div>

              {/* Trees highlight */}
              <div className="calc-eco-highlight">
                <FaLeaf className="eco-leaf" />
                <span>Equivalent to planting <strong>{treesEquivalent}</strong> trees absorption per year!</span>
              </div>

              <Link to={isAuthenticated ? `/${user?.role || "user"}/dashboard` : "/register"}>
                <button className="confirm-btn neo-btn-tactile calc-cta-btn">
                  {isAuthenticated ? "Go to Dashboard" : "Book A Pickup Now"}
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* IMPACT & LEADERBOARD */}
      <section id="impact" className="impact-section section">
        <div className="container impact-wrapper">
          {/* LEFT CARD */}
          <motion.div 
            className="impact-main-card glowing-neon-border"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="impact-small-tag">03 / IMPACT</span>
            <h2>Collective Carbon Offset</h2>
            <div className="impact-big-number">
              32,450<span>kg</span>
            </div>
            <p>
              CO₂ prevented by the Scrapify community this year. Equivalent to planting <strong>1,470 trees.</strong>
            </p>
          </motion.div>

          {/* RIGHT LEADERBOARD */}
          <motion.div 
            className="leaderboard-card cyber-panel"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="leaderboard-header">
              <h3>🏆 Top Recyclers This Month</h3>
              <span>JOIN LEADERBOARD →</span>
            </div>

            {/* Staggered Rows */}
            <div className="leaderboard-rows-container">
              {/* Row 1 */}
              <motion.div 
                className="leaderboard-row" 
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.2 }}
              >
                <div className="leaderboard-left">
                  <span className="rank">#1</span>
                  <div className="leader-avatar">A</div>
                  <div>
                    <h4>Ananya R.</h4>
                    <p>🌲 Forest Tier</p>
                  </div>
                </div>
                <div className="leaderboard-right">
                  <h4>4,820</h4>
                  <p>142.5kg</p>
                </div>
              </motion.div>

              {/* Row 2 */}
              <motion.div 
                className="leaderboard-row"
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.2 }}
              >
                <div className="leaderboard-left">
                  <span className="rank">#2</span>
                  <div className="leader-avatar">V</div>
                  <div>
                    <h4>Vikram S.</h4>
                    <p>🌲 Forest Tier</p>
                  </div>
                </div>
                <div className="leaderboard-right">
                  <h4>4,210</h4>
                  <p>128kg</p>
                </div>
              </motion.div>

              {/* Row 3 */}
              <motion.div 
                className="leaderboard-row active-user glowing-neon-border"
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.2 }}
              >
                <div className="leaderboard-left">
                  <span className="rank">#4</span>
                  <div className="leader-avatar">Y</div>
                  <div>
                    <h4>You (Alex)</h4>
                    <p>🌱 Sapling</p>
                  </div>
                </div>
                <div className="leaderboard-right">
                  <h4>2,480</h4>
                  <p>84.2kg</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        {/* Particle blobs */}
        <div className="cta-blur-blobs">
          <div className="blob blob-cta"></div>
        </div>

        <motion.div 
          className="container cta-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2>Join The Green Revolution 🌍</h2>
          <p>Start recycling smarter with Scrapify today. Earn green points, reduce landfill footprint, and claim cash.</p>
          {isAuthenticated ? (
            <Link to={`/${user?.role || "user"}/dashboard`}>
              <button className="primary-btn neo-btn-tactile glowing-neon-border">
                Go to Dashboard
              </button>
            </Link>
          ) : (
            <Link to="/register">
              <button className="primary-btn neo-btn-tactile glowing-neon-border">
                Start Recycling
              </button>
            </Link>
          )}
        </motion.div>
      </section>
    </>
  );
};

export default LandingPage;