import React from "react";
import "./Footer.css";
import Footeritems from "../../atoms/Footeritems";
const facebookLogo = '/images/communication.png';

const Footer = () => {
    return (
        <footer className="footer section__padding bg__dark">
            <div className="container">
                <div className="footer__content grid text__light text__center">
                    <div className="footer__content--item">
                        <a href = "#" className="footer__navlink">  Library</a>
                        <p className="para__text">&copy; Library Management system</p>
                    </div>

                    <div className="footer__content--item">
                        <a href = "mailto:@gmail.com" className="no">library@gmail.com</a><br/>
                        <span>0762991525</span>
                    </div>

                    <div className="footer__content--item ">
                        <h3 className="footer__title">Projects</h3>
                        <ul className="footer__links">
                            <li><a href = "#"className="no">About</a></li>
                        
                          
                        </ul>
                    </div>

                    <div className="footer__content--item">
                        <h3 className="footer__title">News</h3>
                        <ul className="footer__links">
                            <li><a href = "#"className="no">Events</a></li>
                            <li><a href = "#"className="no">Contact</a></li>
                            <li><a href = "#"className="no">Legals</a></li>
                        </ul>
                    </div>

                    <div className="footer__content--item">
                        <h3 className="footer__title no">Social LInks</h3>
                        <ul className="footer__links no">
                        <Footeritems
        href="https://web.facebook.com"
        imgSrc={facebookLogo} // Use the imported image
        imgAlt="Facebook logo"
        spanText="Facebook"
      />
     
    </ul>

                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;