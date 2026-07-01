import express from "express";
import cors from "cors";

import leituraRoutes from "./routes/leitura.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import ambienteRoutes from "./routes/ambiente.routes.js";
import administradorRoutes from "./routes/administrador.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    mensagem: "API OccupaControl rodando com sucesso.",
  });
});

app.use("/leituras", leituraRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/ambientes", ambienteRoutes);
app.use("/administradores", administradorRoutes);

app.use((req, res) => {
  return res.status(404).json({
    erro: "Rota não encontrada.",
  });
});

export default app;