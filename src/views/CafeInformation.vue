<template>
  <div>
    <CafeInfoBanner :cafeInfo="cafeInfo" />
    <CafeInfoTab :cafeInfo="cafeInfo" @change-view="handleChangeView"/>
    <div class="cafe_info_line"></div>
    <component
        :is="currentView"
        :cafeInfo="cafeInfo" />
  </div>
</template>

<script>
import CafeInfoBanner from '@/components/cafe/CafeInfoBanner.vue';
import CafeInfoTab from '@/components/cafe/CafeInfoTab.vue';
import MenuList from "@/components/cafe/MenuList.vue";
import Calendar from "@/components/cafe/Calendar.vue";
import axios from 'axios';

export default {
  name: 'CafeInformation',
  components: {
    CafeInfoBanner,
    CafeInfoTab,
    MenuList,
    Calendar,
  },
  data() {
    return {
      cafeInfo: null, // 카페 정보를 저장
      loading: true,
      currentView: "Calendar", // 기본값으로 MenuList를 표시
      error: null,
    };
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleChangeView(viewName) {
      // 버튼 클릭에 따라 표시할 컴포넌트를 변경
      this.currentView = viewName;
    },
  },
  async created() {
    try {
      this.cafeInfo = {
        "id": 1,
        "name": "Bluebird Coffee",
        "address": "123 Coffee Street",
        "phoneNum": "010-1234-5678",
        "averageGrade": 4.5,
        "logoUrl": "",
        "imageUrl": ""
      };
      const response = await axios.get(`cafe/${this.id}`);

      response.data;
    } catch (err) {
      this.error = '카페 정보를 불러올 수 없습니다.';
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.cafe_info_line {
  margin-top: 1.5em;
  width: 100%;
  max-width: 1200px;
  border-top: 1px solid #D9D9D9;
}
</style>