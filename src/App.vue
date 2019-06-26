<template>
  
  <v-container class="contenedor">
    <NavBar  v-if="navbar"/>
    <router-view :class="{'container-main':navbar}"></router-view>
  </v-container>
</template>

<script>
import NavBar from '@/views/Navbar'
//import Inicio from '@/views/Inicio'
//import Cronometro from '@/views/Cronometro'
//import BuscarAlumno from '@/views/BuscarAlumno'
//import VistaGeneral from '@/views/VistaGeneral'

export default {
  name: 'App',
  components: {
   NavBar
  },
  data () {
    return {
      navbar:true
    }
  },
  created(){
    this.vistaNavbar();
  },
  methods:{
    vistaNavbar(){
      if (this.$route.path == '/login' || this.$route.path =='/vistaGeneral' ) {
        this.navbar = false;
      }else{
        this.navbar = true;
      }
    }
  },
  beforeUpdate(){
    this.vistaNavbar();
    
  },
  updated(){
    this.vistaNavbar();
  }
}
</script>

<style>
  .contenedor{
    padding: 0px;
    margin: 0;
    max-width: 100%;
  } 

  .container-main{
    margin-top: 60px;
  }
</style>


