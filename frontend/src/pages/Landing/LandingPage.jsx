import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  FaChampagneGlasses
} from "react-icons/fa6";
import "./LandingPage.css";



const LandingPage = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const {
    isAuthenticated,
    user,
  } = useAuth();


  // useEffect(() => {

  //   if (isAuthenticated) {

  //     if (user?.role === "collector") {

  //       navigate("/collector/dashboard");

  //     } else if (user?.role === "admin") {

  //       navigate("/admin/dashboard");

  //     } else {

  //       navigate("/dashboard");

  //     }

  //   }

  // }, [isAuthenticated, user, navigate]);

  useEffect(() => {

  if (location.hash) {

    const section = document.querySelector(
      location.hash
    );

    if (section) {

      setTimeout(() => {

        section.scrollIntoView({
          behavior: "smooth",
        });

      }, 100);

    }

  }

}, [location]);

  return (
    <>

      {/* ===================================== */}
      {/* NAVBAR */}
      {/* ===================================== */}

      <Navbar />


      {/* ===================================== */}
      {/* HERO SECTION */}
      {/* ===================================== */}

      <section className="hero-section">

        <div className="container hero-container">

          {/* LEFT */}
          <div className="hero-content">

            <span className="hero-badge">
              SMART SCRAP MANAGEMENT
            </span>

            <h1>
              Turn Your Scrap Into
              <span> Wealth ♻️</span>
            </h1>

            <p>
              Schedule doorstep pickups,
              track live scrap rates,
              monitor environmental impact,
              and earn rewards for recycling.
            </p>

            <div className="hero-buttons">

              <Link to="/register">

                <button className="primary-btn">
                  Get Started
                </button>

              </Link>

              <Link to="/login">

                <button className="secondary-btn">
                  Login
                </button>

              </Link>

            </div>

          </div>


          {/* RIGHT */}
          <div className="hero-image">

            <img
              src="https://cdn-icons-png.flaticon.com/512/6797/6797200.png"
              alt="Scrapify"
            />

          </div>

        </div>

      </section>


      {/* ===================================== */}
      {/* HOW IT WORKS */}
      {/* ===================================== */}

      <section
        id="how-it-works"
        className="features-section section"
      >

        <div className="container">

          <div className="section-header">

            <span className="section-tag">
              HOW IT WORKS
            </span>

            <h2>
              Simple Recycling Process..
            </h2>

            <p>
              Scrapify makes waste recycling
              fast, transparent, and rewarding.
            </p>

          </div>


          <div className="features-grid">

            <div className="card feature-card">
              <div className="feature-icon"><FaCalendarCheck /></div>
              <h3>Schedule Pickup</h3>
              <p>
                Book scrap collection
                directly from your home.
              </p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon"><FaTruckFast /></div>
              <h3>Collector Assignment</h3>
              <p>
                Nearby collectors accept
                and track your request.
              </p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon"><FaHandHoldingDollar /></div>
              <h3>Instant Earnings</h3>
              <p>
                Get paid according to
                live market scrap rates.
              </p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon"><FaLeaf /></div>
              <h3>Eco Impact</h3>
              <p>
                Track CO₂ savings and
                recycling contribution.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* ===================================== */}
      {/* LIVE RATES */}
      {/* ===================================== */}

      <section
        id="live-rates"
        className="rates-section section"
      >

        <div className="container">

          <div className="rates-heading-wrapper">

  <div className="rates-heading-left">

    <span className="rates-small-tag">
      01 / RATES
    </span>

    <h2>
      Live market prices
    </h2>

    <p>
      Updated every 15 minutes from verified scrap markets.
      What you see is what you get.
    </p>

  </div>


  <div className="rates-heading-right">

    Last updated:
    <span> just now</span>

  </div>

