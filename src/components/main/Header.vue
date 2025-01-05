<template>
  <v-app-bar class="header-container">
    <template v-slot:prepend>
        <router-link to="/" class="header_grinder_logo">
          <img :src="require('@/assets/images/grinder-logo.png')"
               class="header_grinder_logo_img"
                 alt="grinder_logo"/>
        </router-link>
    </template>

    <!-- 검색 박스 -->
    <v-row
        align="center"
        class=""
        dense
    >
      <v-col class="ma-0 pa-0" cols="auto">
        <v-select
            v-model="searchType"
            :items="dropdownOptions"
            :item-props="itemProps"
            dense
            outlined
            hide-details
            density="compact"
            variant="outlined"
        ></v-select>
      </v-col>

      <v-col class="ma-0 pa-0" cols="auto">
        <v-text-field
            v-model="searchKeyword"
            placeholder="검색어를 입력해주세요"
            outlined
            hide-details
            clearable
            width="300"
            density="compact"
            @keyup.enter="emitSearch"
            variant="outlined"
        ></v-text-field>
      </v-col>

      <v-col class="ma-0 pa-0" cols="auto">
        <v-btn
            color="green darken-1"
            elevation="2"
            @click="emitSearch">
          검색
        </v-btn>
      </v-col>
    </v-row>

    <v-spacer></v-spacer>

    <!-- 사용자 정보 -->
    <div v-if="!isAuthenticated">
      <v-btn to="/login">로그인</v-btn>
      <v-btn to="/register">회원 가입</v-btn>
    </div>
    <div v-else>
      <v-row align="center" dense>
        <v-col cols="auto">
          <span>
            <strong>{{ nickname }}</strong>님! 안녕하세요.
          </span>
        </v-col>

        <v-col cols="auto">
          <v-btn @click="logout">
            로그아웃
          </v-btn>
        </v-col>

        <v-col cols="auto" v-if="!imageUrl">
          <v-btn @click="$emit('go-to-my-page')">
            마이페이지
          </v-btn>
        </v-col>
        <v-col cols="auto" v-else>
          <v-avatar
              color="grey lighten-4"
              size="32"
              @click="$emit('go-to-my-page')"
              style="cursor: pointer;"
          >
            <v-img
                :src="imageUrl"
                alt="프로필 이미지"
            ></v-img>
          </v-avatar>
        </v-col>
      </v-row>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: "HeaderComponent",
  props: {
    isAuthenticated: {
      type: Boolean,
      required: true,
    },
    nickname: {
      type: String,
      required: false,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    dropdownOptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      searchType: "all",     // 기본 검색 타입
      searchKeyword: "",     // 검색 키워드
    };
  },
  methods: {
    emitSearch() {
      // 부모 컴포넌트로 검색 이벤트 전파
      this.$emit("search", {
        searchType: this.searchType,
        searchKeyword: this.searchKeyword,
      });
    },
    logout() {
      // 부모 컴포넌트로 로그아웃 이벤트 전파
      this.$emit("logout");
    },
    itemProps(option) {
      return {
        title: option.label,
      }
    },
  },
};
</script>

<style scoped>
.header_grinder_logo_img {
  height: 2em;
  display: block;
  background-size: contain;
  margin-right: 0.5em;
}
</style>
