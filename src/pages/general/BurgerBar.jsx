import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import MenuIcon from '@mui/icons-material/Menu';
import '../../styles/BurgerBar.css';
import { Link } from 'react-router-dom';
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ContactMailOutlined from "@mui/icons-material/ContactMailOutlined";
import InfoIcon from '@mui/icons-material/Info';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const BurgerBar = () => {
 return (
    // customBurgerIcon={ <MenuIcon />}
    <Menu className="wrapper"> 
      
      <Link to="Home" className="d-flex align-items-center bm-item">
        <HomeOutlinedIcon></HomeOutlinedIcon>
        Home
      </Link>
      <Link to="Contact" className="d-flex align-items-center bm-item">
        <ContactMailOutlined></ContactMailOutlined>
        Contact
      </Link>
      <Link to="About" className="d-flex align-items-center bm-item">
        <InfoIcon></InfoIcon>
        About Us
      </Link>
    </Menu>
 );
};

export default BurgerBar;