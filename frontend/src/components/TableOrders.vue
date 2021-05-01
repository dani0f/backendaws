<!--  Plantilla de ejemplo de comunicación con la BD-->
<template>
<div>
    <v-card-title>
      
      <v-spacer></v-spacer>

    </v-card-title>

    <v-data-table
     fixed-header
    :headers="headers"
    :items="orders"
    :search="search"
    sort-by="sortBy.toLowerCase()"
    class="elevation-1"
  >
    
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title >Purchase Order</v-toolbar-title>
        <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                clearable
               flat
               hide-details
               prepend-inner-icon="fas fa-search"
               color='red darken-2'
               label="Search"
               
              ></v-text-field>
            <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              hide-details
              :items="keys"
              prepend-inner-icon="fas fa-search"
              color='red darken-1'
              label="Sort by"
             ></v-select>
            </template>             
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <form @submit.prevent="addOrder">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.oc"
                       label="PO"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.position"
                       label="Pos"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.promisedate"
                      label="Promise Date"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.forecast"
                      label="Forecast"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-select
                    label="Status"
                    item-value="estado"
                    v-model="editedItem.estado" 
                    :items="statusOptions"   
                    > 
                    </v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-select
                      item-value="tipodespacho"
                      label="Shipment Type"
                      v-model="editedItem.tipodespacho"
                      :items="shipmentOptions"
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.guia"
                      label="Guide"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.comentario"
                      label="Commentary"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-icon
                color="red darken-4"
                text
                @click="close"
              >
               far fa-window-close
              </v-icon>
              <v-icon
                color="green darken-4"
                text
                @click="save"
              >
                far fa-check-square
              </v-icon>
            </v-card-actions>
            </form>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-4" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="green darken-4" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    
    <template v-slot:item.actions="{item}">
      <v-icon
        small
        color="green darken-1"
        class="mr-2"
        @click="editItem(item)"
      >
      fas fa-edit
      </v-icon>
      <v-icon
        small
        color="red darken-4"
        @click="deleteItem(item)"
      >
      fas fa-trash-alt
      </v-icon>
    </template>
    <template v-slot:item.alert="{ item }">
      <v-chip
        small       
        :color="getcolor(item.deliverydate)"
      >
        {{ daysAlert(item.deliverydate) }}
      </v-chip>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="getOrders"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
  </div>
