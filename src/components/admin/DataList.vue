<template>
  <v-container class="pa-4">
    <!-- 검색 입력 -->
    <SearchBox class="mb-10" @search="onSearch" @reset="onReset" />

    <!-- 서버 사이드 데이터 테이블 -->
    <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        :search="search"
        item-value="name"
        @update:options="loadItems"
    >
      <!-- 각 행을 클릭하면 수정 팝업을 띄우도록 커스텀 슬롯 사용 -->
      <template #item="{ item }">
        <tr @click="popupModifyCafe(item.id)" style="cursor: pointer;">
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.address }}</td>
          <td>{{ item.registrationDate }}</td>
        </tr>
      </template>
    </v-data-table-server>

    <!-- 카페 수정 팝업 다이얼로그 -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>카페 정보 수정</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedCafe.name"
                  label="카페 이름"
                  outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                  v-model="selectedCafe.description"
                  label="카페 설명"
                  outlined
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedCafe.address"
                  label="카페 주소"
                  outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedCafe.registrationDate"
                  label="등록일"
                  outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveCafe">저장</v-btn>
          <v-btn color="grey" @click="dialog = false">닫기</v-btn>
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
      // 검색어
      search: "",
      // 데이터 테이블 관련
      itemsPerPage: 5,
      headers: [
        { title: "카페 이름", key: "name", align: "start", sortable: false },
        { title: "카페 설명", key: "description", align: "start" },
        { title: "카페 주소", key: "address", align: "start" },
        { title: "등록일", key: "registrationDate", align: "start" },
      ],
      serverItems: [],
      totalItems: 0,
      loading: true,
      // 팝업 다이얼로그 관련
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
      // 마지막으로 사용된 옵션을 저장 (검색 시 재사용)
      lastOptions: null,
    };
  },
  methods: {
    /**
     * 서버 API를 흉내 내어 옵션(page, itemsPerPage, sortBy 등)에 따라 cafes 배열을
     * 필터링, 정렬, 페이징 처리 후 반환합니다.
     */
    loadItems(options) {
      this.lastOptions = options;
      this.loading = true;

      const { page, itemsPerPage, sortBy } = options;
      // 검색어(카페 이름 포함 여부)로 필터링
      let filtered = this.cafes.filter((cafe) =>
          cafe.name.includes(this.search)
      );

      // 정렬 옵션이 있으면 정렬 (정렬 옵션이 없다면 기본 순서 유지)
      if (sortBy && sortBy.length > 0) {
        const sortKey = sortBy[0].key;
        const sortOrder = sortBy[0].order;
        filtered.sort((a, b) => {
          const aValue = a[sortKey];
          const bValue = b[sortKey];
          if (aValue < bValue) return sortOrder === "desc" ? 1 : -1;
          if (aValue > bValue) return sortOrder === "desc" ? -1 : 1;
          return 0;
        });
      }

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
     * 검색어 변경 시 호출되어 현재 옵션의 page를 1로 초기화한 후 데이터를 재로딩합니다.
     */
    onSearch() {
      if (this.lastOptions) {
        this.loadItems({ ...this.lastOptions, page: 1 });
      } else {
        this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage, sortBy: [] });
      }
    },
    /**
     * 테이블 행 클릭 시 해당 카페 정보를 팝업에서 수정할 수 있도록 설정합니다.
     */
    popupModifyCafe(cafeId) {
      const cafe = this.cafes.find((cafe) => cafe.id === cafeId);
      if (cafe) {
        this.selectedCafe = { ...cafe };
        this.dialog = true;
      }
    },
    /**
     * 팝업에서 수정한 카페 정보를 저장한 후, 원본 배열과 테이블 데이터를 갱신합니다.
     */
    saveCafe() {
      const index = this.cafes.findIndex(
          (cafe) => cafe.id === this.selectedCafe.id
      );
      if (index !== -1) {
        // 원본 데이터 갱신
        this.cafes.splice(index, 1, { ...this.selectedCafe });
      }
      this.dialog = false;
      // 변경된 데이터 반영을 위해 현재 옵션으로 다시 로드
      if (this.lastOptions) {
        this.loadItems(this.lastOptions);
      }
    },
  },
  mounted() {
    // 초기 데이터 로드 (기본 옵션: page 1, itemsPerPage 5, 정렬 없음)
    this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage, sortBy: [] });
  },
};
</script>

<style scoped>
</style>