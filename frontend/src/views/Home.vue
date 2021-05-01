<template>
  <div>
    <v-container>  
      <v-card class="p-2">
         <v-parallax
    dark
    src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
    <v-card-title>
    <h1>Welcome {{ name }}</h1>  
    </v-card-title>
    <v-card-text>
    <h2>your username is: {{ username }}</h2>
    <h2>your role is: {{accessLevel}} </h2>
    <p>(1:user, 2:admin)</p>
    <p v-if="userLogged">Token: {{userLogged}}</p>
    </v-card-text>
         </v-parallax>
    </v-card>  
    </v-container> 
    </div>
</template>
<script>

import Cookies from "js-cookie";
export default {
    data() {
      return {
        name: null,
        username: null,
        accessLevel: null
        }
    },
    computed: {
      userLogged() {
        return this.getUserLogged();
        },
    }
    ,
    created() {
      //user is not authorized
      console.log(this.userLogged)
      if (typeof this.userLogged === 'undefined') {
        this.$router.push('/login');
      }
    },
    async mounted(){
      await fetch('http://localhost:3000/api/users/user', {
        method: 'GET',
         headers: {
            'Accept' : 'application/json',
            'Content-type':'application/json',
            token : this.getUserLogged()
            }
      })
      .then(res => res.json())
      .then(data => {
      this.name = data.user.name;
      this.username = data.user.username
      this.accessLevel = data.user.accessLevel
      });
    }
    ,
  methods:{
    setUserLogged(userLogged) {
      Cookies.set("userLogged", userLogged);
    },
    getUserLogged() {
      return Cookies.get("userLogged");
    },
    deleteUserLogged() {
      Cookies.remove('userLogged');
    },
  }
};
</script>