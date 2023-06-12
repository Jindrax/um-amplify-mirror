import {RouteRecordRaw} from "vue-router";


export const adminDashboardDynamicRoute: RouteRecordRaw = {
    name: "dashboard",
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
        {
            path: 'Inicio',
            component: () => import('pages/Agente/Inicio.vue'),
            meta: {itemLink: "Inicio", to: "/dashboard/Inicio"}
        },
        {
            path: 'Atributos',
            component: () => import('pages/Atributos.vue'),
            meta: {itemLink: "Atributos", to: "/dashboard/Atributos"}
        },
        {
            path: 'Empresas',
            component: () => import('pages/Agente/Empresas/AgenteEmpresas.vue'),
            meta: {itemLink: "Empresas", to: "/dashboard/Empresas"},
            name: "Empresas",
            children: [
                {
                    path: '',
                    component: () => import('pages/Agente/Empresas/AgenteEmpresasIndice.vue'),
                    name: 'EmpresaIndice'
                },
                {
                    path: 'Nueva_Empresa',
                    component: () => import('pages/Agente/Empresas/AgenteEmpresasNueva.vue'),
                    name: 'EmpresaNueva'
                },
                {
                    path: 'Editar_Empresa',
                    component: () => import('pages/Agente/Empresas/AgenteEmpresasEditar.vue'),
                    name: 'EmpresaEditar'
                },
            ]
        },
        {
            path: 'Finanzas',
            component: () => import('pages/Inicio.vue'),
            meta: {itemLink: "Finanzas", to: "/dashboard/Finanzas"}
        },
        {
            path: 'Perfil',
            component: () => import('pages/Inicio.vue'),
            meta: {itemLink: "Perfil", to: "/dashboard/Perfil"}
        },
        {
            path: 'Agentes',
            component: () => import('pages/Agente/Agentes/AgenteAgentes.vue'),
            meta: {itemLink: "Agentes", to: "/dashboard/Agentes"},
            children: [
                {
                    path: '',
                    component: () => import('pages/Agente/Agentes/AgenteAgentesIndice.vue'),
                    name: 'AgenteIndice'
                },
                {
                    path: 'Nuevo_Agente',
                    component: () => import('pages/Agente/Agentes/AgenteAgentesNuevo.vue'),
                    name: 'AgenteNuevo'
                },
                {
                    path: 'Editar_Agente',
                    component: () => import('components/EditAgenteComponent.vue'),
                    name: 'AgenteEditar'
                },
            ]
        },
        {
            path: 'Test',
            component: () => import('pages/Test.vue'),
            meta: {itemLink: "Test", to: "/dashboard/Test"}
        },
        {
            path: 'Propuestas',
            component: () => import('pages/Agente/Propuestas/AgentePropuesta.vue'),
            meta: {itemLink: "Propuestas", to: "/dashboard/Propuestas"}
        },
    ],
};

export const agenteDashboardDynamicRoute: RouteRecordRaw = {
    name: "dashboard",
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
        {
            path: 'Inicio',
            component: () => import('pages/Agente/Inicio.vue'),
            meta: {itemLink: "Inicio", to: "/dashboard/Inicio"}
        },
        {
            path: 'Empresas',
            component: () => import('pages/Agente/Empresas/AgenteEmpresas.vue'),
            meta: {itemLink: "Empresas", to: "/dashboard/Empresas"},
            name: "Empresas",
            children: [
                {
                    path: '',
                    component: () => import('pages/Agente/Empresas/AgenteEmpresasIndice.vue'),
                    name: 'EmpresaIndice'
                },
                {
                    path: 'Nueva_Empresa',
                    component: () => import('pages/Agente/Empresas/AgenteEmpresasNueva.vue'),
                    name: 'EmpresaNueva'
                },
                {
                    path: 'Editar_Empresa',
                    component: () => import('pages/Agente/Empresas/AgenteEmpresasEditar.vue'),
                    name: 'EmpresaEditar'
                },
            ]
        },
        {
            path: 'Finanzas',
            component: () => import('pages/Agente/Finanzas/Finanzas.vue'),
            meta: {itemLink: "Finanzas", to: "/dashboard/Finanzas"}
        }
    ],
};

export const empresaDashboardDynamicRoute: RouteRecordRaw = {
    name: "dashboard",
    path: '/dashboard',
    component: () => import('layouts/EmpresaLayout.vue'),
    children: [
        {
            path: 'Inicio',
            component: () => import('pages/Empresa/Inicio.vue'),
            meta: {itemLink: "Inicio", to: "/dashboard/Inicio"}
        },
        {
            path: 'Locaciones',
            component: () => import('pages/Empresa/Locaciones.vue'),
            name: "Locaciones",
            meta: {itemLink: "Locaciones", to: "/dashboard/Locaciones"}
        },
        //{
        //    name: "EditarLocacion",
        //    path: 'Locaciones/Editar',
        //    component: () => import('components/Empresa/EditLocacion.vue')
        //},
        //{path: 'Mensajeria', component: () => import('pages/Empresa/Mensajeria.vue')},
        //{path: 'Mensajeria/:locacionId', component: () => import('components/Empresa/LocacionChatView.vue')},
        {
            path: 'Finanzas',
            component: () => import('pages/Empresa/Pagos.vue'),
            meta: {itemLink: "Finanzas", to: "/dashboard/Finanzas"}
        },
        //{path: 'Perfil', component: () => import('pages/Empresa/Perfil.vue')}
    ],
};

export const dashboardRedirectionDynamicRoute: RouteRecordRaw = {
    name: "dashboardRedirection",
    path: "/",
    redirect: "/dashboard/inicio"
};

export const loginDynamicRoute: RouteRecordRaw = {
    name: "login",
    path: '/:catchAll(.*)*',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{path: '', component: () => import('pages/Login.vue')}]
};

export const notFoundDynamicRoute: RouteRecordRaw = {
    name: "notFound",
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
};