const express = require("express");
const router = express.Router();

const {
  registrar,
  login,
  listarUsuarios,
  crearInicial   // 👈 AGREGADO
} = require("../controllers/usuarios.controller");

const { verificarToken, soloGerente } = require("../middlewares/auth");

// ================================
// CREAR USUARIO INICIAL (Temporal)
// ================================
router.get("/crear-inicial", crearInicial);  // 👈 AGREGADO

// ================================
// Login
// ================================
router.post("/login", login);

// ================================
// Crear usuario (solo gerente)
// ================================
router.post("/", verificarToken, soloGerente, registrar);

// ================================
// Listar usuarios
// ================================
router.get("/", verificarToken, soloGerente, listarUsuarios);
module.exports = router;