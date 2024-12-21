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
          <li><strong>{{ nickname }}</strong>님! 안녕하세요.</li>
          <li>
            <button @click="logout">로그아웃</button>
          </li>
          <li v-if="!imageUrl">
            <button class="header_profile" @click="$emit('go-to-my-page')">마이페이지</button>
          </li>
          <li v-else>
            <img
                class="header_profile_member"
                :src="imageUrl"
                @click="$emit('go-to-my-page')"
                alt="프로필 이미지"
            />
          </li>
        </ul>
      </div>
    </nav>
  </header>
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
      dropdownActive: false,
      searchType: "all",
      searchKeyword: "",
      dropdownLabel: "전체",
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownActive = !this.dropdownActive;
    },
    selectDropdown(type) {
      this.searchType = type.value;
      this.dropdownActive = false;
      this.dropdownLabel = type.label;
    },
    emitSearch() {
      this.$emit("search", {
        searchType: this.searchType,
        searchKeyword: this.searchKeyword,
      });
    },
    logout() {
      this.$emit("logout");
    },
  },
};
</script>


<style scoped>
@import '@/assets/css/common.css';

.header-container {
  position: absolute;
  left: 50%;
  width: 100%;
  max-width: 1280px;
  transform: translate(-50%);
  background-color: white;
  z-index: 1;
  border-radius: 0 0 15px 15px;
  box-shadow: 0 4px 11px 0 rgba(0,0,0,25%);
}

.header-container .header-container-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7em 1em;
}

.header-container .header-container-navigation .header-container-navigation-search-box {
  display: flex;
  float: left;
  align-items: center;
  justify-content: space-between;
}

.header-container .header-container-navigation .header-container-navigation-search-box .header_grinder_logo {
  width: 5em;
  height: 2em;
  display: block;
  background: url('../../assets/images/grinder-logo.png') no-repeat center;
  background-size: contain;
  text-indent: -9999px;
  margin-right: 0.5em;
}

.header-container .header-container-navigation .header-container-navigation-search-box form {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-container .header-container-navigation .header-container-navigation-search-box .custom-dropdown {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 5em;
  height: 2em;
  padding: 0 0.5em;
  background-color: #FFFFFF;
  border-radius: 10px 0 0 0;
  border: #B4B4B4 solid 1px;
  cursor: pointer;
}

.custom-dropdown-type {
  font-weight: normal;
  font-size: 0.8em;
  color: #B4B4B4;
  margin-bottom: 0;
}

/* 드롭다운 활성화 상태 스타일 */
.custom-dropdown.active .custom-dropdown-content-box {
  position: absolute;
  background-color: #FFFFFF;
  border: 1px solid #B4B4B4;
  border-radius: 0 0 10px 10px;
  width: 7.5em;
  z-index: 1000;
  top: 3.35em;
  left: 8.2em;
}

.custom-dropdown-content-box {
  list-style: none;
  position: absolute;
  margin: 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
  font-size: 0.8em;
}

.custom-dropdown-content-box .custom-dropdown-content {
  padding: 0.5em 1em;
  cursor: pointer;
  transition: background-color 0.3s;
}

.custom-dropdown-content-box .custom-dropdown-content:hover {
  background-color: #f0f0f0;
}

.custom-dropdown-content.selected {
  background-color: #e0e0e0;
}



.header_search {
  padding: 0 0 0 1em;
  height: 2.2em;
  border-radius: 0 0 0 0;
  font-size: 0.9em;
}

.header-search-submit {
  width: 3em;
  height: 2.6em;
  padding: 0 0.5em;
  background-color: #009B55;
  border-radius: 0 10px 10px 0;
  color: white;
  font-size: 0.8em;
  cursor: pointer;
  text-align: center;
}

.header-container .header-container-navigation .header-container-navigation-member-information ul {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-container .header-container-navigation .header-container-navigation-member-information ul li {
  padding-right: 0.5em;
  font-size: 0.8em;
}
</style>
