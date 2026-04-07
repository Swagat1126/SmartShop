import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const safeJsonParse = (value) => {
    if (!value || value === "undefined") return null;
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};

const normalizeUser = (userData) => {
    if (!userData || typeof userData !== "object") return null;
    const id = userData.id || userData._id || userData.userId;
    if (!id || id === "undefined") return null;
    if (userData.id === id) return userData;
    return { ...userData, id };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");
        const storedAdmin = localStorage.getItem("admin");

        const adminUser = normalizeUser(safeJsonParse(storedAdmin));
        const normalUser = normalizeUser(safeJsonParse(storedUser));

        if (adminUser?.id) {
            setUser(adminUser);
            setIsAdmin(true);
        } else if (normalUser?.id) {
            setUser(normalUser);
            setIsAdmin(false);
        } else if (adminUser || normalUser) {
            localStorage.removeItem("currentUser");
            localStorage.removeItem("admin");
            localStorage.removeItem("token");
        }
    }, []);

    const login = (userData, isAdminLogin = false) => {
        const normalizedUser = normalizeUser(userData);
        if (isAdminLogin) {
            localStorage.setItem("admin", JSON.stringify(normalizedUser));
            setIsAdmin(true);
        } else {
            localStorage.setItem("currentUser", JSON.stringify(normalizedUser));
            setIsAdmin(false);
        }
        localStorage.setItem("token", userData.token || "dummyToken123");
        setUser(normalizedUser);
    };

    const logout = () => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("admin");
        localStorage.removeItem("token");
        setUser(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};