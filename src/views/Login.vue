<template>
<v-app>
    <v-container fluid fill-height>
        <v-layout justify-center>
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-4">
                    <!-- <v-toolbar dark color="blue">
                        <v-toolbar-title>Login form</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar> -->
                    <v-card-title class="justify-center">
                        <h1>Sistema de Reserva de Laptops</h1>
                    </v-card-title>
                    <v-card-text>
                        <v-alert
                        v-model="alert"
                        dismissible
                        type="warning"
                        transition="scale-transition"
                        >
                        Usuario o contraseña inválido.
                        </v-alert>
                        <v-form>
                            <v-text-field name="username" label="Login" 
                                        type="text" required :append-icon="'person'" 
                                        v-model="username" :error-messages="nameErrors"
                                        :counter="10" @input="$v.name.$touch()"
                                        @blur="$v.name.$touch()">
                            </v-text-field>
                            <v-text-field name="password" label="Password" id="password" type="password" required :append-icon="'lock'" v-model="password"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                        <v-btn block class="white--text" color="blue" @click="ingresar" >Login</v-btn>
                    </v-card-actions>
                    <br>      
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</v-app>
</template>

<script>
import { mapMutations } from 'vuex';
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'

export default {
    name: "login",
    mixins: [validationMixin],
    validations: {
      name: { required, maxLength: maxLength(10) }
    },
    data(){
        return{
            usuario: "admin",
            clave: "123",
            alert: false,
            username: "",
            password: ""
        }
    },
    created(){
        //console.log(this.$route.path);
        
    },
    computed:{
        nameErrors () {
            const errors = []
            if (!this.$v.username.$dirty) return errors
            !this.$v.username.maxLength && errors.push('Name must be at most 10 characters long')
            !this.$v.username.required && errors.push('Name is required.')
            return errors
        },
    },
    methods:{
        ...mapMutations(['actualizarUsuario']),
        ingresar(){
            if (this.username == this.usuario && this.password == this.clave) {
                this.$router.push('/');
                let usuario = {
                    nombre: "Administrador",
                    username: this.usuario,
                }
                //this.$store.commit('actualizarUsuario', usuario);
                this.actualizarUsuario(usuario);
                //this.$store.dispatch('cerrarSesion');
                //console.log(this.$store.state.usuario);
                
            }else{
                this.alert = true;
            }
            
        }
    }
}
</script>




