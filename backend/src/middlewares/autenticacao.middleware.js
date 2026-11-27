export function exigirAutenticacao(req, res, next) {
  if (!req.session?.administradorId) {
    return res.status(401).json({
      erro: "Acesso não autorizado. Faça login.",
    });
  }

  next();
}