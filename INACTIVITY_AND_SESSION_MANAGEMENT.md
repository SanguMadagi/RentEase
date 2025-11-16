# Inactivity and Session Management

## Overview

This application implements a comprehensive session management system with:
- **48-hour JWT token expiry** (2 days)
- **Automatic logout after 2 days of inactivity**
- **Activity tracking** on both frontend and backend
- **User-friendly error messages** with developer logging

## How It Works

### Backend (Spring Boot)

1. **JWT Token Generation** (`JwtUtil.java`)
   - Tokens expire after exactly **48 hours** (172,800,000 milliseconds)
   - Each token includes a `lastActivity` claim (timestamp)
   - Tokens are generated with: `issuedAt`, `expiration`, and `lastActivity` claims

2. **LastActivityFilter** (`LastActivityFilter.java`)
   - Runs before JWT authentication (Order: 1)
   - Checks token expiry and inactivity timeout
   - Returns 401 with user-friendly message if:
     - Token is expired
     - User has been inactive for 48+ hours
   - Skips public endpoints (auth, oauth2, public product views)

3. **JwtAuthenticationFilter** (`JwtAuthenticationFilter.java`)
   - Runs after LastActivityFilter (Order: 2)
   - Validates JWT and sets authentication context

4. **Activity Update Endpoint** (`/api/auth/update-activity`)
   - POST endpoint that generates a new token with updated `lastActivity`
   - Called by frontend (debounced to 1 minute)

### Frontend (React)

1. **Session Utilities** (`utils/session.js`)
   - Manages token storage with `tokenIssuedAt` and `lastActivity`
   - Provides functions to check token expiry and inactivity
   - `isSessionValid()` checks both token expiry and inactivity

2. **AuthContext** (`context/AuthContext.js`)
   - Centralized authentication state management
   - `login()`: Stores token and initializes activity tracking
   - `logout()`: Clears all session data and redirects to login
   - `updateActivity()`: Updates lastActivity (debounced to 1 minute)

3. **Activity Tracking** (`App.js`)
   - Global event listeners for: `mousemove`, `keydown`, `click`, `touchstart`, `scroll`
   - Updates `lastActivity` on any user interaction
   - Checks session validity every 5 minutes
   - Auto-logout if inactive for 48+ hours or token expired

4. **Logout Flow**
   - Manual logout: Calls backend `/api/auth/logout`, clears localStorage, redirects to login
   - Auto-logout: Shows toast message, clears session, redirects to login
   - UI always shows Login/Signup buttons after logout

## Configuration

### Adjusting the 48-Hour Timeout

**Backend:**
- `JwtUtil.java`: Change `TOKEN_EXPIRATION_TIME` constant
- `LastActivityFilter.java`: Change `INACTIVITY_TIMEOUT` constant

**Frontend:**
- `utils/session.js`: Change `INACTIVITY_TIMEOUT` constant

Example to change to 24 hours:
```java
// Backend
private static final long TOKEN_EXPIRATION_TIME = 1000L * 60 * 60 * 24; // 24 hours
private static final long INACTIVITY_TIMEOUT = 1000L * 60 * 60 * 24; // 24 hours
```

```javascript
// Frontend
const INACTIVITY_TIMEOUT = 1000 * 60 * 60 * 24; // 24 hours
```

## Testing Checklist

1. **Manual Logout**
   - Click logout button → Should redirect to `/login`
   - Navbar should show Login/Signup buttons
   - No blank pages or broken UI

2. **Token Expiry**
   - Wait 48+ hours or manually set token `exp` to past time
   - App should auto-logout with message: "Session expired. Please sign in again."

3. **Inactivity Timeout**
   - Simulate inactivity: Set `lastActivity` in localStorage to 49 hours ago
   - App should auto-logout with message: "You were logged out due to 2 days of inactivity. Please sign in."

4. **Activity Updates**
   - Move mouse, type, click → `lastActivity` should update
   - Check localStorage: `lastActivity` should be current timestamp
   - Activity should prevent auto-logout

5. **AI Assistant Errors**
   - Simulate API failure → Should show friendly message, not stack traces
   - Check console: Should log `debugId` for developers
   - UI should show user-friendly message with suggestions

## Error Handling

All errors follow this format:
```json
{
  "userMessage": "Friendly message for users",
  "debugId": "UUID-for-developers"
}
```

- **Users** see only `userMessage`
- **Developers** see full error with `debugId` in server logs/console
- **No stack traces** or technical details exposed to users

## Files Modified/Created

### Backend
- `src/main/java/com/rentease/config/JwtUtil.java` - 48h expiry, lastActivity support
- `src/main/java/com/rentease/security/LastActivityFilter.java` - Inactivity enforcement
- `src/main/java/com/rentease/controller/AuthController.java` - Logout & update-activity endpoints
- `src/main/java/com/rentease/config/SecurityConfig.java` - Filter ordering

### Frontend
- `src/utils/session.js` - Session utilities
- `src/context/AuthContext.js` - Auth state management
- `src/App.js` - Activity tracking & auto-logout
- `src/components/Auth/LogoutButton.jsx` - Logout component
- `src/components/Navbar.js` - Updated to use AuthContext
- `src/components/ProtectedRoute.js` - Updated to use AuthContext
- `src/components/Chatbot.js` - Improved error handling
- `src/pages/OtpVerification.js` - Updated to use AuthContext
- `src/pages/OAuthCallback.js` - Updated to use AuthContext

## Notes

- Activity updates are debounced to 1 minute to reduce API calls
- Session checks run every 5 minutes to balance performance and security
- All public endpoints (GET /api/products, /api/auth/**) skip activity checks
- Protected endpoints require valid session (not expired, not inactive)

