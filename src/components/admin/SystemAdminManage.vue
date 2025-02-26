<template>
  <v-container class="pa-4">
    <!-- 검색 입력-->
    <SearchBox
        class="mb-10"
        :options="options"
        @search-data="searchData"/>

    <v-row class="pa-3 d-flex justify-center align-center">
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-select
            v-model="itemPerPage"
            :items="items_per_page_options"
            label="페이지 당 아이템 수"
            density="compact"
            variant="outlined"
            hide-details
            width="200"
            @update:modelValue="changeItemsPerPage"
        ></v-select>
      </v-col>
      <v-btn size="large" variant="tonal" prepend-icon="mdi-security" @click="popupCreateSystemAdmin">
        관리자 생성
      </v-btn>
    </v-row>

    <!-- 관리자 리스트 -->
    <v-data-table
        :headers="headers"
        no-data-text="데이터가 없습니다."
        :items="serverItems"
        :loading="loading"
        :total-items="totalItems"
        :items-per-page="itemPerPage"
        :items-per-page-options="items_per_page_options"
        :server-items-length="totalItems"
        :page="currentPage"
        hover
        hide-default-footer
        disable-sort
        item-key="id"
    >

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="popupModifySystemAdmin(item.id)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="popupDeleteSystemAdmin(item)">
          mdi-delete
        </v-icon>
      </template>

      <template v-slot:bottom>
        <v-row>
          <v-col cols="12">
            <v-pagination
                v-model="currentPage"
                :length="pageCount"
                @update:modelValue="onPageChange($event)"
            ></v-pagination>
          </v-col>
        </v-row>
      </template>
    </v-data-table>

    <!-- 삭제 여부 팝업 -->
    <v-dialog v-model="dialogDelete" max-width="400">
      <v-card>
        <v-card-title class="headline">
          삭제 확인
        </v-card-title>
        <v-card-text>
          선택한 관리자를 삭제하시겠습니까?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" @click="dialogDelete = false">
            취소
          </v-btn>
          <v-btn color="red darken-1" @click="deleteSystemAdmin(selectedSystemAdmin.id)">
            삭제
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 관리자 생성/수정 모달 다이얼로그 -->
    <v-dialog v-model="dialog" max-width="1000px">
      <v-card>
        <v-card-title>
          {{ selectedSystemAdmin.id ? '관리자 정보 수정' : '관리자 생성' }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedSystemAdmin.email"
                  label="관리자 이메일"
                  variant="underlined" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedSystemAdmin.password"
                  :type="visible ? 'text' : 'password'"
                  label="관리자 비밀번호"
                  variant="underlined">
                <template v-slot:append>
                  <v-icon @click="visible = !visible">
                    {{ visible ? 'mdi-eye-off' : 'mdi-eye' }}
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedSystemAdmin.nickname"
                  label="관리자 닉네임"
                  variant="underlined" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-btn color="primary" size="large" variant="tonal" @click="saveSystemAdmin">
            저장
          </v-btn>
          <v-btn color="red-lighten-4" size="large" variant="tonal" @click="dialog = false">
            닫기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import SearchBox from "@/components/admin/SearchBox";
import { useAdminPageStateStore } from "@/stores/adminPageStateStore";

export default {
  name: "SystemAdminManage",
  components: {
    SearchBox,
  },
  data() {
    return {
      // 검색 옵션
      options: useAdminPageStateStore().getOptions("systemAdmin"),
      headers: useAdminPageStateStore().getHeaders("systemAdmin"),
      items_per_page_options: useAdminPageStateStore().getItemsPerPageOptions,
      // 검색어
      search: "",
      managerList: [],
      // 로딩 상태
      loading: false,
      pagination: {},
      page: 1,
      pageSize: 5,
      // 페이지네이션 관련: 현재 페이지 및 페이지당 아이템 수
      currentPage: 1,
      itemPerPage: 2,
      serverItems: [],
      totalItems: 0,
      // 모달 다이얼로그 관련
      dialogDelete: false,
      dialog: false,
      visible: false,
      selectedSystemAdmin: {
        id: null,
        email: "",
        nickname: "",
      },
      // 실제 데이터 (Fake API용)
      admins: [
        { id: 1, email: "admin@admin.com", nickname: "관리자1", createDate: "2021-10-01" },
        { id: 2, email: "admin1@admin.com", nickname: "관리자2", createDate: "2021-10-02" },
        { id: 3, email: "admin2@admin.com", nickname: "관리자3", createDate: "2021-10-03" },
        { id: 4, email: "admin3@admin.com", nickname: "관리자4", createDate: "2021-10-04" },
        { id: 5, email: "admin4@admin.com", nickname: "관리자5", createDate: "2021-10-05" },
        { id: 6, email: "admin5@admin.com", nickname: "관리자6", createDate: "2021-10-06" },
      ],
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.totalItems / this.itemPerPage);
    },
  },
  methods: {
    popupDeleteSystemAdmin(item) {
      this.selectedSystemAdmin = item;
      this.dialogDelete = true;
    },
    deleteSystemAdmin(id) {
      const index = this.admins.findIndex((admin) => admin.id === id);
      if (index !== -1) {
        this.admins.splice(index, 1);
        console.log(this.admins)
      }
      this.dialogDelete = false;

      this.loadItems();
    },
    async loadItems(param) {
      this.loading = true;
      const page = this.currentPage;
      const itemsPerPage = this.itemPerPage;
      this.search = param ? param.searchQuery : this.search;

      // 검색어로 필터링
      let filtered = this.admins.filter((admin) =>
          admin.email.includes(this.search)
      );
      // axios 예시
      // const response = await $axios.get("/admin/cafe/search", { param });

      const total = filtered.length;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const items = filtered.slice(start, end);

      // API 호출을 흉내내기 위해 500ms 딜레이 후 결과 반환
      setTimeout(() => {
        this.serverItems = items;
        this.totalItems = total;
        this.loading = false;
      }, 500);
    },
    /**
     * 검색어 변경 시 현재 페이지를 1로 초기화한 후 데이터를 재로딩합니다.
     */
    onSearch() {
      this.currentPage = 1;
      this.loadItems();
    },
    /**
     * 페이지 변경 시 데이터를 다시 로드합니다.
     */
    onPageChange(page) {
      this.currentPage = page;
      this.loadItems();
    },
    /**
     * 테이블 행 클릭 시 해당 카페 정보를 모달에서 수정할 수 있도록 설정합니다.
     */
    popupModifySystemAdmin(adminId) {
      const admin = this.admins.find((admin) => admin.id === adminId);
      if (admin) {
        this.selectedSystemAdmin = {
          ...admin,
          password: "",
        };
        this.dialog = true;
      }
    },
    changeItemsPerPage(value) {
      this.itemPerPage = value;
      this.loadItems();
    },
    popupCreateSystemAdmin() {
      this.selectedSystemAdmin = {
        id: null,
        email: "",
        password: "",
        nickname: "",
      };
      this.dialog = true;
    },
    /**
     * 모달에서 수정 혹은 생성한 카페 정보를 저장합니다.
     * 수정 시 기존 데이터를 업데이트하고, 생성 시 새로운 아이템을 추가합니다.
     */
    saveSystemAdmin() {
      if (this.selectedSystemAdmin.id) {
        // 수정: 기존 데이터 갱신
        const index = this.admins.findIndex(
            (admin) => admin.id === this.selectedSystemAdmin.id
        );
        if (index !== -1) {
          this.admins.splice(index, 1, { ...this.selectedSystemAdmin });
        }
      } else {
        // 생성: 새로운 카페 추가 (새로운 id 할당)
        const newId =
            this.admins.length > 0
                ? Math.max(...this.admins.map((admin) => admin.id)) + 1
                : 1;
        const newAdmin = { ...this.selectedSystemAdmin, id: newId };
        this.admins.push(newAdmin);
      }
      this.dialog = false;
      // 데이터 변경 반영을 위해 다시 로드
      this.loadItems();
    },
    searchData(param) {
      console.log("검색어:", param);
      this.currentPage = 1;
      this.loadItems(param);
    }
  },
  created() {
    // 초기 데이터 로드
    this.loadItems();
  },
};
</script>

<style scoped>
::v-deep .v-data-table__td {
  vertical-align: middle;
}
</style>