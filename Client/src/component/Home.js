import React from "react";
import "../CSS/Home.css";
import happy from "../Asset/happy.png";
import l1 from "../Asset/l1.png";
import l2 from "../Asset/l2.png";
import l3 from "../Asset/l3.png";
import { FaArrowRight, FaQuoteLeft } from "react-icons/fa";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
function Home() {
  return (
    <>
      <div className="home">
        <div className="h-text">
          <div className="h-text-ctnt-out">
            <div id="one" className="h-text-ctnt">
              Better Health Starts Here.
            </div>
            <div id="two" className="h-text-ctnt">
              Making healthcare decision easier for you and{" "}
              <span className="line-break">the ones you love.</span>
            </div>
            {/* <div id="four1" className="h-text-ctnt1">
              Guidance from start to Finish...We Can Help You.
            </div> */}
            <div id="three" className="h-text-ctnt">
              Best Doctor's Suggetion and Advice{" "}
              <FaArrowRight className="a-icon" />
            </div>{" "}
            <hr className="custom-hr1" />
            <div id="three" className="h-text-ctnt">
              Secure Infrastructure <FaArrowRight className="a-icon" />
            </div>{" "}
            <hr className="custom-hr2" />
            <div id="three" className="h-text-ctnt">
              Quick Recovery <FaArrowRight className="a-icon" />
            </div>{" "}
            <hr className="custom-hr3" />
          </div>
          <div id="four" className="h-text-ctnt">
            Guidance from start to Finish...We Can Help You.
          </div>
          <div className="btn-get">Get Started</div>
        </div>
        <div className="h-image">
          <img src={happy}></img>
          <div className="text-overlay">
            <div className="cmt-icon">
              <FaQuoteLeft className="quot-icn" />
            </div>
            <p>
              After using MedWay The burden on my mind of finding healthcare
              needs are very less.
            </p>
          </div>
        </div>
      </div>

      <div className="h-image-copy">
        <div className="copycat">
          <img src={happy}></img>
        </div>
        <div className="text-overlay1">
          <div className="cmt-icon">
            <FaQuoteLeft className="quot-icn" />
          </div>
          <p>
            After using MedWay The burden on my mind of finding healthcare needs
            are very less.
          </p>
        </div>
      </div>
      <div className="second_section">
        <div className="seone">
          <div className="why">WHY NEED HEALTH?</div>
          <div className="we">
            We Are Bringing health and Wellness Home
          </div>{" "}
          <hr id="wee" />
          <div class="grid-container">
            <div class="grid-item">
              <div className="l1">
                <img src={l1} alt="box image"></img>
              </div>
              <div className="g1">How Our System Works.</div>
              <div className="p1">
                Our project is driven by a commitment to ensuring robust data
                ....
              </div>
              <div className="btn-get">
                <Link to="/system">Learn more..</Link>
              </div>
            </div>
            <div class="grid-item">
              <div className="l1">
                <img src={l2} alt="box image"></img>
              </div>
              <div className="g1">We make healthcare easier</div>
              <div className="p1">
                Plan a truly personalized health journey without breaking the
                bank
              </div>
              <div className="p2"></div>
              <div className="btn-get">Get Started</div>
            </div>
            <div class="grid-item">
              <div className="l1">
                <img src={l3} alt="box image"></img>
              </div>
              <div className="g1">We make relationships not barriers</div>
              <div className="p1">
                Plan a truly personalized health journey without breaking the
                bank
              </div>
              <div className="btn-get">Get Started</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
