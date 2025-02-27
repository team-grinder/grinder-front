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
    </v-row>

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
        <v-icon class="me-2" size="small" @click="popupModify(item.id)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="popupDelete(item)">
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
          선택한 피드를 삭제하시겠습니까?
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

    <!-- 생성/수정 모달 다이얼로그 -->
    <v-dialog v-model="dialog" max-width="1000px">
      <v-card>
        <v-card-title>
          {{ selectedItem.id ? '피드 정보 수정' : '피드 생성' }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedItem.title"
                  label="피드 제목"
                  variant="underlined" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedItem.content"
                  label="피드 내용"
                  variant="underlined" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedItem.imageList"
                  label="이미지 목록"
                  variant="underlined" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedItem.blind"
                  label="블라인드 여부"
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

export default {
  name: "FeedManage",
  components: {
    SearchBox,
  },
  data() {
    return {
      // 검색 옵션
      options: useAdminPageStateStore().getOptions("Feed"),
      headers: useAdminPageStateStore().getHeaders("Feed"),
      items_per_page_options: useAdminPageStateStore().getItemsPerPageOptions,
      // 검색어
      search: "",
      findCafeId: "",
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
      selectedItem: {
        id: null,
        title: "",
        content: "",
        registrationDate: new Date().toISOString().substr(0, 10),
      },
      // 실제 데이터 (Fake API용)
      dummies: [
        {
          id: 1,
          title: "피드1",
          content: "피드1 내용",
          registrationDate: "2021-09-01",
          imageList: [],
          blind: false,
        },
        {
          id: 2,
          title: "피드2",
          content: "피드2 내용",
          registrationDate: "2021-09-02",
          imageList: [],
          blind: false,
        },
        {
          id: 3,
          title: "피드3",
          content: "피드3 내용",
          registrationDate: "2021-09-03",
          imageList: [],
          blind: false,
        },
        {
          id: 4,
          title: "피드4",
          content: "피드4 내용",
          registrationDate: "2021-09-04",
          imageList: [],
          blind: false,
        },
        {
          id: 5,
          title: "피드5",
          content: "피드5 내용",
          registrationDate: "2021-09-05",
          imageList: [],
          blind: false,
        },
        {
          id: 6,
          title: "피드6",
          content: "피드6 내용",
          registrationDate: "2021-09-06",
          imageList: [],
          blind: false,
        },
        {
          id: 7,
          title: "피드7",
          content: "피드7 내용",
          registrationDate: "2021-09-07",
          imageList: [],
          blind: false,
        },
        {
          id: 8,
          title: "피드8",
          content: "피드8 내용",
          registrationDate: "2021-09-08",
          imageList: [],
          blind: false,
        },
        {
          id: 9,
          title: "피드9",
          content: "피드9 내용",
          registrationDate: "2021-09-09",
          imageList: [],
          blind: false,
        },
        {
          id: 10,
          title: "피드10",
          content: "피드10 내용",
          registrationDate: "2021-09-10",
          imageList: [],
          blind: false,
        },
      ],
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.totalItems / this.itemPerPage);
    },
  },
  methods: {
    popupDelete(item) {
      this.selectedItem = item;
      this.dialogDelete = true;
    },
    deleteItem(id) {
      const index = this.dummies.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.dummies.splice(index, 1);
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
      let filtered = this.dummies.filter((item) =>
          item.id.includes(this.search)
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
    popupModify(itemId) {
      const item = this.dummies.find((item) => item.id === itemId);
      if (item) {
        this.selectedItem = {
          ...item,
        };
        this.dialog = true;
      }
    },
    changeItemsPerPage(value) {
      this.itemPerPage = value;
      this.loadItems();
    },
    /**
     * 모달에서 수정 혹은 생성한 카페 정보를 저장합니다.
     * 수정 시 기존 데이터를 업데이트하고, 생성 시 새로운 아이템을 추가합니다.
     */
    saveItem() {
      if (this.selectedItem.id) {
        // 수정: 기존 데이터 갱신
        const index = this.dummies.findIndex(
            (item) => item.id === this.selectedItem.id
        );
        if (index !== -1) {
          this.dummies.splice(index, 1, { ...this.selectedItem });
        }
      } else {
        // 생성: 새로운 카페 추가 (새로운 id 할당)
        const newId =
            this.dummies.length > 0
                ? Math.max(...this.dummies.map((item) => item.id)) + 1
                : 1;
        const newItem = { ...this.selectedItem, id: newId };
        this.dummies.push(newItem);
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