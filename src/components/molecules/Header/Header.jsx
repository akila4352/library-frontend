import React from "react";
import "./Header.css";
import Navbar from "../Navbar";
import header_bg from './header-bg.jpg'



const Header = () => {return(
    <div className="header" style = {{
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2)), url(${header_bg}) center/cover no-repeat`
    }}>
       

        <div className="container2"><Navbar/>
            <div className="header__content text__center text__light flex flex__center">
                <div className="header__content--left"></div>
                <div className="header__content--right">
                    <h1 className="header__title fw__6"> Welcome to Library </h1>
                    <p className="para__text">
                    Welcome to Digital Library Management, your one-stop platform for managing all your library resources seamlessly and securely. With our advanced system, you can browse the catalog, check out books, renew items, and manage your account—all from the comfort of your home. We prioritize your security with multi-factor authentication and advanced encryption, ensuring your information remains protected. Join us today to experience a more efficient, accessible, and secure way to interact with your library!
</p>

                    <a href = "/register"className="btn__blue">Register Now</a>
                </div>
            </div>
        </div>
    </div>
)
}

export default Header;