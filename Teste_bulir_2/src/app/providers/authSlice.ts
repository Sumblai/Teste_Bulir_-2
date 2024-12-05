import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Definição do tipo de usuário
interface User {
  _id: string;
  name: string;
  nif: string;
  email: string;
  role: string;
  balance: number;
}

// Estado inicial da autenticação
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Ação de login
    login(state, action: PayloadAction<{ user: User; token: string }>) {
      const { user, token } = action.payload;

      // Salvar o token no cookie
      Cookies.set("token", token, { path: "/", expires: 7, secure: true, sameSite: "strict" });

      // Salvar os dados do usuário no localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Atualizar o estado
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
    },
    // Ação de logout
    logout(state) {
      // Remover o token do cookie usando as mesmas configurações
      Cookies.remove("token", { path: "/" });

      // Remover os dados do usuário do localStorage
      localStorage.removeItem("user");

      // Limpar o estado
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    // Ação para carregar os dados do usuário e token ao inicializar
    loadUser(state) {
      const storedUser = localStorage.getItem("user");
      const storedToken = Cookies.get("token");

      if (storedUser && storedToken) {
        state.user = JSON.parse(storedUser);
        state.token = storedToken;
        state.isAuthenticated = true;
      }
    },
  },
});

// Exportar as ações
export const { login, logout, loadUser } = authSlice.actions;

// Exportar o reducer
export default authSlice.reducer;
