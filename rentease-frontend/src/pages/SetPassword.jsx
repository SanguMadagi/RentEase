// import React, { useState, useEffect } from "react";
// import { Container, Card, Form, Button, Alert } from "react-bootstrap";
// import { useLocation, useNavigate } from "react-router-dom";
// import authService from "../services/authService";
//
// const SetPassword = () => {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//
//   const { state } = useLocation();
//   const navigate = useNavigate();
//
//   const email = state?.email || sessionStorage.getItem("otpEmail");
//   const name = state?.name || sessionStorage.getItem("otpName");
//
//   useEffect(() => {
//     if (!email || !name) {
//       navigate("/register", { replace: true });
//     }
//   }, [email, name, navigate]);
//
//   const handleSetPassword = async (e) => {
//     e.preventDefault();
//     setError("");
//
//     if (!password || !confirmPassword) {
//       setError("Please fill in both password fields.");
//       return;
//     }
//
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }
//
//     setLoading(true);
//     try {
//       const res = await authService.setPassword(email, name, password);
//       authService.setToken(res.token);
//
//       sessionStorage.removeItem("otpEmail");
//       sessionStorage.removeItem("otpName");
//       sessionStorage.removeItem("otpPurpose");
//
//       navigate("/", { replace: true });
//     } catch (err) {
//       setError(err.message || "Failed to create account");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   if (!email) return null;
//
//   return (
//     <Container className="mt-5 mb-5">
//       <div className="row justify-content-center">
//         <div className="col-md-6 col-lg-5">
//           <Card className="shadow-lg border-0">
//             <Card.Body className="p-5">
//               <div className="text-center mb-4">
//                 <h2 className="fw-bold text-primary">Set Your Password</h2>
//                 <p className="text-muted mb-1">Creating account for</p>
//                 <p className="fw-semibold">{email}</p>
//               </div>
//
//               {error && (
//                 <Alert
//                   variant="danger"
//                   dismissible
//                   onClose={() => setError("")}
//                 >
//                   {error}
//                 </Alert>
//               )}
//
//               <Form onSubmit={handleSetPassword}>
//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-semibold">Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     placeholder="Enter password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </Form.Group>
//
//                 <Form.Group className="mb-4">
//                   <Form.Label className="fw-semibold">
//                     Confirm Password
//                   </Form.Label>
//                   <Form.Control
//                     type="password"
//                     placeholder="Re-enter password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required
//                   />
//                 </Form.Group>
//
//                 <Button
//                   type="submit"
//                   variant="primary"
//                   size="lg"
//                   className="w-100 fw-semibold"
//                   disabled={loading}
//                 >
//                   {loading ? "Creating Account..." : "Create Account"}
//                 </Button>
//               </Form>
//
//               <div className="text-center mt-4">
//                 <Button
//                   variant="link"
//                   className="text-decoration-none"
//                   onClick={() => navigate("/register")}
//                 >
//                   ← Back to Register
//                 </Button>
//               </div>
//             </Card.Body>
//           </Card>
//         </div>
//       </div>
//     </Container>
//   );
// };
//
// export default SetPassword;


import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../services/authService";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email || sessionStorage.getItem("otpEmail");
  const name = state?.name || sessionStorage.getItem("otpName");

  useEffect(() => {
    if (!email || !name) {
      navigate("/register", { replace: true });
    }
  }, [email, name, navigate]);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.setPassword(email, name, password);
      authService.setToken(res.token);

      sessionStorage.removeItem("otpEmail");
      sessionStorage.removeItem("otpName");
      sessionStorage.removeItem("otpPurpose");

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Set Your Password</h2>
          <p className="text-gray-600 text-sm mb-1">Creating account for</p>
          <p className="font-semibold text-gray-800">{email}</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 flex justify-between items-center">
            {error}
            <button onClick={() => setError("")} className="font-bold">✕</button>
          </div>
        )}

        <form onSubmit={handleSetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex justify-center items-center disabled:opacity-50"
          >
            {loading && (
              <span className="animate-spin border-t-2 border-b-2 border-white rounded-full h-4 w-4 mr-2"></span>
            )}
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
