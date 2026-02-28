const express = require("express");
const router = express.Router();

const {
  obtenerVentas,
  crearVenta,
  actualizarVenta,
  eliminarVenta
} = require("../controllers/ventas.controller");

// 🔥 TODAS LAS RUTAS DEBEN TENER UNA FUNCIÓN, NO undefined

router.get("/", obtenerVentas);
router.post("/", crearVenta);
router.put("/:id", actualizarVenta);
router.delete("/:id", eliminarVenta);

module.exports = router;
