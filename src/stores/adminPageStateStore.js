import {defineStore} from "pinia";

export const useAdminPageStateStore = defineStore("adminPageState", {
    state: () => ({
        // 관리자 페이지 메뉴
        menus: [
            {
                sequence: 1,
                title: "카페 관리",
                component: "CafeManage",
                icon: "mdi-coffee",
            },
            {
                sequence: 2,
                title: "회원 관리",
                component: "MemberManage",
                icon: "mdi-account",
            },
            {
                sequence: 3,
                title: "시스템 관리자 관리",
                component: "SystemAdminManage",
                icon: "mdi-security",
            },
            {
                sequence: 4,
                title: "게시글 관리",
                component: "feedManage",
                icon: "mdi-message",
            },
            {
                sequence: 5,
                title: "댓글 관리",
                component: "commentManage",
                icon: "mdi-comment",
            },
            {
                sequence: 6,
                title: "신고 관리",
                component: "reportManage",
                icon: "mdi-alert",
            },
            {
                sequence: 7,
                title: "통계",
                component: "statistics",
                icon: "mdi-chart-bar",
            },
        ],
        // 선택된 메뉴
        selectedMenu: {
            sequence: 1,
            title: "카페 관리",
            component: "CafeManage",
            icon: "mdi-coffee",
        },
    }),
    actions: {
        // 메뉴 선택
        selectMenu(menu) {
            this.selectedMenu = menu;
        },
    },
    getters: {
        // 선택된 메뉴
        getSelectedMenu(state) {
            return state.selectedMenu;
        },
        // 메뉴 비교
        isSameMenu(state) {
            return (menu) => state.selectedMenu === menu;
        },
    }
});