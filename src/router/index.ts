import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/imp',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            // {
            //     path: '/dashboard',
            //     name: 'dashboard',
            //     meta: {
            //         title: '系统首页',
            //     },
            //     component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
            // },
            {
                path: '/imp',
                name: 'imp',
                meta: {
                    title: '影像中心',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/imp/imp.vue'),
            },
            {
                path: '/imp/:seriesId',
                name: '',
                meta: {
                    title: '影像详情',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/imp/series.vue'),
            },
            {
                path: '/dimension/bodypart',
                name: '',
                meta: {
                    title: '维度-身体部位',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/dimension/bodypart.vue'),
            },
            {
                path: '/dimension/organ',
                name: '',
                meta: {
                    title: '维度-器官',
                },
                component: () => import('../views/dimension/organ.vue'),
            },
            {
                path: '/dimension/scantype',
                name: '',
                meta: {
                    title: '维度-扫描类型',
                },
                component: () => import('../views/dimension/scantype.vue'),
            },
            {
                path: '/statistics',
                name: '',
                meta: {
                    title: '统计中心',
                },
                component: () => import('../views/empty.vue'),
            },
            {
                path: '/admin/user',
                name: '',
                meta: {
                    title: '用户管理',
                },
                component: () => import('../views/empty.vue'),
            },
            {
                path: '/admin/permissions',
                name: '',
                meta: {
                    title: '权限管理',
                },
                component: () => import('../views/empty.vue'),
            },
            // {
            //     path: '/table',
            //     name: 'basetable',
            //     meta: {
            //         title: '表格',
            //         permiss: '2',
            //     },
            //     component: () => import(/* webpackChunkName: "table" */ '../views/table.vue'),
            // },
            // {
            //     path: '/charts',
            //     name: 'basecharts',
            //     meta: {
            //         title: '图表',
            //         permiss: '11',
            //     },
            //     component: () => import(/* webpackChunkName: "charts" */ '../views/charts.vue'),
            // },
            // {
            //     path: '/form',
            //     name: 'baseform',
            //     meta: {
            //         title: '表单',
            //         permiss: '5',
            //     },
            //     component: () => import(/* webpackChunkName: "form" */ '../views/form.vue'),
            // },
            // {
            //     path: '/tabs',
            //     name: 'tabs',
            //     meta: {
            //         title: 'tab标签',
            //         permiss: '3',
            //     },
            //     component: () => import(/* webpackChunkName: "tabs" */ '../views/tabs.vue'),
            // },
            // {
            //     path: '/donate',
            //     name: 'donate',
            //     meta: {
            //         title: '鼓励作者',
            //         permiss: '14',
            //     },
            //     component: () => import(/* webpackChunkName: "donate" */ '../views/donate.vue'),
            // },
            {
                path: '/permission',
                name: 'permission',
                meta: {
                    title: '权限管理',
                    permiss: '13',
                },
                component: () => import(/* webpackChunkName: "permission" */ '../views/permission.vue'),
            },
            {
                path: '/upload',
                name: 'upload',
                meta: {
                    title: '上传插件',
                    permiss: '6',
                },
                component: () => import(/* webpackChunkName: "upload" */ '../views/upload.vue'),
            },
            {
                path: '/icon',
                name: 'icon',
                meta: {
                    title: '自定义图标',
                    permiss: '10',
                },
                component: () => import(/* webpackChunkName: "icon" */ '../views/icon.vue'),
            },
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心',
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/user.vue'),
            },
            {
                path: '/editor',
                name: 'editor',
                meta: {
                    title: '富文本编辑器',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "editor" */ '../views/editor.vue'),
            },
            {
                path: '/markdown',
                name: 'markdown',
                meta: {
                    title: 'markdown编辑器',
                    permiss: '9',
                },
                component: () => import(/* webpackChunkName: "markdown" */ '../views/markdown.vue'),
            },
            {
                path: '/export',
                name: 'export',
                meta: {
                    title: '导出Excel',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "export" */ '../views/export.vue'),
            },
            {
                path: '/import',
                name: 'import',
                meta: {
                    title: '导入Excel',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/import.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    const permiss = usePermissStore();
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
        // 如果没有权限，则进入403
        next('/403');
    } else {
        next();
    }
});

export default router;
