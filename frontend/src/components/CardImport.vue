<template>
  <div>
    
    <v-card class="mx-auto pb-2"> 
      <template v-if="loading ==1">    
      <v-progress-linear
        indeterminate
        color="green"
      ></v-progress-linear>    
      </template>  
      <v-card-title><h4>Import data</h4></v-card-title>      
      <v-card-subtitle class="pt-1 pb-3">
      The import only add and update automatic data, manual data will no modificated.
      </v-card-subtitle>
            <v-row
              :align="align"
              no-gutters
            >
            <v-card-text class="text-center">
            <v-icon
              large
              left
              color="green"
            >
              fas fa-file-excel
            </v-icon>
            <span class="title font-weight-light">Import from Excel format .xlsb</span>
          </v-card-text>
          <v-card-actions>
          <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls, .xlsb" @change="handleClick">
          <div class="drop mx-auto" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
            Drop excel file here or
            <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">
              Browse
            </el-button>
          </div>    
          </v-card-actions>
    </v-row>
    </v-card>
    <template v-if="loading">
    <v-card-subtitle class="text-left red p-2 text-white">Loading, please wait a moment...</v-card-subtitle>
    </template>
    <template v-else-if="completeLoading">
    <v-card-subtitle class="text-left red p-2 text-white">Ready</v-card-subtitle>
    </template>

  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      completeLoading: false,
      excelData: {
        header: null,
        results: null
      },
      mensages: "hola"
    }
  },
  methods: {
    async saveInDB(){
      fetch('http://localhost:3000/api/orders/import', {
          method: 'POST',
          body: JSON.stringify(this.excelData),
          headers:{
            'Accept':'application/json',
            'Content-type':'application/json'
          }
        }).then(res => res.json())
        await this.axios.get('http://localhost:3000/api/orders');
        this.loading = false
        this.completeLoading = true
    },
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      this.onSuccess && this.onSuccess(this.excelData)
      this.saveInDB()
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]
      if (!this.isExcel(rawFile)) {
        this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel
      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          this.generateData({ header, results })
          
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv|xlsb)$/.test(file.name)
    }
  }
}
</script>

<style scoped>
.excel-upload-input{
  display: none;
  z-index: -9999;
}
.drop{
  border: 2px dashed rgb(35, 151, 20);
  width: 400px;
  height: 160px;
  line-height: 160px;
  font-size: 22px;
  border-radius: 5px;
  text-align: center;
  color: rgb(117, 117, 117);
  position: relative;
}
</style>