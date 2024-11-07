import React from "react";
import "./Header.css";
import Book from "../../molecules/BookList/Book"

import header_bg from './header-bg.jpg';
import Navbar2 from "../Navbar/navbar2";

const Header = () => {
    return (
        <div className="header" style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2)), url(${header_bg}) center/cover no-repeat`
        }}>
            <div className="container2">
                <Navbar2 />
              <Book/>
            </div>
        </div>
    );
}

export default Header;
