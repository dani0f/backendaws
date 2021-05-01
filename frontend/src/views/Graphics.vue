<template>  
<div>
      <v-container>
         <v-row>
          <v-col cols="12" md="5">
            
                  <template >
                    <h1 class="headline mb-2 grey--text">Grafico de provedores</h1>
                      <GChart
                        type="PieChart"
                        :data="chartData"
                        :options="chartOptions"
                        style="width: 500px; height: 300px;"
                      />   
                  </template>

          </v-col>
        </v-row>
      </v-container>

      </div>
</template>

<script>
import { GChart } from "vue-google-charts";
 const gradients = [
    ['#222'],
    ['#42b3f4'],
    ['red', 'orange', 'yellow'],
    ['purple', 'violet'],
    ['#00c6ff', '#F0F', '#FF0'],
    ['#f72047', '#ffd200', '#1feaea'],
  ]
export default {
    data () {
      return {
        picker: new Date().toISOString().substr(0, 10),
         chartData: [
       ["ID", "X", "Y", "In Million"],
        ["provedor 1", 80, 167, 120],
        ["provedor 2", 79, 136, 130],
        ["provedor 3", 78, 184, 50],
        ["provedor 4", 72, 278, 230],
        ["provedor 5", 81, 200, 210],
        ["provedor 6", 72, 170, 100],
        ["provedor 7", 68, 477, 80]
      ],
      chartOptions: {
        colorAxis: { colors: ["yellow", "red"] }
      },
      showLabels: false,
      lineWidth: 2,
      labelSize: 7,
      radius: 15,
      padding: 8,
      lineCap: 'round',
      gradient: gradients[5],
      value: [0, 2, 5, 9, 5, 10, 3, 5, -4, -10, 1, 8, 2, 9, 0],
      gradientDirection: 'top',
      gradients,
      fill: false,
      type: 'trend',
      autoLineWidth: false,
      }
    },
    components: {
    GChart
  },
  }
</script>
