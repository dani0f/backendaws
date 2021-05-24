const express = require('express');
const order = require('../models/order');
const router = express.Router();
const orderSchema = require('../models/order')
const UserSchema = require('../models/Users')

router.post('/import',async (req,res) =>{
    function addDays(date, days){
        date.setDate(date.getDate() + days);
        return date;
    }
    userId = req.body.userId
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
            position: element['Posición'] ,
            userId: userId
        };
        var update = {$set:{
            userId: userId,
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

router.get('/suppliers', async (req,res) => {
    let user = req.headers.user; //token
    console.log(user,"user")
    const suppliers = await orderSchema.distinct("proveedor",{userId: user});
    const projects = await orderSchema.distinct("proyecto",{userId: user});
    var data = {
        suppliers : suppliers ,
        projects : projects
    }
    res.json(data);
});
//"proveedor"
//"proyecto"


router.post('/kpi', async (req,res) => {
    var start =  new Date("2010-01-01")
    let user = req.headers.user; //token
    console.log(user,"user")
    var query = {
        deliverydate: {"$gte" : start, "$lte" : req.body.date},
        proveedor: req.body.suplier,
        proyecto: req.body.project,
        userId: user
    }
    console.log(query)
    orders = await orderSchema.find(query,{deliverydate:1,proyecto:1,proveedor:1,promisedate:1,})
    console.log(orders)
    res.json(orders)
});

//db.coleccion.find({documentdate : {"$gte" : start, "$lte" : end}})
//documentdate o deliverydate
//due date es deliverydate

router.get('/', async (req,res) => {
    let user = req.headers.user; //token
    console.log(typeof user,"a")
    console.log(user,'6095e7520ac4e030b0e6f958',"a")
    const orders = await orderSchema.find({ userId: user});
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
    await orderSchema.deleteMany();
    res.json({
        status: 'Order Removed'
    })
});



module.exports = router;