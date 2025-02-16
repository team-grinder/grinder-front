<template>
  <v-card class="pa-4 mb-4"
          density="compact"
          color="grey-lighten-2"
          variant="outlined">
    <v-card-text class="text-black">
      <v-row
          class="mb-0"
          no-gutters>
        <!-- 날짜 선택 -->
        <v-col class="mr-5">
          <v-date-input
              prepend-icon=""
              prepend-inner-icon="$calendar"
              v-model="startDate"
              label="시작일 선택"
              variant="underlined"
          ></v-date-input>
        </v-col>
        <v-col>
          <v-date-input
              prepend-icon=""
              prepend-inner-icon="$calendar"
              v-model="endDate"
              label="종료일 선택"
              variant="underlined"
          ></v-date-input>
        </v-col>
      </v-row>

      <v-row
          class="mb-0"
          no-gutters>
        <!-- 셀렉트 박스 -->
        <v-col cols="2" class="pr-5">
          <v-select
              v-model="selectedOption"
              :items="optionsDummy"
              label="구분 선택"
              variant="underlined"
              prepend-inner-icon="mdi-menu"
          ></v-select>
        </v-col>

        <!-- 검색창 -->
        <v-col>
          <v-text-field
              v-model="searchQuery"
              label="검색어 입력"
              variant="underlined"
              prepend-inner-icon="mdi-magnify"
              clearable
          ></v-text-field>
        </v-col>

      </v-row>
    </v-card-text>

    <v-card-actions>
      <!-- 검색 버튼 -->
      <v-btn
          class="flex-grow-1"
          color="primary"
          size="large"
          variant="tonal"
          @click="onSearch">
        검색
      </v-btn>
      <!-- 초기화 버튼 -->
      <v-btn
          class="flex-grow-1"
          color="red-lighten-4"
          size="large"
          variant="tonal"
          @click="onReset">
        초기화
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "SearchBox",
  props: {
    // 옵션
    options : {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      // 날짜 선택 관련
      startDate: null,
      endDate: null,
      dateMenu: false,
      // 셀렉트 박스 관련
      selectedOption: null,
      optionsDummy: ["옵션1", "옵션2", "옵션3"],
      // 검색창 관련
      searchQuery: "",
    };
  },
  methods: {
    onSearch() {
      // 실제 검색 로직을 이곳에 구현하세요.
      console.log("검색 수행:", {
        startDate: this.startDate,
        endDate: this.endDate,
        selectedOption: this.selectedOption,
        searchQuery: this.searchQuery,
      });
    },
    onReset() {
      // 모든 입력값 초기화
      this.startDate = null;
      this.endDate = null;
      this.selectedOption = null;
      this.searchQuery = "";
    },
  },
};
</script>

<style scoped>

</style>