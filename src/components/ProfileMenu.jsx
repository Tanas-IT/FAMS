import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { Link } from 'react-router-dom';
import '../styles/topnav.css'

export default function ProfileMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    sessionStorage.removeItem("token");
  };

  return (
      <div>
          <Button
              id="fade-button"
              aria-controls={open ? "fade-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
          >
              Dashboard
          </Button>
          <Menu
              id="fade-menu"
              MenuListProps={{
                  "aria-labelledby": "fade-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
          >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <Link to="/Login">
                  <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Link>
          </Menu>
      </div>
  );
}