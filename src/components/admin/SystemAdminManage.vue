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
          <v-btn color="red darken-1" @click="deleteItem(selectedSystemAdmin.id)">
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
          <v-btn color="primary" size="large" variant="tonal" @click="saveItem">
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
import $axios from "@/plugins/axios";

export default {
  name: "SystemAdminManage",
  components: {
    SearchBox,
  },
  data() {
    return {
      // 검색 옵션
      field: "systemAdmin",
      options: useAdminPageStateStore().getOptions("systemAdmin"),
      headers: useAdminPageStateStore().getHeaders("systemAdmin"),
      selectedItem: useAdminPageStateStore().getSelectedItemForm("systemAdmin"),
      items_per_page_options: useAdminPageStateStore().getItemsPerPageOptions,
      // 검색어
      search: "",
      managerList: [],
      // 로딩 상태
      loading: false,
      pagination: {},
      // 페이지네이션 관련: 현재 페이지 및 페이지당 아이템 수
      currentPage: 1,
      itemPerPage: 2,
      serverItems: [],
      totalItems: 0,
      // 모달 다이얼로그 관련
      dialogDelete: false,
      dialog: false,
      visible: false,
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.totalItems / this.itemPerPage);
    },
  },
  methods: {
    async loadItems(param) {
      this.loading = true;
      if (!param) {
        param = {
          searchType: "ALL",
          searchQuery: this.search,
          page: this.currentPage,
          size: this.itemPerPage,
        }
      } else {
        this.changeParamDate(param);
      }

      // axios 예시
      const response = await $axios.get("/admin/" + this.field + "/list", { params: param, returnInner: true });
      const pageData = response.page;
      const content = response.content;

      this.totalItems = pageData.total;
      this.serverItems = content;
      this.currentPage = pageData.nowPage + 1;
      this.itemPerPage = pageData.cntPerPage;

      this.loading = false;
    },

    async saveItem() {
      let response;
      if (this.selectedItem.id) {
        // 수정: 기존 데이터 갱신
        response = await $axios.put(
            "/admin/" + this.field + "/update",
            { data: this.selectedItem }
        );
      } else {
        // 생성: 새로운 카페 추가 (새로운 id 할당)
        response = await $axios.post(
            "/admin/" + this.field + "/create",
            { data: this.selectedItem }
        );
      }
      if (response.status !== 200) {
        alert("수정에 실패했습니다.");
        return;
      }

      // 로컬 데이터 업데이트
      this.dialogDelete = false;
      this.currentPage = 0;
      await this.loadItems();
    },

    async deleteItem(id) {
      const response = await $axios.delete("/admin/" + this.field + "/delete", { params: { id: id } });

      if (response.status === 200) {
        this.dialogDelete = false;
        this.currentPage = 0;
        await this.loadItems();
      } else {
        alert("삭제에 실패했습니다.");
      }
    },

    searchData(param) {
      this.currentPage = 0;
      this.loadItems(param);
    },

    onPageChange(page) {
      this.currentPage = page - 1;
      this.loadItems();
    },

    changeParamDate(param) {
      this.searchType = param.searchType;
      this.search = param.searchQuery;
      this.currentPage = param.page;
      this.itemPerPage = param.size;
    },

    changeItemsPerPage(value) {
      this.itemPerPage = value;
      this.currentPage = 0;
      this.loadItems();
    },

    popupDeleteSystemAdmin(item) {
      this.selectedItem = item;
      this.dialogDelete = true;
    },

    popupModifySystemAdmin(adminId) {
      const admin = this.serverItems.find((admin) => admin.id === adminId);
      if (admin) {
        this.selectedItem = {
          ...admin,
          password: "",
        };
        this.dialog = true;
      }
    },

    popupCreateSystemAdmin() {
      this.selectedItem = useAdminPageStateStore().getSelectedItemForm("systemAdmin");
      this.dialog = true;
    },
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