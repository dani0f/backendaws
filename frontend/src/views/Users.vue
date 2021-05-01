<template>

    <div>
      <div class="container">
          <div class="row pt-5">
               <div class="col-md-5">
                 <v-card elevation="3">
                    <v-card-title><h3>Add user</h3></v-card-title>
                     <v-card-text>
                         <v-form @submit.prevent="sendTask" id="check-form" ref="form">
                              <div class="form-group">
                                 <v-text-field
                                 v-model="task.name"
                                 label="Insert a Name"
                                 :rules="rulesName"
                                 hide-details="auto"
                                 ></v-text-field>
                             </div>
                             <div class="form-group">
                                <v-text-field
                                 v-model="task.username"
                                 label="Insert a Username"
                                 :rules="rulesUsername"
                                 hide-details="auto">
                                 </v-text-field>
                             </div>
                             <div class="form-group">
                                <v-text-field
                                 v-model="task.password"
                                 label="Insert a Password"
                                 :rules="rulesPassword"
                                 hide-details="auto"
                                 ></v-text-field>
                             </div>
                             <div class="form-group">
                                <v-text-field
                                 v-model="task.accessLevel"
                                 label="Insert a AccesLevel">
                                 </v-text-field>
                             </div>
                            <v-card-actions>
                             <template v-if="edit === false">
                                 <v-btn type="submit" form="check-form" class="text-white" color="deep-purple" title="add user">save</v-btn>      
                            </template>
                            <template v-else>
                                 <v-btn type="submit" form="check-form" class="text-white" color="teal darken-4" title="edit user">Update</v-btn>      
                            </template>
                            </v-card-actions> 
                         </v-form>
                     </v-card-text>
                 </v-card>
                </div>

                <div class="col-md-7">
                    <table class='table table-bordered'>
                        <thead>
                            <tr>
                                <th class='red'> name </th>
                                <th class='red'> username </th>
                                <th class='red'> password </th>
                                <th class='red'> accessLevel </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="task of tasks" v-bind:key="task">
                                <td class='red lighten-3'>{{task.name}}</td>
                                <td class='red lighten-3'>{{task.username}}</td>
                                <td class='red lighten-3'>{{task.password}}</td>
                                <td class='red lighten-3'>{{task.accessLevel}}</td>
                                <td>
                                    <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                                    <button @click="deleteTask(task._id)"
                                    class="btn btn-danger red darken-4">
                                        Delete
                                    </button>
                                    <button @click="editTask(task._id)"
                                        class="btn btn-danger light-green darken-3">
                                        Edit
                                    </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
         </div>
     </div>
    </div>
    </div>

</template>

<script>

    class Task{
        constructor(name, username, password, accessLevel){
            this.name = name;
            this.username = username;
            this.password = password;
            this.accessLevel = accessLevel;
        }
    }

    export default {
        data() {
            return{
                rulesName:[
                    value => !!value || 'Required.',
                    value => (value && value.length >=3) || 'Min 3 characters'
                ],
                rulesUsername:[
                    value => !!value || 'Required.',
                    value => (value && value.length >=3) || 'Min 3 characters'
                ],
                rulesPassword:[
                    value => !!value || 'Required.',
                    value => (value && value.length >=3) || 'Min 3 characters'
                ],
                task: new Task(),
                tasks: [],
                edit: false,
                taskToEdit: '',
                error: ''
            }
        },
        created() {
            this.getTasks();
        },
        methods: {
            sendTask(){
                if(this.edit === false) {
                    fetch('http://localhost:3000/api/users',{
                        method: 'POST',
                        body: JSON.stringify(this.task),
                        headers: {
                        'Accept' : 'application/json',
                        'Content-type':'application/json'
                        }
                    })
                        .then(res => {
                            this.error='';
                            console.log(res)
                        }, err =>{
                            this.error = err.response.data.error
                        })
                        .then(data => {
                            this.getTasks(data);
                        })
                   
               } else {
                   fetch('http://localhost:3000/api/users/' + this.taskToEdit, {
                       method: 'PUT',
                       body: JSON.stringify(this.task),
                       headers: {
                        'Accept' : 'application/json',
                        'Content-type':'application/json'
                       }
                   })
                        .then(res => res.json())
                        .then(data => {
                            this.getTasks(data);
                            this.edit = false;
                        });
               }
               this.task = new Task();
               this.$refs.form.reset()
            },
            getTasks() {
                fetch('http://localhost:3000/api/users')
                    .then(res => res.json())
                    .then(data => {
                        this.tasks =  data;
                        console.log(this.tasks)
                    });
            },

            deleteTask(id){
                console.log(id)
                fetch('http://localhost:3000/api/users/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept' : 'application/json',
                    'Content-type':'application/json'
                    }
               })
               .then(res => res.json())
               .then(data => {
                   this.getTasks(data);
               });
            },

            editTask(id) {
                console.log(id)
                fetch('http://localhost:3000/api/users/' + id)
                    .then(res => res.json())
                    .then(data => {
                        this.task = new Task(data.name, data.username, data.password, data.accessLevel);
                        this.taskToEdit = data._id;
                        this.edit = true;
                    });

            },
        }

    }
</script>