</template>
<script>
class Order {
  constructor(){
    this.tittle = '';
    this.description = '';    
  }
}
export default {
    data(){
      return{
        dialog: false,
        dialogDelete: false,
        search:'',
        buscar:'',
        proveedor:'',
        filter: {},
        keys: [
          'PO', 
          'Solped',
          'Project',
          'Supplier',
          'Forecast',
          'Status',
          'Purchaser',
          'Alert',
          'Shipment Type',
        ],
        statusOptions:[
          'Despachado',
          'Sin Avance',
          'En Fabricación',
          'Espera Transporte', 
          'Espera acta liberación',
          'Espera liberación inspección',
          'POS detenida',
          'RES Oficina técnica',
          'Liberación Parcial',
          'Despacho Parcial',
          'Rechazado con OBS',
          ],
        shipmentOptions:[
          'Samex',
          'Deysu',
          'Bodega IT',
          'Artisa',
          'PDQ',
          'Proyecto',
          ],
              
        headers: [
          { text: 'Actions', value: 'actions', align: 'start', sortable: false },
          {
            text: 'PO',
            width: "100px",
            value: 'oc',
          },
          { text: 'Position', width: "100px", value: 'position' },
          { text: 'Solped', value: 'solped' },
          { text: 'Project',width: "100px",value: 'proyecto' },
          { text: 'Document Date', value: 'documentdate' },
          { text: 'Supplier ', width: "200px" ,value: 'proveedor' },
          { text: 'Description', width: "205px" ,value: 'description' },
          { text: 'Due Date' ,value: 'deliverydate' },
          { text: 'Promise Date',value: 'promisedate' } ,
          { text: 'Forecast', width: "150px",value: 'forecast' },
          { text: 'Status',width: "150px", value: 'estado' },
          { text: 'Purchaser', width: "110px", value: 'comprador' },
          { text: 'Requested Amount', value: 'cantidadsolicitada' },
          { text: 'Delivered Amount', value: 'cantidadentregada' },
          { text: 'Pending Amount', value: 'cantidadfaltante' },
          { text: 'Alert', value: 'alert'},
          { text: 'Shipment Type',width: "100px", value: 'tipodespacho' },
          { text: 'Guide',width: "100px",value: 'guia' },
          { text: 'Commentary',width: "200px", value: 'comentario' },
        ],
        order: new Order(),
        orders: [],
        editedIndex: -1,
        editedItem: {
          oc: 0,
          position: 0,
          solped: '',
          proyecto: 0,
          documentdate: '',
          proveedor:'',
          description: '',
          deliverydate: '',
          promisedate: '',
          forecast: '',
          estado: '',
          comprador: '',
          cantidadsolicitada: 0,
          cantidadentregada: 0,
          cantidadfaltante: 0,     
          tipodespacho: '',
          guia: 0,
          comentario:'',
          alert: ''
        
        },
        defaultItem: {
          oc: 0,
          position: 0,
          solped: '',
          proyecto: 0,
          documentdate: '',
          proveedor:'',
          description: '',
          deliverydate: '',
          promisedate: '',
          forecast: '',
          estado: '',
          comprador: '',
          cantidadsolicitada: 0,
          cantidadentregada: 0,
          cantidadfaltante: 0,     
          tipodespacho: '',
          guia: 0,
          comentario:'',
          alert:''
        },
      }
    },

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit OC'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.getOrders();
    },
    methods: {
      daysAlert(deliverydate){
        var timeStart = new Date();
        var timeEnd = new Date(deliverydate);
        var diff = timeEnd.getTime() - timeStart.getTime();
        var dias_restantes=Math.round(diff / (1000 * 60 * 60 * 24));
        return(dias_restantes-1)
      },
      async getOrders(){
        const res = await this.axios.get('http://localhost:3000/api/orders');
        console.log(res.data)
        this.orders = res.data
      },
      addOrder(){
        fetch('http://localhost:3000/api/orders', {
          method: 'POST',
          body: JSON.stringify(this.order),
          headers:{
            'Accept':'application/json',
            'Content-type':'application/json'
          }
        }).then(res => res.json())
        .then(() => {
        this.getOrders();
        })
        this.order = new Order();
      },
      deleteOrder(id){
        fetch('http://localhost:3000/api/orders/' + id, {
          method: 'DELETE',
          headers: {
            'Accept':'application/json',
            'Content-type':'application/json'
          }
        })
        .then(res => res.json)
        .then(() => {
        this.getOrders();
        })
      },
      editOrder(){
        fetch('http://localhost:3000/api/orders/' + this.editedItem._id,{
          method: 'PUT',
          body: JSON.stringify(this.editedItem),
          headers: {
            'Accept':'aplication/json',
            'Content-type':'application/json' 
          }
        })
        .then(res => res.json)
        .then(() => {
          this.getOrders();
        })
      }
      ,
      editItem (item) {
        this.editedIndex = this.orders.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.orders.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.orders.splice(this.editedIndex, 1)
        this.deleteOrder(this.editedItem._id)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      getcolor (deliverydate){
        var quedandias = this.daysAlert(deliverydate)
        if (quedandias >= 0) return 'green accent-4'
        else if (quedandias < 0 & quedandias >= -7) return 'yellow accent-4'
        else if (quedandias < -7 & quedandias >= -15) return'orange darken-11'
        else if (quedandias < -15 & quedandias >= -30) return 'red lighten-1'
        else return 'red accent-4'

      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.orders[this.editedIndex], this.editedItem)
        } else {
          this.orders.push(this.editedItem)
        }
        this.editOrder()
        this.close()
      },
            

    }
  
  }

</script>