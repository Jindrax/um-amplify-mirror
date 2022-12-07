import {RouteRecordRaw} from 'vue-router';
import {Auth} from 'aws-amplify';
import {
    agenteDashboardDynamicRoute,
    dashboardRedirectionDynamicRoute,
    empresaDashboardDynamicRoute,
    loginDynamicRoute, notFoundDynamicRoute
} from "./dynamicRoutes";

export function getPermissionLevel(groups: string[]) {
    const groupSet = new Set(groups);
    if (groupSet.has("admins")) {
        return "admins";
    }
    if (groupSet.has("agentes")) {
        return "agentes";
    }
    if (groupSet.has("empresas")) {
        return "empresas";
    }
    return "NULL";
}

const routes: () => Promise<RouteRecordRaw[]> = async () => {
    const routesArray: RouteRecordRaw[] = [
        {
            name: "confirmation",
            path: '/confirmation',
            component: () => import('layouts/ConfirmationLayout.vue'),
        },
        {
            name: "checkout",
            path: '/checkout',
            component: () => import('layouts/CheckoutLayout.vue'),
        }
    ];
    try {
        const userData = await Auth.currentAuthenticatedUser();
        const groups = userData.signInUserSession.accessToken.payload["cognito:groups"];
        const permissionLevel = getPermissionLevel(groups);
        switch (permissionLevel) {
            case "admins":
            case "agentes":
                routesArray.push(agenteDashboardDynamicRoute);
                break;
            case "empresas":
                routesArray.push(empresaDashboardDynamicRoute);
                break;
            default:
                break;
        }
        routesArray.push(dashboardRedirectionDynamicRoute);
    } catch (e) {
        routesArray.push(loginDynamicRoute);
        return routesArray;
    } finally {
        // Always leave this as last one,
        // but you can also remove it
        routesArray.push(notFoundDynamicRoute);
    }
    return routesArray;
}

export default routes;
