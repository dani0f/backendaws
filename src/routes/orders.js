const express = require('express');
const order = require('../models/order');
const router = express.Router();
const orderSchema = require('../models/order')


router.post('/import',async (req,res) =>{
    function addDays(date, days){
        date.setDate(date.getDate() + days);
        return date;
    }
    var options = { upsert:true };
    req.body.results.forEach(async element => {
        var proyecto ="" 
        var comprador =""
        var numNecesidad = String(element['Número de necesidad'])
        var cantidadsolicitada = String(element['Cantidad de pedido'])
        var cantidadfaltante = String(element['Por entregar (cantidad)'])
        var cantidadentregada = 0
        var documentdate = addDays(new Date('1900-01-01'),parseInt(element['Fecha documento'])-1)
        var deliverydate= addDays(new Date('1900-01-01'),parseInt(element['Fecha de entrega'])-1)
        if(numNecesidad !== "undefined"){
            proyecto=numNecesidad.slice(0,3)
            comprador=numNecesidad.slice(-3)
        }
        if( cantidadsolicitada != "undefined" && cantidadentregada!="undefined"){
            cantidadentregada=parseInt(cantidadsolicitada)-parseInt(cantidadfaltante)
        }  
        //id para el mach son los campos oc y position
        var query = {
            oc: element['Documento compras'] , 
            position: element['Posición']
        };
        var update = {$set:{
            oc: element['Documento compras'],
            position: element['Posición'],
            solped: element['Solicitud de pedido'],
            proyecto: proyecto,//primeros 3 números
            documentdate: documentdate,
            proveedor: element['Proveedor/Centro suministrador'],
            description: element['Texto breve'],
            deliverydate: deliverydate,
            comprador: comprador,//últimos 3 números
            cantidadsolicitada: element['Cantidad de pedido'],
            cantidadentregada:  cantidadentregada,
            cantidadfaltante: element['Por entregar (cantidad)'],
        }};
        await orderSchema.updateOne(query,update,options);
    });
    res.json({
        status:'Orders save'
    });        
});

router.get('/', async (req,res) => {
   const orders = await orderSchema.find();
   res.json(orders);
});
router.post('/',async (req,res) =>{
    const order = new orderSchema(req.body);
    await order.save()
    res.json({
        status:'Order Saved'
    });
});
router.put('/:id', async (req,res) =>{
    await orderSchema.findByIdAndUpdate(req.params.id , req.body);
    res.json({
        status: 'Order Update'
    })

});
router.delete('/:id',async (req, res) =>{
    await orderSchema.findByIdAndRemove(req.params.id);
    //await orderSchema.deleteMany();
    res.json({
        status: 'Order Removed'
    })
});



module.exports = router;