import React, { useState, useRef, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../api/axios";
import { useAlert } from "./AlertContextProvider";

const Avatar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const avatarRef = useRef(null);

  const { user,setUser } = useContext(UserContext);
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
};

const handleClickOutside = (e) => {
    if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !avatarRef.current.contains(e.target)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function handleLogout() {
    return axiosClient.get("/users/logout");
  }
  const mutation = useMutation({
    mutationFn: handleLogout,
    onSuccess: (data, vars, context) => {
      console.log("logout success");
      setUser(null);
      showAlert("Logged Out Successfully!");
      navigate("/");
      localStorage.removeItem("auth_token");
    },
    onError: (error, vars, context) => {
      console.log(error);
    },
  });

  return (
    <div className="relative" ref={avatarRef}>
      {/* Avatar Image */}
      <button onClick={toggleMenu}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="36px"
          viewBox="0 -960 960 960"
          width="36px"
          fill="#000000"
        >
          <path d="M226-262q59-42.33 121.33-65.5 62.34-23.17 132.67-23.17 70.33 0 133 23.17T734.67-262q41-49.67 59.83-103.67T813.33-480q0-141-96.16-237.17Q621-813.33 480-813.33t-237.17 96.16Q146.67-621 146.67-480q0 60.33 19.16 114.33Q185-311.67 226-262Zm253.88-184.67q-58.21 0-98.05-39.95Q342-526.58 342-584.79t39.96-98.04q39.95-39.84 98.16-39.84 58.21 0 98.05 39.96Q618-642.75 618-584.54t-39.96 98.04q-39.95 39.83-98.16 39.83ZM480.31-80q-82.64 0-155.64-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.51T80-480.18q0-82.82 31.5-155.49 31.5-72.66 85.83-127Q251.67-817 324.51-848.5T480.18-880q82.82 0 155.49 31.5 72.66 31.5 127 85.83Q817-708.33 848.5-635.65 880-562.96 880-480.31q0 82.64-31.5 155.64-31.5 73-85.83 127.34Q708.33-143 635.65-111.5 562.96-80 480.31-80Zm-.31-66.67q54.33 0 105-15.83t97.67-52.17q-47-33.66-98-51.5Q533.67-284 480-284t-104.67 17.83q-51 17.84-98 51.5 47 36.34 97.67 52.17 50.67 15.83 105 15.83Zm0-366.66q31.33 0 51.33-20t20-51.34q0-31.33-20-51.33T480-656q-31.33 0-51.33 20t-20 51.33q0 31.34 20 51.34 20 20 51.33 20Zm0-71.34Zm0 369.34Z" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="z-50 absolute right-0 w-48 bg-white shadow-lg rounded-sm"
        >
          <ul>
            {user ? (
              <>
                <li>
                  <Link
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    to="/reservations"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Reservations
                  </Link>
                </li>
                <li>
                  <Link
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    to="/favorites"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Favorites
                  </Link>
                </li>
                <li>
                  <div
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {setMenuOpen(false);mutation.mutate();}}
                  >
                    Logout
                  </div>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    className="z-50 block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    className="z-50 block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Avatar;
