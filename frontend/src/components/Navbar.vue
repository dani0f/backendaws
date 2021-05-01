<template>
    <nav>
        <v-navigation-drawer permanent dark app mini-variant class="red">
            <v-list tile>
                <v-list-item class="mb-8" router to="/">
                    <v-list-item-action>
                        <v-icon>fas fa-home</v-icon>
                    </v-list-item-action>
                </v-list-item>
                <v-list-item class="mb-8" router to="/import">
                    <v-list-item-action>
                        <v-icon>fas fa-file-import</v-icon>
                    </v-list-item-action>
                </v-list-item>
                <v-list-item class="mb-8" router to="/orders">
                    <v-list-item-action>
                        <v-icon>fas fa-database</v-icon>
                    </v-list-item-action>
                </v-list-item>
                <v-list-item class="mb-8" router to="/graphics">
                    <v-list-item-action>
                        <v-icon>fas fa-chart-line</v-icon>
                    </v-list-item-action>
                </v-list-item>
                <v-list-item class="mb-8" router to="/users">
                    <v-list-item-action>
                        <v-icon>fas fa-user</v-icon>
                    </v-list-item-action>
                </v-list-item>
                <v-list-item class="mb-8">
                    <v-list-item-action>
                        <button @click="logout"><v-icon>fas fa-sign-out-alt</v-icon></button>
                    </v-list-item-action>
                </v-list-item>
                
            </v-list>
        </v-navigation-drawer>
    </nav>
</template>

<script>
import Cookies from "js-cookie";
export default {
  methods: {
    deleteUserLogged() {
      Cookies.remove('userLogged');
    },
    logout() {
      localStorage.clear();
      this.deleteUserLogged()
      this.$router.push('/login');
    }
  }
}
</script>