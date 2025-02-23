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

export default {
  name: "AdminCafeList",
  components: {
    SearchBox,
  },
  data() {
    return {
      // 검색 옵션
      options: [
        { value: "name", title: "카페명" },
        { value: "address", title: "주소" },
      ],
      // 검색어
      search: "",
      findUserId: "",
      managerList: [],
      // 로딩 상태
      loading: false,
      pagination: {},
      page: 1,
      pageSize: 5,
      // 페이지네이션 관련: 현재 페이지 및 페이지당 아이템 수
      currentPage: 1,
      headers: [
        { title: "카페 이름", key: "name", align: 'center', sortable: false, class: 'vertical-mid' },
        { title: "카페 설명", key: "description", align: 'center', sortable: false, class: 'vertical-mid' },
        { title: "카페 주소", key: "address", align: 'center', sortable: false, class: 'vertical-mid' },
        { title: "등록일", key: "registrationDate", align: 'center', sortable: false, class: 'vertical-mid' },
        { title: "수정 / 삭제", key: "actions", align: 'center', sortable: false, class: 'vertical-mid' },
      ],
      items_per_page_options: [
        {value: 2, title: '2'},
        {value: 10, title: '10'},
        {value: 25, title: '25'},
        {value: 50, title: '50'},
      ],
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
      // 실제 데이터 (Fake API용)
      cafes: [
        {
          id: 1,
          name: "카페1",
          description: "맛있는 커피와 디저트",
          address: "서울시 강남구",
          registrationDate: "2024-03-25",
          image: null,
        },
        {
          id: 2,
          name: "카페2",
          description: "조용하고 아늑한 분위기",
          address: "서울시 강북구",
          registrationDate: "2024-03-25",
          image: null,
        },
        {
          id: 3,
          name: "카페3",
          description: "트렌디한 인테리어와 음악",
          address: "서울시 강동구",
          registrationDate: "2024-03-25",
          image: null,
        },
        {
          id: 4,
          name: "카페4",
          description: "도심 속 작은 정원",
          address: "서울시 강서구",
          registrationDate: "2024-03-25",
          image: null,
        },
        {
          id: 5,
          name: "카페5",
          description: "24시간 열려있는 카페",
          address: "서울시 강남구",
          registrationDate: "2024-03-25",
          image: null,
        },
        {
          id: 6,
          name: "카페6",
          description: "넓은 공간과 다양한 메뉴",
          address: "서울시 강북구",
          registrationDate: "2024-03-25",
          image: null,
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
    onRowClick(item) {
      this.selectedCafe.manager = item;
    },
    popupDeleteCafe(item) {
      this.selectedCafe = item;
      this.dialogDelete = true;
    },
    deleteCafe(id) {
      console.log("삭제할 카페 ID:", id);
      const index = this.cafes.findIndex((cafe) => cafe.id === id);
      if (index !== -1) {
        this.cafes.splice(index, 1);
        console.log(this.cafes)
      }
      this.dialogDelete = false;

      this.loadItems();
    },
    async findUser() {
      /*const response = await $axios.get("/admin/user/search", {
        params: {
          userId: this.findUserId,
        },
      });
      this.managerList = response.data.data;*/

      this.managerList = [{id : 1, userId: "user1"}, {id : 2, userId: "user2"}];
    },
    async loadItems(param) {
      this.loading = true;
      const page = this.currentPage;
      const itemsPerPage = this.itemPerPage;
      this.search = param ? param.searchQuery : this.search;

      // 검색어(카페 이름 포함 여부)로 필터링
      let filtered = this.cafes.filter((cafe) =>
          cafe.name.includes(this.search)
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
    changeItemsPerPage(value) {
      this.itemPerPage = value;
      this.loadItems();
    },
    /**
     * 카페 생성 팝업을 띄웁니다.
     */
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
    /**
     * 모달에서 수정 혹은 생성한 카페 정보를 저장합니다.
     * 수정 시 기존 데이터를 업데이트하고, 생성 시 새로운 아이템을 추가합니다.
     */
    saveCafe() {
      if (this.selectedCafe.id) {
        // 수정: 기존 데이터 갱신
        const index = this.cafes.findIndex(
            (cafe) => cafe.id === this.selectedCafe.id
        );
        if (index !== -1) {
          this.cafes.splice(index, 1, { ...this.selectedCafe });
        }
      } else {
        // 생성: 새로운 카페 추가 (새로운 id 할당)
        const newId =
            this.cafes.length > 0
                ? Math.max(...this.cafes.map((cafe) => cafe.id)) + 1
                : 1;
        const newCafe = { ...this.selectedCafe, id: newId };
        this.cafes.push(newCafe);
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