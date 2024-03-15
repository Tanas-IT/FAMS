import React from 'react'
import { Link } from 'react-router-dom'
import ProfileMenu from "../../components/ProfileMenu"
import '../../styles/topnav.css'
import BurgerBar from './BurgerBar'

const TopNav = () => {
  return (
    <div className="topnav">
        
        <BurgerBar />
        <Link to="/Admin">
            <img src="/images/logo0.png" alt='Home'/>
        </Link>
        <div className="account-wrapper">
            <ProfileMenu/>
        </div>
    </div>
  )
}

export default TopNav