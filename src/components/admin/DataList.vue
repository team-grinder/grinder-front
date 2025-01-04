<template>
  <v-container class="pa-4">
    <!-- 검색 기능 -->
    <Search></Search>

    <!-- 카페 목록 -->
    <v-row justify="center">
      <v-col cols="12" md="8">
        <!-- 칼럼 헤더 -->
        <v-row class="text-center font-weight-bold mb-2">
          <v-col cols="3">카페 이름</v-col>
          <v-col cols="3">카페 설명</v-col>
          <v-col cols="3">카페 주소</v-col>
          <v-col cols="3">등록일</v-col>
        </v-row>

        <v-divider></v-divider>

        <!-- 카페 목록 -->
        <v-list-item
            class="text-center py-2"
            v-for="(cafe, index) in filteredCafes"
            :key="index"
            @click="popupModifyCafe(cafe.id)"
        >
          <v-row>
            <v-col cols="3">{{ cafe.name }}</v-col>
            <v-col cols="3">{{ cafe.description }}</v-col>
            <v-col cols="3">{{ cafe.address }}</v-col>
            <v-col cols="3">{{ cafe.registrationDate }}</v-col>
          </v-row>
        </v-list-item>
      </v-col>
    </v-row>

    <!-- 페이지네이션 -->
    <v-row justify="center" class="mt-2">
      <v-col cols="12" md="6" class="text-center">
        <v-pagination
            v-model="currentPage"
            :length="pageCount"
            circle
            color="primary"
        ></v-pagination>
      </v-col>
    </v-row>

    <!-- 팝업 다이얼로그 -->
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
import defaultImage from "@/assets/images/basic-user-img.png";
import Search from "@/components/admin/Search";

export default {
  name: "AdminCafeList",
  components: {
    Search,
  },
  data() {
    return {
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 5,
      defaultImage: defaultImage,
      dialog: false,
      selectedCafe: {
        id: null,
        name: "",
        description: "",
        address: "",
        registrationDate: "",
      },
      cafes: [
        {
          name: "카페1",
          description: "맛있는 커피와 디저트",
          address: "서울시 강남구",
          registrationDate: "2024-03-25",
          image: null,
        },
        {
          name: "카페2",
          description: "조용하고 아늑한 분위기",
          address: "서울시 강북구",
          registrationDate: "2024-03-25",
          image: null,
        },
        {
          name: "카페3",
          description: "트렌디한 인테리어와 음악",
          address: "서울시 강동구",
          registrationDate: "2024-03-25",
          image: null,
        },
        {
          name: "카페4",
          description: "도심 속 작은 정원",
          address: "서울시 강서구",
          registrationDate: "2024-03-25",
          image: null,
        },
        {
          name: "카페5",
          description: "24시간 열려있는 카페",
          address: "서울시 강남구",
          registrationDate: "2024-03-25",
          image: null,
        },
        {
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
    filteredCafes() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const filtered = this.cafes.filter((cafe) =>
          cafe.name.includes(this.searchQuery)
      );
      return filtered.slice(start, end);
    },
    pageCount() {
      return Math.ceil(
          this.cafes.filter((cafe) => cafe.name.includes(this.searchQuery)).length /
          this.itemsPerPage
      );
    },
  },
  methods: {
    popupModifyCafe(cafeId) {
      const cafe = this.cafes.find((cafe) => cafe.id === cafeId);
      this.selectedCafe = { ...cafe }; // 선택된 카페 정보를 복사
      this.dialog = true; // 팝업 열기
    },
    saveCafe() {
      // 수정된 카페 정보를 저장 (로직 필요)
      const index = this.cafes.findIndex(
          (cafe) => cafe.id === this.selectedCafe.id
      );
      if (index !== -1) {
        this.cafes[index] = { ...this.selectedCafe };
      }
      this.dialog = false; // 팝업 닫기
    },
  },
};
</script>

<style scoped>
</style>