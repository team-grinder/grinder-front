<template>
  <!-- 검색 기능 -->
  <v-row justify="center" class="mb-4">
    <v-col cols="12" md="8">
      <v-row justify="center">
        <!-- 구분 필드 -->
        <v-col cols="2">
          <v-select
              v-model="searchCategory"
              :items="categories"
              label="구분"
              outlined
              dense
          ></v-select>
        </v-col>

        <!-- 검색어 입력 -->
        <v-col cols="5">
          <v-text-field
              v-model="searchQuery"
              label="검색어를 입력하세요"
              outlined
              dense
          ></v-text-field>
        </v-col>

        <!-- 검색 버튼 -->
        <v-col cols="1"
               class="d-flex align-center justify-center">
          <v-btn
              class=""
              color="green-darken-1"
              @click="performSearch"
          >검색</v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "SearchComponent",
  data() {
    return {
      searchQuery: "",
      searchCategory: null,
      selectedDate: null,
      dateMenu: false,
      categories: ["카페명", "주소"], // 구분 옵션
    };
  },
  methods: {
    performSearch() {
      // 검색 로직 추가
      console.log("구분:", this.searchCategory);
      console.log("검색어:", this.searchQuery);
      console.log("날짜:", this.selectedDate);
      // 여기에 검색 로직 구현
    },
  },
};
</script>