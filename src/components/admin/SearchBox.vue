<template>
  <v-card class="pa-4 mb-4"
          variant="elevated">
    <v-card-title>검색</v-card-title>
    <v-card-text
      class="px-4">
      <v-row
          class="mb-0 justify-lg-space-between"
          no-gutters>
        <!-- 셀렉트 박스 -->
        <v-col cols="2" class="pr-5">
          <v-select
              v-model="selectedOption"
              :items="options"
              label="옵션 선택"
              variant="outlined"
          ></v-select>
        </v-col>

        <!-- 검색창 -->
        <v-col cols="6" class="pr-5">
          <v-text-field
              v-model="searchQuery"
              label="검색어"
              variant="outlined"
              clearable
          ></v-text-field>
        </v-col>

        <v-spacer></v-spacer>

        <!-- 날짜 선택 -->
        <v-col cols="3">
          <v-date-input
              prepend-icon=""
              prepend-inner-icon="$calendar"
              v-model="searchDate"
              label="날짜 선택"
              variant="outlined"
              multiple="range"
          ></v-date-input>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <!-- 검색 버튼 -->
      <v-btn color="primary" @click="onSearch">검색</v-btn>
      <!-- 초기화 버튼 -->
      <v-btn color="grey" @click="onReset">초기화</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "SearchBox",
  data() {
    return {
      // 날짜 선택 관련
      searchDate: null,
      dateMenu: false,
      // 셀렉트 박스 관련
      selectedOption: null,
      options: ["옵션1", "옵션2", "옵션3"],
      // 검색창 관련
      searchQuery: "",
    };
  },
  methods: {
    onSearch() {
      // 실제 검색 로직을 이곳에 구현하세요.
      console.log("검색 수행:", {
        selectedDate: this.selectedDate,
        selectedOption: this.selectedOption,
        searchQuery: this.searchQuery,
      });
    },
    onReset() {
      // 모든 입력값 초기화
      this.selectedDate = null;
      this.selectedOption = null;
      this.searchQuery = "";
    },
  },
};
</script>

<style scoped>

</style>