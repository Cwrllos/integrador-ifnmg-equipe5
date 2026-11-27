import express from "express";
import cors from "cors";
import session from "express-session";
import leituraRoutes from "./routes/leitura.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import ambienteRoutes from "./routes/ambiente.routes.js";
import administradorRoutes from "./routes/administrador.routes.js";
import statusRoutes from "./routes/status.routes.js";

const app = express();

app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true,
}));
app.use(express.json());
app.use(session({
  name: "occupacontrol.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 2,
  },
}));

app.get("/", (req, res) => {
  return res.json({
    mensagem: "API OccupaControl rodando com sucesso.",
  });
});

app.use("/leituras", leituraRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/ambientes", ambienteRoutes);
app.use("/administradores", administradorRoutes);
app.use("/status", statusRoutes);

app.use((req, res) => {
  return res.status(404).json({
    erro: "Rota não encontrada.",
  });
});

export default app;