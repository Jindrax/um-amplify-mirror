<template>
  <q-dialog v-model="props.show" full-width full-height>
    <q-dialog v-model="multipleEditDialog">
      <q-card>
        <q-card-section class="bg-black text-white">
          <q-item-label class="text-h6">Edición multiple para el turno {{ multipleEditShift + 1 }}</q-item-label>
        </q-card-section>
        <q-card-section>
          <q-option-group
              v-model="multipleEditSelection"
              :options="Object.entries(days).map((day)=>{return {label: day[1], value:day[0]}})"
              type="checkbox"
              inline
          />
          <q-item class="q-pa-none q-ma-none">
            <q-item-section>
              <q-input v-model="multipleEditFrom" class="col" filled mask="##:##" label="Desde">
                <template v-slot:append>
                  <q-icon class="cursor-pointer" name="access_time">
                    <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                      <q-time v-model="multipleEditFrom" :format24h="false">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup color="primary" flat label="Cerrar"/>
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item-section>
            <q-item-section>
              <q-input v-model="multipleEditTo" class="col" filled mask="##:##" label="Hasta">
                <template v-slot:append>
                  <q-icon class="cursor-pointer" name="access_time">
                    <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                      <q-time v-model="multipleEditTo" :format24h="false">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup color="primary" flat label="Cerrar"/>
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-section>
          <div class="row q-gutter-x-sm">
            <q-btn label="Cancelar" class="revert-btn col" @click="multipleEditDialog = false"/>
            <q-btn label="Guardar" class="advance-btn col" @click="consolidateMultipleEdit"/>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-card>
      <q-card-section>
        <q-markup-table>
          <thead>
          <tr>
            <th>Dia</th>
            <th>Activo</th>
            <th v-for="(shift, shiftIndex) in activeShifts" :key="`scheduleShiftColumn-${shift}`">
              <div class="column">
                <q-item-label>Turno {{ shift }}</q-item-label>
                <q-btn dense size="md" label="Edición Multiple" class="advance-btn"
                       @click="showMultipleEditDialog(shiftIndex)"/>
              </div>
            </th>
            <th>
              <div class="column">
                <q-item-label>Turno {{ activeShifts + 1 }}</q-item-label>
                <q-btn icon="add" class="col advance-btn" @click="addShift"/>
              </div>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="day in Object.entries(days)" :key="`dayRow-${day[0]}}`">
            <td>
              <q-item-label>{{ day[1] }}</q-item-label>
            </td>
            <td>
              <q-toggle v-model="horario[day[0]].active"/>
            </td>
            <td v-for="(shift, shiftIndex) in activeShifts" :key="`scheduleShift-${shift}`">
              <q-item>
                <q-item-section>
                  <q-input v-model="horario[day[0]].shifts[shiftIndex].from" class="col" filled mask="##:##"
                           :disable="!horario[day[0]].active" label="Desde">
                    <template v-slot:append>
                      <q-icon class="cursor-pointer" name="access_time">
                        <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                          <q-time v-model="horario[day[0]].shifts[shiftIndex].from" :format24h="false">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup color="primary" flat label="Cerrar"/>
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
                <q-item-section>
                  <q-input v-model="horario[day[0]].shifts[shiftIndex].to" class="col" filled mask="##:##"
                           :disable="!horario[day[0]].active" label="Hasta">
                    <template v-slot:append>
                      <q-icon class="cursor-pointer" name="access_time">
                        <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                          <q-time v-model="horario[day[0]].shifts[shiftIndex].to" :format24h="false">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup color="primary" flat label="Cerrar"/>
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
            </td>
          </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
      <q-card-actions class="row">
        <q-btn label="Cancelar" class="col revert-btn" @click="cancel"/>
        <q-btn label="Guardar" class="col advance-btn" @click="save"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {Schedule, ScheduleDay, Shift} from "layer/Entidades/Schedule";

const props = defineProps<{
  show: boolean,
  horario: Schedule
}>();

const emits = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'update:horario', value: any): void
}>();

const time = ref("");

const days = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miercoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sabado",
  sunday: "Domingo"
}

const activeShifts = ref(0);
const multipleEditDialog = ref(false);
const multipleEditShift = ref(0);
const multipleEditSelection = ref([]);
const multipleEditFrom = ref("");
const multipleEditTo = ref("");

onMounted(() => {
  let minShifts = 1;
  for (let day in props.horario) {
    const maxShiftInDay = props.horario[day as keyof Schedule].shifts.length;
    if (maxShiftInDay > minShifts) {
      minShifts = maxShiftInDay;
    }
  }
  activeShifts.value = minShifts;
});

function showMultipleEditDialog(shift: number) {
  multipleEditShift.value = shift;
  multipleEditDialog.value = true;
}

function consolidateMultipleEdit() {
  multipleEditSelection.value.forEach((multipleEditDaySelection: string) => {
    console.log(multipleEditDaySelection);
    console.log(props.horario[multipleEditDaySelection as keyof Schedule]);
    props.horario[multipleEditDaySelection as keyof Schedule].active = true;
    props.horario[multipleEditDaySelection as keyof Schedule].shifts[multipleEditShift.value].from = multipleEditFrom.value;
    props.horario[multipleEditDaySelection as keyof Schedule].shifts[multipleEditShift.value].to = multipleEditTo.value;
  });
  multipleEditShift.value = 0;
  multipleEditSelection.value = [];
  multipleEditFrom.value = "";
  multipleEditTo.value = "";
  multipleEditDialog.value = false;
}

function addShift() {
  Object.values(props.horario).forEach((day: ScheduleDay) => {
    day.shifts.push(new Shift({}));
  });
  activeShifts.value += 1;
}

function cancel() {
  emits('update:show', false);
}

function save() {
  emits('update:show', false);
}
</script>

<style lang="scss" scoped>
span {
  font-size: 2vh;
}
</style>
