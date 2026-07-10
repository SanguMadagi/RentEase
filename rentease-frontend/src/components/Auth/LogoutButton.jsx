import React from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../Button";

const LogoutButton = ({ className = "", variant = "outline" }) => {
  const { logout } = useAuth();

  return (
    <Button
      onClick={logout}
      variant={variant}
      className={className}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
