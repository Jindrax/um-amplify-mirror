<template>
  <q-page class="column items-start justify-start">
    <q-card>
      <q-card-section>
        <q-btn label="Crear Categoria" @click="createCategoria"></q-btn>
        <q-btn label="Actualizar Empresas" @click="updateLocations"></q-btn>
      </q-card-section>
      <q-card-section>
        <q-btn label="Solicitar actualizacion de Categorias" @click="updateCategories"></q-btn>
      </q-card-section>
      <q-card-section>
        <q-btn label="Poblar departamentos" @click="poblarDepartamentos"></q-btn>
        <q-btn label="Poblar municipios" @click="poblarMunicipios"></q-btn>
      </q-card-section>
      <q-card-section>
        <q-btn label="Corregir Imagenes" @click="corregirImagenes"></q-btn>
      </q-card-section>
      <q-card-section>
        <q-input v-model="user" label="Usuario"/>
        <q-btn label="Reenviar codigo de verificación" @click="resendVerification"></q-btn>
      </q-card-section>
      <q-card-section>
        <q-btn label="Print User" @click="printUser"></q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import {uid} from "quasar";
import {API, Auth} from "aws-amplify";
import axios from "axios";
import UnidadAdmin from "layer/Entidades/UnidadAdmin";
import Ciudad from "layer/Entidades/Ciudad";
import {ref} from "vue";
import {useSessionStore} from "stores/session-store";

const user = ref("");

const createCategoria = async () => {
  // try {
  //   const categoria: CreateCategoryInput = {
  //     id: uid(),
  //     name: "Centro Medico",
  //     description: "Servicios medicos privados",
  //     attributes: new AttributeHandler()
  //       .addAttribute("WIFI", "wifi")
  //       .addAttribute("Baño", "toilet")
  //       .addAttribute("Pet-Friendly", "dog-service")
  //       .addAttribute("Hospitalización", "dog-service")
  //       .getJSONString()
  //   };
  //   await API.graphql({
  //     query: createCategory, variables: {
  //       input: categoria
  //     }
  //   });
  // } catch (e) {
  //   console.log(e);
  // }
}

const updateCategories = async () => {
  // await useCategoryStore().categoriesRequestUpdate();
};

const updateLocations = async () => {
  // try {
  //   const locations: { data: ListLocationsQuery } = (await API.graphql(
  //     {
  //       query: listLocations
  //     }
  //   ) as { data: ListLocationsQuery });
  //   const promises = locations.data.listLocations?.items.map(location => {
  //     return async () => {
  //       const paid = moment().add(5, "years");
  //       const input: UpdateLocationInput = {
  //         hashKey: location!.hashKey,
  //         rangeKey: location!.rangeKey,
  //         categoryLocationsId: "2bb724fb-ed63-442d-9dcd-6fd0c021aba6"
  //       };
  //       await API.graphql({
  //         query: updateLocation,
  //         variables: {input}
  //       });
  //     }
  //   });
  //   for (let promise of promises!) {
  //     console.log(await promise());
  //   }
  // } catch (e) {
  //   console.log(e);
  // }
}

const poblarDepartamentos = async () => {
  try {
    const deptCatalogados: { [key: string]: any[] } = {};
    const data = await axios.get("https://www.datos.gov.co/resource/xdk5-pm3f.json");
    for (const datum of data.data) {
      if (deptCatalogados[datum.departamento]) {
        deptCatalogados[datum.departamento].push(datum);
      } else {
        deptCatalogados[datum.departamento] = [];
        deptCatalogados[datum.departamento].push(datum);
      }
    }
    for (const departamento in deptCatalogados) {
      const deptoID = uid();
      const unidadAdmin = new UnidadAdmin({id: deptoID, nombre: departamento});
      await API.post("umapi", "/unidadesadmin", {
        body: unidadAdmin
      });
      console.log(`Departamento ${departamento} creado correctamente`);
      for (const ciudad of deptCatalogados[departamento]) {
        const ciudadObj = new Ciudad({
          id: uid(),
          nombre: ciudad.municipio,
          unidadadminstr: departamento,
          significativo: false,
          unidadadmin: deptoID
        });
        await API.post("umapi", "/ciudades", {
          body: ciudadObj
        });
        console.log(`Ciudad ${ciudad.municipio} creada correctamente`);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

const poblarMunicipios = async () => {

}

const corregirImagenes = async () => {
  try {
    const locaciones = await API.get("umapi", "/locaciones", {});
    for (const locacion of locaciones) {
      const carpetaCorregida: any[] = [];
      const imagenData = locacion.carpetaimagenes["LQ"];
      let link = imagenData.substring(0, imagenData.lastIndexOf('/'));
      link = link.substring(0, link.lastIndexOf('/'));
      for (let i = 0; i < 10; i++) {
        const correccion: { [key: string]: any } = {};
        correccion["HQ"] = link + `/${i}` + "/HQ.jpeg";
        correccion["MQ"] = link + `/${i}` + "/MQ.jpeg";
        correccion["LQ"] = link + `/${i}` + "/LQ.jpeg";
        carpetaCorregida.push(correccion);
      }
      // locacion.carpetaimagenes.map((imagen: any) => {
      //   const keys = Object.keys(imagen);
      //   keys.forEach((key: any) => {
      //     switch (key) {
      //       case '1080X':
      //         correccion["HQ"] = link + "/HQ.jpeg";
      //         break;
      //       case '720X':
      //         correccion["MQ"] = link + "/MQ.jpeg";
      //         break;
      //       case '144X':
      //         correccion["LQ"] = link + "/LQ.jpeg";
      //         break;
      //     }
      //   });
      //   carpetaCorregida.push(correccion);
      // });
      const updatedEditable = await API.post("umapi", "/locaciones/images", {
        body: {
          id: locacion.id,
          carpetaimagenes: JSON.stringify(carpetaCorregida)
        }
      });
      console.log(updatedEditable);
    }
  } catch (e) {
    console.log(e);
  }
}

async function resendVerification() {
  try {
    const response = await Auth.resendSignUp(user.value);
    console.log(response);
  } catch (e) {
    console.log(e);
  }
}

async function printUser(){
  try {
    console.log(useSessionStore().user);
  } catch (e) {
    console.log(e);
  } finally {

  }
}

</script>
