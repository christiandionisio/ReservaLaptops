<template>
    <v-chip color="indigo" text-color="white">
        <i class="far fa-clock"></i>&nbsp;&nbsp;{{this.horas}}:{{this.minutos}}:{{this.segundos}}
    </v-chip>
</template>

<script>
export default {
    name: 'cronometro',
    props:['horaRecibida'],
    data(){
        return{
            segundos: '00',
            minutos: '00',
            horas: '00'
        }
    },
    created(){
        var v = this;
        const second = 1000,
        minute = second * 60,
        hour = minute * 60;

        let horaSalida = new Date(Date.parse( new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate() + " " + this.horaRecibida));        
        
        horaSalida.setHours(horaSalida.getHours()+2);
        horaSalida = horaSalida.getTime();
        // eslint-disable-next-line

        if (horaSalida > new Date().getTime()) {
            let x = setInterval(function() {
                let now = new Date().getTime();
                let distance = horaSalida - now;
                v.horas = '0' + Math.floor((distance) / (hour));
                
                
                v.minutos = Math.floor((distance % (hour)) / (minute));

                if (v.minutos <10) {
                    v.minutos = '0' + Math.floor((distance % (hour)) / (minute));
                }

                v.segundos = Math.floor((distance % (minute)) / (second));

                if (v.segundos < 10) {
                    v.segundos = '0' + Math.floor((distance % (minute)) / (second));
                }

                if (v.horas==0 && v.minutos==0 && v.segundos==0) {
                    clearInterval(x);
                } 
                           
            }, second)   
        }

    }
}
</script>

