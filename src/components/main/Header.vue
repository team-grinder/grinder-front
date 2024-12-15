<template>
  <header class="header-container">
    <nav class="header-container-navigation">
      <!-- 검색 박스 -->
      <div class="header-container-navigation-search-box">
        <h1>
          <a class="header_grinder_logo">그라인더 홈페이지 이동</a>
        </h1>
        <form @submit.prevent="emitSearch">
          <div class="custom-dropdown" @click="toggleDropdown" :class="{ active: dropdownActive }">
            <input type="hidden" v-model="searchType" />
            <img src="@/assets/images/icon/search.png" alt="search" />
            <span class="custom-dropdown-type">{{ dropdownLabel }}</span>
            <img src="@/assets/images/icon/caret-down.png" alt="arrow_down" />
            <ul class="custom-dropdown-content-box" v-if="dropdownActive">
              <li
                  v-for="type in dropdownOptions"
                  :key="type.value"
                  @click="selectDropdown(type)"
                  :class="{ selected: searchType === type.value }"
                  class="custom-dropdown-content"
              >
                {{ type.label }}
              </li>
            </ul>
          </div>
          <label>
            <input
                type="text"
                v-model="searchKeyword"
                class="header_search"
                placeholder="검색어를 입력해주세요"
            />
          </label>
          <button class="header-search-submit" type="submit">검색</button>
        </form>
      </div>

      <!-- 사용자 정보 -->
      <div class="header-container-navigation-member-information">
        <ul v-if="!isAuthenticated">
          <li><a href="/login">로그인</a></li>
          <li> | </li>
          <li><a href="/register">회원 가입</a></li>
        </ul>
        <ul v-else>
          <li><strong>{{ username }}</strong>님! 안녕하세요.</li>
          <li>
            <img
                class="header_profile_member"
                :src="!!memberImageUrl ? memberImageUrl : require('@/assets/images/basic-user-img.png')"
                @click="$emit('go-to-my-page')"
                :alt="userId"
            />
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import '@/assets/css/haeder.css'

export default {
  name: "HeaderComponent",
  props: {
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      default: "",
    },
    memberImageUrl: {
      type: String,
      default: null,
    },
    userId: {
      type: Number,
      default: null,
    },
    dropdownOptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dropdownActive: false,
      searchType: "all",
      searchKeyword: "",
    };
  },
  computed: {
    dropdownLabel() {
      const selected = this.dropdownOptions.find(
          (option) => option.value === this.searchType
      );
      return selected ? selected.label : "전체";
    },
  },
  methods: {
    toggleDropdown() {
      this.dropdownActive = !this.dropdownActive;
    },
    selectDropdown(type) {
      this.searchType = type.value;
      this.dropdownActive = false;
    },
    emitSearch() {
      this.$emit("search", {
        searchType: this.searchType,
        searchKeyword: this.searchKeyword,
      });
    },
  },
};
</script>


<style scoped>

</style>
