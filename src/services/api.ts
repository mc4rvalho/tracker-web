import axios from "axios";

export const api = axios.create({
  baseURL: "https://tracker-api-7krq.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@Tracker:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const dashboardService = {
  getTotals: async () => {
    try {
      // Faz o get na rota correta
      const resposta = await api.get("/dashboard/totals");
      // Retorna apenas os dados para quem pediu
      return resposta.data;
    } catch (erro) {
      console.error(`Erro ao buscar Totais: ${erro}`);
      throw erro; // Repassa o erro para o React lidar depois
    }
  },

  getRecents: async () => {
    try {
      const resposta = await api.get("/dashboard/recent");
      return resposta.data;
    } catch (erro) {
      console.error(`Erro ao buscar Atividades Recentes: ${erro}`);
      throw erro;
    }
  },

  getAnalytics: async () => {
    try {
      const resposta = await api.get("/dashboard/analytics");
      return resposta.data;
    } catch (erro) {
      console.error(`Erro ao buscar Analytics: ${erro}`);
      throw erro;
    }
  },
};
