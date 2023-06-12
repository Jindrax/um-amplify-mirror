import {defineStore} from 'pinia';
import {CognitoUser} from '@aws-amplify/auth';
import {RouteRecordRaw, useRouter} from "vue-router";
import {getPermissionLevel} from "../router/routes";
import {
    adminDashboardDynamicRoute,
    agenteDashboardDynamicRoute,
    empresaDashboardDynamicRoute,
    loginDynamicRoute
} from "../router/dynamicRoutes";

interface UserInfo {
    nombres: string,
    apellidos: string,
    email: string,
    sub: string
}

export const useSessionStore = defineStore('session', {
    state: () => ({
        user: undefined as CognitoUser | undefined,
        userInfo: {} as UserInfo,
        routes: {} as RouteRecordRaw
    }),
    getters: {
        firstName: (state) => {
            return state.userInfo.nombres.split(' ')[0];
        },
        lastName: (state) => {
            return state.userInfo.apellidos.split(' ')[0];
        },
        isAdmin: (state) => {
            if (state.user) {
                //@ts-ignore
                return state.user!.signInUserSession!.idToken.payload["cognito:groups"].includes("admins");
            } else {
                return false;
            }
        },
        validatePerms: (state) => {
            return (perm: string) => {
                if (state.user) {
                    if (state.user) {
                        //@ts-ignore
                        return state.user!.signInUserSession!.idToken.payload["cognito:groups"].includes(perm);
                    } else {
                        return false;
                    }
                }
            }
        }
    },
    actions: {
        async login(user: CognitoUser) {
            this.user = user;
            const userL = user as any;
            this.userInfo = {
                nombres: userL.attributes["custom:nombres"],
                apellidos: userL.attributes["custom:apellidos"],
                email: userL.attributes["email"],
                sub: userL.attributes["sub"]
            };
            // @ts-ignore
            this.router.removeRoute("login");
            // @ts-ignore
            const groups = this.user.signInUserSession.accessToken.payload["cognito:groups"];
            const permissionLevel = getPermissionLevel(groups);
            switch (permissionLevel) {
                case "admins":
                    // @ts-ignore
                    this.router.addRoute(adminDashboardDynamicRoute);
                    this.routes = adminDashboardDynamicRoute;
                    break;
                case "agentes":
                    // @ts-ignore
                    this.router.addRoute(agenteDashboardDynamicRoute);
                    this.routes = agenteDashboardDynamicRoute;
                    break;
                case "empresas":
                    // @ts-ignore
                    this.router.addRoute(empresaDashboardDynamicRoute);
                    this.routes = empresaDashboardDynamicRoute;
                    break;
                default:
                    break;
            }
            // @ts-ignore
            this.router.push("/dashboard/inicio");
        },
        logout() {
            // @ts-ignore
            this.user = undefined;
            this.userInfo = {
                nombres: "",
                apellidos: "",
                email: "",
                sub: ""
            };
            // @ts-ignore
            this.router.removeRoute("dashboard");
            // @ts-ignore
            this.router.removeRoute("dashboardRedirection");
            // @ts-ignore
            this.router.removeRoute("notFound");
            // @ts-ignore
            this.router.addRoute(loginDynamicRoute);
            // @ts-ignore
            this.router.push("/");
        }
    },
    persist: true
});
