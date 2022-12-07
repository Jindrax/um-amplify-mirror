<template>
  <div class="row">
    <q-item class="col-auto" v-for="dia in Object.entries(days)">
      <q-item-section side>
        {{dia[1]}}
      </q-item-section>
      <q-item-section>
        {{formatDaySchedule(dia[0])}}
      </q-item-section>
    </q-item>
  </div>
</template>

<script lang="ts" setup>
import {Schedule, ScheduleDay} from "layer/Entidades/Schedule";
import {onMounted} from "vue";

const props = defineProps<{
  horario: Schedule
}>();

const days = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miercoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sabado",
  sunday: "Domingo"
}

function formatDaySchedule(day: string){
  const daySchedule = props.horario[day as keyof Schedule] as ScheduleDay;
  if(daySchedule.active){
    return daySchedule.shifts.map((shift)=>{
      return `${shift.from} - ${shift.to}`;
    }).join(", ");
  }else{
    return "No abierto";
  }
}

onMounted(()=>{
  console.log(props.horario);
})
</script>

<style lang="scss" scoped>

</style>
