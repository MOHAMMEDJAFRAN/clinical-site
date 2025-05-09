'use client'
// app/layout.jsx
import { AuthProvider } from '../../context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}