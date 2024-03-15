import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "https://localhost:7252/api"
const headers = {
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': '*'
};

const isValidEmail = (email) => {
    const regex =
        /^[A-Za-z0-9+!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    return regex.test(email);
};

export const login_default = async (username_email, password) => {
    try {
      var response = null;
      if (isValidEmail(username_email)){
        response = await axios.post(
          `${API_URL}/User/Login`,
          {
            email: username_email,
            password: password,
          },
          { headers }
        );
      }
      else {

        response = await axios.post(
            `${API_URL}/User/Login`,
          {
            username: username_email,
            password: password,
          },
          { headers }
        );
      }

      if (response.data && response.data.success && response.data.data.token) {
        const decoded_jwt = jwtDecode(response.data.data.token);
        const user_token = response.data.data.token;
        sessionStorage.setItem("token", user_token);
        // console.log(decoded_jwt.Role);
        return true;
      }
      return
    } catch (error) {
        alert(error)
    }
};