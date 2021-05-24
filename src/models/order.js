const mongoose = require('mongoose');
const { Schema } = mongoose;


const orderSchema = new Schema({
    oc: Number,
    position: Number,
    solped: Number,
    proyecto: String,
    documentdate: Date,//fecha de la orden
    proveedor: String,
    description: String,
    deliverydate: Date,
    promisedate: Date,//fecha en la que se comprometen
    forecast: String,
    estado: String,
    comprador: String,
    cantidadsolicitada: Number,
    cantidadentregada: Number,
    cantidadfaltante: Number,
    tipodespacho: String,
    fechadespacho: String,//fecha que debieron entregar
    guia: Number,
    comentario: String,
    cumplimiento: String,
    userId: String 
});

module.exports = mongoose.model('order', orderSchema);

