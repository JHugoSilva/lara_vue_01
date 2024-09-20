import { createRouter, createWebHistory } from "vue-router";
import Index from "../components/products/index.vue";
import NotFound from "../components/NotFound.vue";
import Form from "../components/products/Form.vue";

const routes = [
    {
        path: "/",
        name: "products.index",
        component: Index,
    },
    {
        path: "/products/create",
        name: "products.new",
        component: Form,
    },
    {
        path: "/products/:id/edit",
        name: "products.edit",
        component: Form,
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notFound",
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
