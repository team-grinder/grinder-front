import { defineStore } from "pinia";

export const useAdminPageStateStore = defineStore("adminPageState", {
    state: () => ({
        // 관리자 페이지 메뉴
        menus: [
            { sequence: 1,  title: "카페 관리",  component: "CafeManage",  icon: "mdi-coffee" },
            { sequence: 2,  title: "회원 관리",  component: "MemberManage",  icon: "mdi-account" },
            { sequence: 3,  title: "시스템 관리자 관리",  component: "SystemAdminManage",  icon: "mdi-security" },
            { sequence: 4,  title: "게시글 관리",  component: "feedManage",  icon: "mdi-message" },
            { sequence: 5,  title: "댓글 관리",  component: "commentManage",  icon: "mdi-comment" },
            { sequence: 6,  title: "신고 관리",  component: "reportManage",  icon: "mdi-alert" },
            { sequence: 7,  title: "통계",  component: "statistics",  icon: "mdi-chart-bar" },
        ],
        // 선택된 메뉴
        selectedMenu: { sequence: 1,  title: "카페 관리",  component: "CafeManage",  icon: "mdi-coffee" },
        // 각 관리 페이지별 공통 헤더 정의
        headers: {
            systemAdmin: [
                { key: "email", title: "관리자 이메일", align: "center", sortable: false, class: "vertical-mid" },
                { key: "nickname", title: "관리자 닉네임", align: "center", sortable: false, class: "vertical-mid" },
                { key: "createDate", title: "생성일", align: "center", sortable: false, class: "vertical-mid" },
                { key: "actions", title: "수정 / 삭제", align: "center", sortable: false, class: "vertical-mid" },
            ],
            cafe: [
                { key: "name", title: "카페 이름", align: "center", sortable: false, class: "vertical-mid" },
                { key: "description", title: "카페 설명", align: "center", sortable: false, class: "vertical-mid" },
                { key: "address", title: "카페 주소", align: "center", sortable: false, class: "vertical-mid" },
                { key: "registrationDate", title: "등록일", align: "center", sortable: false, class: "vertical-mid" },
                { key: "actions", title: "수정 / 삭제", align: "center", sortable: false, class: "vertical-mid" },
            ],
            member: [
                { key: "email", title: "이메일", align: "center", sortable: false },
                { key: "phoneNumber", title: "전화번호", align: "center", sortable: false },
                { key: "nickname", title: "닉네임", align: "center", sortable: false },
                { key: "loginType", title: "로그인 방식", align: "center", sortable: false },
                { key: "TierType", title: "회원 등급", align: "center", sortable: false },
                { key: "cafeAdmin.cafeName", title: "카페 관리자 여부", align: "center", sortable: false },
                { key: "isDeleted", title: "탈퇴 여부", align: "center", sortable: false },
                { key: "registrationDate", title: "가입일", align: "center", sortable: false },
                { key: "actions", title: "수정/ 삭제", align: "center", sortable: false },
            ],
        },
        // 각 관리 페이지별 공통 검색 옵션 정의
        options: {
            systemAdmin: [
                { value: "email", title: "이메일" },
                { value: "nickname", title: "닉네임" },
            ],
            cafe: [
                { value: "name", title: "카페명" },
                { value: "address", title: "주소" },
            ],
            member: [
                { value: "email", title: "이메일" },
                { value: "phoneNumber", title: "전화번호" },
                { value: "nickname", title: "닉네임" },
                { value: "loginType", title: "로그인 방식" },
                { value: "TierType", title: "회원 등급" },
                { value: "CafeAdmin", title: "카페 관리자 여부" },
                { value: "isDeleted", title: "탈퇴 여부" },
            ],
        },
        // 개수 선택 옵션
        itemsPerPageOptions: [
            {value: 2, title: '2'},
            {value: 10, title: '10'},
            {value: 25, title: '25'},
            {value: 50, title: '50'},
        ]
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
        // 페이지 종류에 따라 헤더를 반환합니다.
        getHeaders(state) {
            return (type) => state.headers[type] || [];
        },
        // 페이지 종류에 따라 옵션을 반환합니다.
        getOptions(state) {
            return (type) => state.options[type] || [];
        },
        // 개수 선택 옵션을 반환합니다.
        getItemsPerPageOptions(state) {
            return state.itemsPerPageOptions;
        }
    }
});