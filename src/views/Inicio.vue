<template>
    <v-container grid-list-md text-xs-center>
    <v-layout row wrap>

      <v-flex v-for="laptop in laptops" :key="laptop.id" xs8 sm6 md4 lg3 xl2>
        <v-card :class="{'alerta': laptop.alerta}" > 
          <v-img
          class="gray--text"
          height="150px"
          src=""
          >
          <v-container fill-height fluid>
              <v-layout fill-height>
              <v-flex xs12 align-end flexbox>
                  <i class="fas fa-laptop iconoInicio"></i>
              </v-flex>
              </v-layout>
          </v-container>
          </v-img>
          <v-card-title>
            <v-container class="align-center">
              <h3 class="headline mb-0">{{laptop.nombre}}</h3>
              <BuscarAlumno v-if="laptop.estado=='Ocupado'" :id_laptop="laptop.id" @enviarReserva="recibirReserva($event,laptop)"/>
              <v-chip v-if="laptop.estado=='Disponible'" color="green" text-color="white">
                <i class="fas fa-user"></i>&nbsp;&nbsp;{{laptop.estado}}
              </v-chip>
              <v-chip v-else color="orange" text-color="white">
                <i class="fas fa-user-alt-slash"></i>&nbsp;&nbsp;{{laptop.estado}}
              </v-chip>
              <div v-if="laptop.estado=='Ocupado' && laptop.reserva">
                <Cronometro :horaRecibida="laptop.reserva.hora_ingreso" @alertaTiempo="alertaTiempo($event,laptop)"/>
              </div>      
            </v-container>
          </v-card-title>
          <v-card-actions>
            <v-container class="align-center">
              <v-btn color="red" @click="mostrarLiberar(laptop.nombre,laptop.reserva)" :disabled="laptopDisponible(laptop.estado)">Liberar</v-btn>
              <v-btn color="blue" @click="mostrarModal(laptop.nombre,laptop.id)" :disabled="!laptopDisponible(laptop.estado)">Reservar</v-btn>
            </v-container>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <DialogReserva :solicitudCodigo="estadoDialog" :nombre_laptop="nombre_laptop" :id_laptop="id_laptop" @cambiarEstado="cambiarEstadoReserva"/>
    <DialogLiberar :solicitudCodigo="estadoLiberar" :nombre_laptop="nombre_laptop" :reserva="reserva" @cambiarEstado="cambiarEstadoLiberar"/>
  </v-container>
    
</template>

<script>
import io from 'socket.io-client';
import axios from 'axios';
import Cronometro from '@/views/Cronometro';
import BuscarAlumno from '@/views/BuscarAlumno';
import DialogReserva from '@/views/DialogReserva';
import DialogLiberar from '@/views/DialogLiberar';

import {mapState} from 'vuex';
//import store from '@/store'

export default {
    name: 'inicio',
    components: {
      Cronometro,BuscarAlumno,DialogReserva,DialogLiberar
    },
    // beforeRouteEnter(to,from,next){
    //   if (store.state.usuario) {
    //     next()
    //   }else{
    //     next({name: 'login'})
    //   }
    // },
    data(){
      return{
        laptops: [],
        estadoAlerta: false,
        estadoDialog: false,
        estadoLiberar:false,
        nombre_laptop: '',
        id_laptop: '',
        reserva: '',
        socket: io('localhost:3001')
      }
    },
    computed: {
      ...mapState(['usuario'])
    },
    methods:{
      mostrarLaptops(){
        axios.get("http://localhost/apireserva/v1/laptops",
        {headers: { 'content-type': 'application/form-data' }})
        .then(response => {
            this.laptops = response.data;
            this.asignarAlerta();
            // eslint-disable-next-line 
            //console.log(this.laptops);
        })
        .catch(e => {
            this.errors.push(e);    
        })
      },
      recibirReserva(e,laptop){
        this.laptops.forEach(element => {
          if (element.id == laptop.id) {
            this.$set(element,'reserva',e);
            //console.log(this.laptops);
          }
        });
      },
      mostrarModal(nombre_laptop,id_laptop){
        this.estadoDialog = true;
        this.nombre_laptop = nombre_laptop;
        this.id_laptop = id_laptop;
      },
      mostrarLiberar(nombre_laptop,reserva){
        this.estadoLiberar = true;
        this.nombre_laptop = nombre_laptop;
        this.reserva = reserva;
        
      },
      cambiarEstadoReserva(e){
        if (e.id_laptop == "") {
          this.estadoDialog = e.estado;
        }else{
          this.estadoDialog=e.estado;
          this.estadoAlerta=true;
          this.socket.emit('ENVIAR_RESERVA',e);
        }
        
      },
      cambiarEstadoLiberar(e){
        if (e.id_laptop == "") {
          this.estadoLiberar = e.estado;
        }else{
          this.estadoLiberar=e.estado;
          this.socket.emit('LIBERAR_RESERVA', e);
        }   
      },
      laptopDisponible(estado){
        if (estado == "Ocupado") {
          return false;
        }else{
          return true;
        }
      },
      alertaTiempo(e,laptop){
        this.laptops.forEach(element => {
          //Pone atributo alerta a todas las laptops
          if (element.id == laptop.id) {
            element.alerta = e;
            //console.log(this.laptops);
          }
        });
      },
      asignarAlerta(){
        this.laptops.forEach(laptop =>{
          this.$set(laptop,'alerta',false);
        });
      }
  },
  mounted(){
    this.mostrarLaptops();
    
    this.socket.on('MENSAJE_RESERVA', (data) =>{
       this.laptops.map(function(laptop) {
         if (laptop.id == data.id_laptop) {
           laptop.estado = "Ocupado";
         }  
       });      
    });

    this.socket.on('MENSAJE_LIBERAR', (data) =>{
      this.laptops.map(function(laptop) {
        if (laptop.id == data.id_laptop) {
          laptop.estado = "Disponible";
          laptop.reserva = "";
          laptop.alerta = false; 
        }  
      });
    });   
  }
}
</script>

<style>
  .iconoInicio{
      font-size: 110px;
      color: #607D8B;
  }
  .alerta{
    background: #FF7474 !important;
    transition: background 0.8s linear 0.4s;
    /*animation-name: animar;
    animation-duration: 0.3s;
    animation-iteration-count: infinite;*/
  }

  /* @keyframes animar {
    0% {
      background: #fff;
    }

    50% {
      background: #FF7474;
    }

    100% {
      background: #fff;
    }
  } */

  
</style>


