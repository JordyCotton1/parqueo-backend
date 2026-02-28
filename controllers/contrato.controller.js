const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const Venta = require("../models/venta.model");
const CarroPredio = require("../models/carropredio.model");
const Comprador = require("../models/comprador.model");
const Vendedor = require("../models/vendedor.model");

exports.generarContrato = async (req, res) => {
  try {
    const { ventaId } = req.params;

    // ============================
    // 🔍 BUSCAR DATOS DE LA VENTA
    // ============================
    const venta = await Venta.findByPk(ventaId, {
      include: [
        { model: CarroPredio, as: "Carro" },
        { model: Comprador, as: "Comprador" }
      ]
    });

    if (!venta) return res.status(404).json({ error: "Venta no encontrada" });

    const carro = venta.Carro;
    const comprador = venta.Comprador;

    // ============================
    // 📅 FECHA DEL CONTRATO
    // ============================
    const hoy = new Date();
    const dia = hoy.getDate();
    const mes = hoy.toLocaleString("es-ES", { month: "long" });
    const anio = hoy.getFullYear();

    // ============================
    // 📄 CREACIÓN DE PDF
    // ============================
    const fileName = `contrato_${ventaId}.pdf`;
    const filePath = path.join("contratos", fileName);

    if (!fs.existsSync("contratos")) fs.mkdirSync("contratos");

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ============================
    // 🖼 LOGO (ARRIBA A LA DERECHA)
    // ============================
    const logoPath = path.join(__dirname, "..", "imagenes", "Logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 350, 20, { width: 180 });
    }

    // ============================
    // 🔽 BAJAR TEXTO DEL CONTRATO
    // ============================
    doc.moveDown(10);

    // ============================
    // 📌 FECHA
    // ============================
    doc.font("Times-Roman")
       .fontSize(12)
       .text(`Quetzaltenango, ${dia} de ${mes} de ${anio}`, { align: "left" });

    doc.moveDown(2);

    // ============================
    // 🔐 DATOS FIJOS DEL GERENTE
    // ============================
    const gerenteNombre = "Derick Isaac de León Ríos";
    const gerenteDpi = "3147-84071-0901";

    // ============================
    // 📌 TEXTO DEL CONTRATO
    // ============================
    doc.fontSize(12).text(
      `Por medio de la presente Yo ${gerenteNombre}, con número de DPI ${gerenteDpi}, ` +
      `hago entrega del vehículo:\n\n` +
      `Marca/Modelo: ${carro.Modelo}\n` +
      `Año: ${carro.Anio}\n` +
      `Placas: ${carro.Placa}\n` +
      `Chasis: ${carro.Num_Chasis}\n` +
      `Número de motor: ${carro.Num_Motor}\n` +
      `Color: ${carro.Color}\n\n` +
      `El cual se encuentra a nombre de ${comprador.Nombre} ${comprador.Apellido}, ` +
      `quien se identifica con número de DPI ${comprador.DPI}. Se entrega el vehículo con todos sus accesorios, ` +
      `incluyendo tarjeta de circulación, título, llave y DPI.\n\n`
    );

    doc.text(
      `Yo ${comprador.Nombre} ${comprador.Apellido}, con número de DPI ${comprador.DPI}, ` +
      `acepto el vehículo en el estado en que se encuentra. Sin hacer responsable a Puchys Imports ` +
      `ni a su gerente ${gerenteNombre}, quien se identifica con DPI ${gerenteDpi}, por fallas en motor, caja, ` +
      `suspensión o cualquier otra avería tras revisión mecánica.\n\n`
    );

    doc.text(
      `La presente deslinda al gerente de Puchys Imports, ${gerenteNombre}, de cualquier responsabilidad civil, ` +
      `penal o de tránsito, así como cualquier alteración en el vehículo a partir de la fecha de entrega. ` +
      `Se otorga un plazo de 30 días para realizar el respectivo traspaso.\n\n`
    );

    doc.text(`Estando ambas partes de acuerdo, firman para constancia:\n\n`);

    // ============================
    // ✍ FIRMAS
    // ============================
    doc.moveDown(4);

    doc.text("______________________________", 70);
    doc.text("Cliente", 130);

    doc.text("______________________________", 350);
    doc.text("Gerente", 410);

    doc.end();

    stream.on("finish", () => {
      res.download(filePath);
    });

  } catch (error) {
    console.error("ERROR CONTRATO:", error);
    res.status(500).json({ error: "Error generando contrato" });
  }
};
