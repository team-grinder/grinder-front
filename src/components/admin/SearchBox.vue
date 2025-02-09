<template>
  <v-card class="pa-4 mb-4" outlined>
    <v-card-title>검색 조건</v-card-title>
    <v-card-text>
      <v-row>
        <!-- 날짜 선택 -->
        <v-col cols="12" sm="6" md="4">
          <v-menu
              ref="dateMenu"
              v-model="dateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="selectedDate"
                  label="날짜 선택"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
              ></v-text-field>
            </template>
            <v-date-picker
                v-model="selectedDate"
                @input="dateMenu = false"
                scrollable
            ></v-date-picker>
          </v-menu>
        </v-col>

        <!-- 셀렉트 박스 -->
        <v-col cols="12" sm="6" md="4">
          <v-select
              v-model="selectedOption"
              :items="options"
              label="옵션 선택"
              outlined
          ></v-select>
        </v-col>

        <!-- 검색창 -->
        <v-col cols="12" md="4">
          <v-text-field
              v-model="searchQuery"
              label="검색어"
              outlined
              clearable
          ></v-text-field>
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
      selectedDate: null,
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