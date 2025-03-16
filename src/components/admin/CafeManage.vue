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
      <v-btn size="large" variant="tonal" prepend-icon="mdi-coffee" @click="popupCreateCafe">
        카페 생성
      </v-btn>
    </v-row>

    <!-- 카페 리스트 -->
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
        <v-icon class="me-2" size="small" @click="popupModifyCafe(item.id)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="popupDeleteCafe(item)">
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
          선택한 카페를 삭제하시겠습니까?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" @click="dialogDelete = false">
            취소
          </v-btn>
          <v-btn color="red darken-1" @click="deleteCafe(selectedCafe.id)">
            삭제
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 카페 생성/수정 모달 다이얼로그 -->
    <v-dialog v-model="dialog" max-width="1000px">
      <v-card>
        <v-card-title>
          {{ selectedCafe.id ? '카페 정보 수정' : '카페 생성' }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedCafe.name"
                  label="카페 이름"
                  variant="underlined" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedCafe.description"
                  label="카페 설명"
                  variant="underlined" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedCafe.address"
                  label="카페 주소"
                  variant="underlined" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="findUserId"
                  label="회원(ID) 검색"
                  variant="outlined"
                  prepend-inner-icon="mdi-account-search"
                  clearable>
                <template v-slot:append>
                  <v-btn
                      color="primary"
                      @click="findUser">
                    검색
                  </v-btn>
                </template>
              </v-text-field>
              <v-data-table
                  :items="managerList"
                  @click:row="(e, { item }) => onRowClick(item)"
                  no-data-text="검색한 회원이 존재하지 않습니다."
                  hover
                  expand-on-click
                  hide-default-footer>
              </v-data-table>
            </v-col>

            <v-col cols="12">
              <v-text-field
                  v-model="selectedCafe.manager.userId"
                  readonly
                  label="관리자 회원 아이디">
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-btn color="primary" size="large" variant="tonal" @click="saveCafe">
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
  name: "CafeManage",
  components: {
    SearchBox,
  },
  data() {
    return {
      // 검색 옵션
      options: useAdminPageStateStore().getOptions("cafe"),
      headers: useAdminPageStateStore().getHeaders("cafe"),
      items_per_page_options: useAdminPageStateStore().getItemsPerPageOptions,
      // 검색어
      searchType: "",
      search: "",
      findUserId: "",
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
      selectedCafe: {
        id: null,
        name: "",
        description: "",
        address: "",
        registrationDate: "",
        manager: {
          id: null,
          userId: "",
        }
      },
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.totalItems / this.itemPerPage);
    },
  },
  methods: {
    // 카페 삭제
    async deleteCafe(id) {
      const response = await $axios.delete("/admin/cafe/delete", { params: { id: id } });

      if (response.status === 200) {
        this.dialogDelete = false;
        this.currentPage = 0;
        await this.loadItems();
      } else {
        alert("삭제에 실패했습니다.");
      }
    },

    // 회원 검색
    async findUser() {
      this.managerList = await $axios.get("/admin/user/search", {
        params: {
          userId: this.findUserId,
        },
        returnInner: true,
      });
    },

    // 카페 리스트 조회
    async loadItems(param) {
      this.loading = true;
      if (!param) {
        param = {
          searchType: "ALL",
          searchQuery: this.search,
          page: this.currentPage,
          size: this.itemPerPage,
        }
      } else this.changeParamDate(param);


      // axios 예시
      const response = await $axios.get("/admin/cafe/list", { params: param, returnInner: true });
      const pageData = response.page;
      const content = response.content;

      this.totalItems = pageData.total;
      this.serverItems = content;
      this.currentPage = pageData.nowPage + 1;
      this.itemPerPage = pageData.cntPerPage;

      this.loading = false;
    },

    // 카페 정보 저장 / 수정
    async saveCafe() {
      let response;
      if (this.selectedCafe.id) {
        // 수정: 기존 데이터 갱신
        response = await $axios.put(
            "/admin/cafe/update",
            { data: this.selectedCafe }
        );
      } else {
        // 생성: 새로운 카페 추가 (새로운 id 할당)
        response = await $axios.post(
            "/admin/cafe/create",
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

    onRowClick(item) {
      this.selectedCafe.manager = item;
    },

    popupDeleteCafe(item) {
      this.selectedCafe = item;
      this.dialogDelete = true;
    },

    changeItemsPerPage(value) {
      this.itemPerPage = value;
      this.loadItems();
    },

    // 카페 생성 팝업
    popupCreateCafe() {
      this.selectedCafe = {
        id: null,
        name: "",
        description: "",
        address: "",
        registrationDate: new Date().toISOString().substr(0, 10),
        manager: {
          id: null,
          userId: "",
        }
      };
      this.dialog = true;
    },

    // 카페 수정 팝업
    popupModifyCafe(cafeId) {
      const cafe = this.cafes.find((cafe) => cafe.id === cafeId);
      if (cafe) {
        this.selectedCafe = {
          ...cafe,
          manager: {
            id: cafe.manager ? cafe.manager.id : '',
            userId: cafe.manager ? cafe.manager.userId : '',
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