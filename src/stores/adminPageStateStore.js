import {defineStore} from "pinia";

export const useAdminPageStateStore = defineStore("adminPageState", {
    state: () => ({
        // 관리자 페이지 메뉴
        menus: [
            {
                sequence: 1,
                title: "카페관리",
                icon: "mdi-coffee",
            },
            {
                sequence: 2,
                title: "회원관리",
                icon: "mdi-account",
            },
            {
                sequence: 3,
                title: "게시글관리",
                icon: "mdi-message",
            },
            {
                sequence: 4,
                title: "댓글관리",
                icon: "mdi-comment",
            },
            {
                sequence: 5,
                title: "신고관리",
                icon: "mdi-alert",
            },
            {
                sequence: 6,
                title: "통계",
                icon: "mdi-chart-bar",
            },
        ],
        // 선택된 메뉴
        selectedMenu: "카페관리",
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