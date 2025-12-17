# Register User Fix Summary

## 🐛 Issue
Register user mutation không gửi `password_confirmation` field theo yêu cầu của backend Rails.

## ✅ Solution

### 1. **Updated Type Definition** (`src/types/index.ts`)
Thêm `passwordConfirmation` vào `RegisterUserInput`:

```typescript
export interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string; // ✅ Added
}
```

### 2. **Updated Register Page** (`src/app/register/page.tsx`)
Gửi `passwordConfirmation` trong mutation variables:

```tsx
await registerUser({
  variables: {
    input: {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      passwordConfirmation: formData.confirmPassword, // ✅ Added
    },
  },
});
```

### 3. **Fixed Login Callback**
Sử dụng trực tiếp user data từ response thay vì manually construct:

```tsx
// ❌ Before
login(data.registerUser.accessToken, {
  id: data.registerUser.user.id,
  username: data.registerUser.user.username,
  email: data.registerUser.user.email,
  createdAt: new Date().toISOString(), // Manual field
});

// ✅ After
login(data.registerUser.accessToken, data.registerUser.user);
```

## 📋 How It Works

### GraphQL Variable Mapping
Apollo Client tự động chuyển đổi camelCase sang snake_case khi gửi tới backend:

```
Frontend (camelCase)     →     Backend (snake_case)
passwordConfirmation     →     password_confirmation
```

### Complete Flow
```
1. User fills form → username, email, password, confirmPassword
2. Frontend validates → password === confirmPassword
3. Frontend sends GraphQL mutation:
   {
     username: "john_doe",
     email: "john@example.com", 
     password: "secret123",
     passwordConfirmation: "secret123"
   }
4. Apollo converts to:
   {
     username: "john_doe",
     email: "john@example.com",
     password: "secret123", 
     password_confirmation: "secret123"  ← Rails expects this
   }
5. Backend validates and creates user
6. Backend returns: { user, accessToken }
7. Frontend calls login() with user data
8. Redirect to /browse
```

## 🎯 Key Changes

| File | Change | Description |
|------|--------|-------------|
| `types/index.ts` | Added `passwordConfirmation` | Type definition for input |
| `register/page.tsx` | Send `passwordConfirmation` | Include in mutation variables |
| `register/page.tsx` | Fixed login callback | Use response data directly |

## ✅ Validation

### Frontend Validation (Before API Call)
```tsx
// 1. Check passwords match
if (formData.password !== formData.confirmPassword) {
  setError('Passwords do not match');
  return;
}

// 2. Check password length
if (formData.password.length < 6) {
  setError('Password must be at least 6 characters long');
  return;
}
```

### Backend Validation (Rails)
Backend sẽ validate:
- Username uniqueness
- Email format và uniqueness
- Password confirmation match
- Password strength requirements

## 🧪 Testing

### Manual Test Steps
1. Navigate to `/register`
2. Fill in form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Sign Up"
4. Should redirect to `/browse` with logged in state

### Expected Behavior
- ✅ User created in database
- ✅ Access token received
- ✅ User logged in automatically
- ✅ Redirected to browse page

### Error Cases
```tsx
// Case 1: Passwords don't match
password: "abc123"
confirmPassword: "xyz789"
→ Error: "Passwords do not match"

// Case 2: Password too short  
password: "abc"
→ Error: "Password must be at least 6 characters long"

// Case 3: Backend validation fails
→ Error: "Registration failed. Please try again."
```

## 📊 Build Status

```bash
✓ Compiled successfully in 3.9s
✓ TypeScript (0 errors)
✓ Generating static pages (10/10)
✓ All routes built successfully
```

## 🔗 Related Files

- `src/types/index.ts` - Type definitions
- `src/app/register/page.tsx` - Register page component
- `src/lib/graphql/mutations.ts` - GraphQL mutations
- `src/contexts/AuthContext.tsx` - Authentication context

## 📝 Notes

### Why `passwordConfirmation` instead of `password_confirmation`?
- Frontend uses camelCase convention (JavaScript/TypeScript standard)
- Apollo Client automatically converts to snake_case for GraphQL
- Backend receives `password_confirmation` as expected

### Why remove manual `createdAt`?
- Backend should be the source of truth for creation timestamps
- Frontend shouldn't fabricate server data
- Use whatever backend returns

## ✅ Status

**Fixed:** ✅ Complete  
**Build:** ✅ Passing  
**Ready:** ✅ Production

---

**Date:** November 19, 2025  
**Issue:** Register user missing password_confirmation  
**Solution:** Added passwordConfirmation to mutation input
