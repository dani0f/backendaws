<template>
  <div>
    <v-contend>
    <v-card width="500px"
     class="mx-auto">
      <v-card-title>
        <h3>Login</h3>
      </v-card-title>
      <v-card-text>
          <v-text-field
            v-model="username"
            :rules="rulesUsername"
            counter="25"
            label="username"
          ></v-text-field>
            <v-text-field
            v-model="password"
            :rules="rulesPassword"
            counter="25"
            label="password"
            type="password"
          ></v-text-field>
      </v-card-text>
    <v-card-actions>
    <v-btn 
      color="green lighten-3"
      @click="login">login</v-btn>
    </v-card-actions>
    <p class="text-center text-danger">{{ error }}  </p>     
    </v-card>
    </v-contend>
  </div>
</template>
<script>

import Cookies from "js-cookie";

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: '',
    }
  },
  methods: {
    setUserLogged(userLogged) {
      Cookies.set("userLogged", userLogged);
    },
    getUserLogged() {
      return Cookies.get("userLogged");
    },
    login() {
      let user = {
        username: this.username,
        password: this.password
      }
      this.axios.post('http://localhost:3000/api/users/login', user)
        .then(res => {
          //if successfull
          if (res.status === 200) {
            localStorage.setItem('token', res.data.token);
            const user = res.data.token
            this.setUserLogged(user);
            this.$router.push("/");
          }
        }, err => {
          console.log(err.response);
          this.error = err.response.data.error
        })
    }
  }
}
</script>