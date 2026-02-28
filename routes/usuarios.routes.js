const express = require("express");
const router = express.Router();

const {
  registrar,
  login,
  listarUsuarios,
  crearInicial   // ✅ agregado
} = require("../controllers/usuarios.controller");

const { verificarToken, soloGerente } = require("../middlewares/auth");

// ===============================
// Crear usuario inicial (solo 1 vez)
// ===============================
router.get("/crear-inicial", crearInicial);

// ===============================
// Login
// ===============================
router.post("/login", login);

// ===============================
// Crear usuario (solo gerente)
// ===============================
router.post("/", verificarToken, soloGerente, registrar);

// ===============================
// Listar usuarios
// ===============================
router.get("/", verificarToken, soloGerente, listarUsuarios);

module.exports = router;
