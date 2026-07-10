// import React from "react";
// import { Button } from "react-bootstrap";
// import { useAuth } from "../../context/AuthContext";
//
// const LogoutButton = ({ variant = "outline-light", className = "" }) => {
//   const { logout } = useAuth();
//
//   const handleLogout = async () => {
//     await logout();
//   };
//
//   return (
//     <Button variant={variant} onClick={handleLogout} className={className}>
//       Logout
//     </Button>
//   );
// };
//
// export default LogoutButton;

import React from "react";
import { useAuth } from "../../context/AuthContext";

const LogoutButton = ({ className = "" }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-black transition ${className}`}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