</div>


          <div className="rates-grid">

  {/* NEWSPAPER */}
  <div className="rate-card">
    <div className="rate-top">
      <div className="rate-card-icon text-blue-500">
        <FaRegNewspaper />
      </div>
      <span className="rate-up">+0.4</span>
    </div>
    <h3>NEWSPAPER</h3>
    <p>₹14.50 <span>/kg</span></p>
  </div>

  {/* CARDBOARD */}
  <div className="rate-card">
    <div className="rate-top">
      <div className="rate-card-icon text-amber-600">
        <FaBox />
      </div>
      <span className="rate-down">-0.3</span>
    </div>
    <h3>CARDBOARD</h3>
    <p>₹8.20 <span>/kg</span></p>
  </div>

  {/* PLASTIC */}
  <div className="rate-card">
    <div className="rate-top">
      <div className="rate-card-icon text-emerald-500">
        <FaBottleWater />
      </div>
      <span className="rate-up">+0.5</span>
    </div>
    <h3>PLASTIC (PET)</h3>
    <p>₹12.00 <span>/kg</span></p>
  </div>

  {/* IRON */}
  <div className="rate-card">
    <div className="rate-top">
      <div className="rate-card-icon text-slate-500">
        <FaWrench />
      </div>
      <span className="rate-up">+1.2</span>
    </div>
    <h3>IRON SCRAP</h3>
    <p>₹28.00 <span>/kg</span></p>
  </div>

  {/* COPPER */}
  <div className="rate-card">
    <div className="rate-top">
      <div className="rate-card-icon text-orange-500">
        <FaCoins />
      </div>
      <span className="rate-up">+6</span>
    </div>
    <h3>COPPER</h3>
    <p>₹412.00 <span>/kg</span></p>
  </div>

  {/* ALUMINUM */}
  <div className="rate-card">
    <div className="rate-top">
      <div className="rate-card-icon text-cyan-600">
        <FaGlassWater />
      </div>
      <span className="rate-neutral">--</span>
    </div>
    <h3>ALUMINUM</h3>
    <p>₹145.00 <span>/kg</span></p>
  </div>

  {/* E-WASTE */}
  <div className="rate-card">
    <div className="rate-top">
      <div className="rate-card-icon text-violet-500">
        <FaLaptop />
      </div>
      <span className="rate-up">+2</span>
    </div>
    <h3>E-WASTE</h3>
    <p>₹95.00 <span>/kg</span></p>
  </div>

  {/* GLASS */}
  <div className="rate-card">
    <div className="rate-top">
      <div className="rate-card-icon text-lime-600">
        <FaChampagneGlasses />
      </div>
      <span className="rate-neutral">--</span>
    </div>
    <h3>GLASS</h3>
    <p>₹3.50 <span>/kg</span></p>
  </div>

</div>

        </div>

      </section>


    {/* ===================================== */}
{/* IMPACT */}
{/* ===================================== */}

<section
  id="impact"
  className="impact-section section"
>

  <div className="container impact-wrapper">

    {/* LEFT CARD */}

    <div className="impact-main-card">

      <span className="impact-small-tag">
        03 / IMPACT
      </span>

      <h2>
        Collective carbon
        <br />
        offset
      </h2>

      <div className="impact-big-number">
        32,450<span>kg</span>
      </div>

      <p>
        CO₂ prevented by the Scrapify
        community this year. Equivalent
        to planting
        <strong> 1,470 trees.</strong>
      </p>

    </div>


    {/* RIGHT LEADERBOARD */}

    <div className="leaderboard-card">

      <div className="leaderboard-header">

        <h3>
          🏆 Top Recyclers This Month
        </h3>

        <span>
          JOIN LEADERBOARD →
        </span>

      </div>


      {/* ROW */}

      <div className="leaderboard-row">

        <div className="leaderboard-left">

          <span className="rank">
            #1
          </span>

          <div className="leader-avatar">
            A
          </div>

          <div>

            <h4>
              Ananya R.
            </h4>

            <p>
              🌲 Forest Tier
            </p>

          </div>

        </div>

        <div className="leaderboard-right">

          <h4>
            4,820
          </h4>

          <p>
            142.5kg
          </p>

        </div>

      </div>


      {/* ROW */}

      <div className="leaderboard-row">

        <div className="leaderboard-left">

          <span className="rank">
            #2
          </span>

          <div className="leader-avatar">
            V
          </div>

          <div>

            <h4>
              Vikram S.
            </h4>

            <p>
              🌲 Forest Tier
            </p>

          </div>

        </div>

        <div className="leaderboard-right">

          <h4>
            4,210
          </h4>

          <p>
            128kg
          </p>

        </div>

      </div>


      {/* YOU */}

      <div className="leaderboard-row active-user">

        <div className="leaderboard-left">

          <span className="rank">
            #4
          </span>

          <div className="leader-avatar">
            Y
          </div>

          <div>

            <h4>
              You (Alex)
            </h4>

            <p>
              🌱 Sapling
            </p>

          </div>

        </div>

        <div className="leaderboard-right">

          <h4>
            2,480
          </h4>

          <p>
            84.2kg
          </p>

        </div>

      </div>

    </div>

  </div>

</section>


      {/* ===================================== */}
      {/* CTA */}
      {/* ===================================== */}

      <section className="cta-section">

        <div className="container cta-container">

          <h2>
            Join The Green Revolution 🌍
          </h2>

          <p>
            Start recycling smarter
            with Scrapify today.
          </p>

          <Link to="/register">

            <button className="primary-btn">
              Start Recycling
            </button>

          </Link>

        </div>

      </section>

    </>
  );
};

export default LandingPage;