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
            :items="itemsPerPageOptions"
            label="페이지 당 아이템 수"
            density="compact"
            variant="outlined"
            hide-details
            width="200"
            @update:modelValue="changeItemsPerPage"
        ></v-select>
      </v-col>
      <v-btn size="large" variant="tonal" prepend-icon="mdi-account" @click="popupCreateCafe">
        유저 생성
      </v-btn>
    </v-row>

    <!-- 유저 리스트 -->
    <v-data-table
        :headers="headers"
        no-data-text="데이터가 없습니다."
        :items="serverItems"
        :loading="loading"
        :total-items="totalItems"
        :items-per-page="itemPerPage"
        :items-per-page-options="itemsPerPageOptions"
        :server-items-length="totalItems"
        :page="currentPage"
        hover
        hide-default-footer
        disable-sort
        item-key="id"
    >

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.isDeleted="{ item }">
        <span>{{ item.isDeleted ? 'Y' : 'N' }}</span>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="popupModifyMember(item.id)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="popupDeleteMember(item)">
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
          선택한 유저를 삭제하시겠습니까?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" @click="dialogDelete = false">
            취소
          </v-btn>
          <v-btn color="red darken-1" @click="deleteItem(selectedItem.id)">
            삭제
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 회원 생성/수정 모달 다이얼로그 -->
    <v-dialog v-model="dialog" max-width="1000px">
      <v-card>
        <v-card-title>
          {{ selectedItem.id ? '회원 정보 수정' : '회원 생성' }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedItem.email"
                  label="회원 이메일"
                  variant="underlined" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedItem.phoneNumber"
                  label="회원 전화번호"
                  variant="underlined" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedItem.nickname"
                  label="회원 닉네임"
                  variant="underlined" />
            </v-col>
            <v-col cols="12">
              <v-select
                  v-model="selectedItem.loginType"
                  :items="['소셜', '일반']"
                  label="로그인 방식"
                  variant="underlined" />
            </v-col>
            <v-col cols="12">
              <v-select
                  v-model="selectedItem.TierType"
                  :items="['MASTER', 'DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'CAFE_MANAGER', 'ADMIN']"
                  label="회원 등급"
                  variant="underlined" />
            </v-col>
            <v-col cols="12">
              <v-select
                  v-model="selectedItem.isDeleted"
                  :items="['탈퇴', '활동']"
                  label="탈퇴 여부"
                  variant="underlined" />
            </v-col>

            <v-col cols="12">
              <v-text-field
                  v-model="findCafeId"
                  label="카페(ID) 검색"
                  variant="outlined"
                  prepend-inner-icon="mdi-coffee"
                  clearable>
                <template v-slot:append>
                  <v-btn
                      color="primary"
                      @click="findCafe">
                    검색
                  </v-btn>
                </template>
              </v-text-field>
              <v-data-table
                  :items="managerList"
                  @click:row="(e, { item }) => onRowClick(item)"
                  no-data-text="검색한 카페가 존재하지 않습니다."
                  hover
                  expand-on-click
                  hide-default-footer>
              </v-data-table>
            </v-col>

            <v-col cols="12">
              <v-text-field
                  v-model="selectedItem.cafeAdmin.cafeName"
                  readonly
                  label="카페 관리">
              </v-text-field>
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
  name: "MemberManage",
  components: {
    SearchBox,
  },
  data() {
    return {
      // 검색 옵션
      field: "member",
      options: useAdminPageStateStore().getOptions("member"),
      headers: useAdminPageStateStore().getHeaders("member"),
      selectedItem: useAdminPageStateStore().getSelectedItemForm("member"),
      itemsPerPageOptions: useAdminPageStateStore().getItemsPerPageOptions,
      // 검색어
      searchType: "",
      search: "",
      findCafeId: "",
      managerList: [],
      // 로딩 상태
      loading: false,
      pagination: {},
      // 페이지네이션 관련: 현재 페이지 및 페이지당 아이템 수
      currentPage: 0,
      itemPerPage: 2,
      serverItems: [],
      totalItems: 0,
      // 모달 다이얼로그 관련
      dialogDelete: false,
      dialog: false,
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
            { data: this.selectedCafe }
        );
      } else {
        // 생성: 새로운 카페 추가 (새로운 id 할당)
        response = await $axios.post(
            "/admin/" + this.field + "/create",
            { data: this.selectedCafe }
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

    async findCafe() {
      this.managerList = await $axios.get("/admin/user/search", {
        params: {
          cafeId: this.findCafeId,
        },
        returnInner: true,
      });
    },

    searchData(param) {
      this.currentPage = 0;
      this.loadItems(param);
    },

    onPageChange(page) {
      this.currentPage = page;
      this.loadItems();
    },

    changeParamDate(param) {
      this.searchType = param.searchType;
      this.search = param.searchQuery;
      this.currentPage = param.page;
      this.itemPerPage = param.size;
    },

    onRowClick(item) {
      this.selectedItem.cafeAdmin = item;
    },

    popupDeleteMember(item) {
      this.selectedItem = item;
      this.dialogDelete = true;
    },

    changeItemsPerPage(value) {
      this.itemPerPage = value;
      this.loadItems();
    },

    popupCreateCafe() {
      this.selectedItem = useAdminPageStateStore().getSelectedItemForm(this.field);
      this.dialog = true;
    },

    popupModifyMember(memberId) {
      const member = this.serverItems.find((member) => member.id === memberId);
      if (member) {
        this.selectedItem = {
          ...member,
          cafeAdmin: {
            id: member.cafeAdmin ? member.cafeAdmin.id : '',
            cafeName: member.cafeAdmin ? member.cafeAdmin.cafeName : '',
          },
        };
        this.dialog = true;
      }
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