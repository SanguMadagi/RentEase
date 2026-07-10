import React from "react";
import { Link } from "react-router-dom";

function Button({
  children,
  variant = "primary",
  className = "",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  href,
  to,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl text-sm transition-all duration-200 h-11 px-6 gap-2 select-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
    secondary: "bg-slate-900 hover:bg-slate-800 text-white shadow-sm",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
    outline: "border border-slate-200 hover:bg-slate-50 text-slate-700",
    ghost: "hover:bg-slate-100 text-slate-600 hover:text-slate-900",
  };

  const disabledOrLoading = disabled || loading;

  const content = (
    <>
      {loading && (
        <div className="animate-spin rounded-full h-4.5 w-4.5 border-t-2 border-b-2 border-current"></div>
      )}
      {children}
    </>
  );

  if (to) {
    return (
      <Link
        to={disabledOrLoading ? "#" : to}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        onClick={onClick}
        {...props}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        onClick={disabledOrLoading ? (e) => e.preventDefault() : onClick}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabledOrLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
}

export default Button;
