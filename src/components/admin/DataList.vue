<template>
  <v-container class="pa-4">
    <!-- 검색 입력-->
    <SearchBox
        class="mb-10"
        :options="options"
        @search="onSearch"/>

    <v-row class="pa-3">
      <v-spacer></v-spacer>
      <v-btn size="large" variant="tonal" prepend-icon="mdi-coffee" @click="popupCreateCafe">
        카페 생성
      </v-btn>
    </v-row>

    <v-data-table
        :headers="headers"
        :items="serverItems"
        :loading="loading"
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
        :page="currentPage"
        hide-default-footer
        disable-sort
        item-key="id"
    >

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="popupModifyCafe(item.id)">
          mdi-pencil
        </v-icon>
        <v-icon size="small">
          mdi-delete
        </v-icon>
      </template>

      <template v-slot:bottom>
        <v-row class="mt-4" justify="center">
          <v-pagination
              v-model="currentPage"
              :length="pageCount"
              @input="onPageChange" />
        </v-row>
      </template>
    </v-data-table>

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
      options: ["옵션1", "옵션2", "옵션3"],
      // 검색어
      search: "",
      // 로딩 상태
      loading: false,
      // 페이지네이션 관련: 현재 페이지 및 페이지당 아이템 수
      currentPage: 0,
      itemsPerPage: 5,
      headers: [
        { title: "카페 이름", key: "name", align: 'center', sortable: false },
        { title: "카페 설명", key: "description", align: 'center', sortable: false },
        { title: "카페 주소", key: "address", align: 'center', sortable: false },
        { title: "등록일", key: "registrationDate", align: 'center', sortable: false },
        { title: "액션", key: "actions", align: 'center', sortable: false },
      ],
      serverItems: [],
      totalItems: 0,
      // 모달 다이얼로그 관련
      dialog: false,
      selectedCafe: {
        id: null,
        name: "",
        description: "",
        address: "",
        registrationDate: "",
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
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
  },
  methods: {
    loadItems() {
      this.currentPage += 1;

      this.loading = true;
      const page = this.currentPage;
      const itemsPerPage = this.itemsPerPage;

      // 검색어(카페 이름 포함 여부)로 필터링
      let filtered = this.cafes.filter((cafe) =>
          cafe.name.includes(this.search)
      );

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
    onPageChange() {
      this.loadItems();
    },
    /**
     * 테이블 행 클릭 시 해당 카페 정보를 모달에서 수정할 수 있도록 설정합니다.
     */
    popupModifyCafe(cafeId) {
      const cafe = this.cafes.find((cafe) => cafe.id === cafeId);
      if (cafe) {
        this.selectedCafe = { ...cafe };
        this.dialog = true;
      }
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
  },
  mounted() {
    // 초기 데이터 로드
    this.loadItems();
  },
};
</script>