import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

const API_URL = "https://vcall-2vlg.onrender.com/"

const setupAxiosInterceptors = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState(0)
  const [token, setToken] = useState(localStorage.getItem("authToken") || null)

  useEffect(() => {
    if (token) {
      setupAxiosInterceptors(token);
      localStorage.setItem("authToken", token);
    } else {
      setupAxiosInterceptors(null);
      localStorage.removeItem("authToken");
    }
  }, [token]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(API_URL + "/api/auth/status")
        if (res.data.isAuthenticated) {
          setCurrentUser(res.data.user)
          setIsAuthenticated(true)
          fetchCredits()
        } else {
          setToken(null);
        }
      } catch (error) {
        console.error("Authentication check failed:", error)
        setToken(null);
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [token])

  const fetchCredits = async () => {
    try {
      const res = await axios.get(API_URL + "/api/payments/credits")
      setCredits(res.data.credits)
      return res.data.credits
    } catch (error) {
      console.error("Error fetching credits:", error)
      return 0
    }
  }

  const deductCredits = async () => {
    try {
      const res = await axios.post(API_URL + "/api/payments/deduct", {})
      if (res.data.success) {
        setCredits(res.data.credits)
        return { success: true, credits: res.data.credits }
      }
      return { success: false, message: res.data.message }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to deduct credits"
      }
    }
  }

  const hasEnoughCredits = () => {
    return credits > 0
  }

  const login = async (email, password) => {
    try {
      const res = await axios.post(API_URL + "/api/auth/login", { email, password })
      setToken(res.data.token)
      setCurrentUser(res.data.user)
      setIsAuthenticated(true)
      await fetchCredits()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const signup = async (name, email, password) => {
    try {
      const res = await axios.post(API_URL + "/api/auth/signup", { name, email, password })
      setToken(res.data.token)
      setCurrentUser(res.data.user)
      setIsAuthenticated(true)
      await fetchCredits()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      }
    }
  }

  const logout = async () => {
    try {
      await axios.post(API_URL + "/api/auth/logout", {})
      setToken(null)
      setCurrentUser(null)
      setIsAuthenticated(false)
      setCredits(0)
      return { success: true }
    } catch (error) {
      return { success: false, message: "Logout failed" }
    }
  }

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    credits,
    login,
    signup,
    logout,
    fetchCredits,
    deductCredits,
    hasEnoughCredits
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
