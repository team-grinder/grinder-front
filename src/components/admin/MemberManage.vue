<template>
  <v-container class="pa-4">
    <!-- 검색 입력-->
    <SearchBox
        class="mb-10"
        :options="options"
        @search-data="searchData"/>

    <v-row class="pa-3 d-flex justify-center align-center">
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-select
            v-model="itemPerPage"
            :items="items_per_page_options"
            label="페이지 당 아이템 수"
            density="compact"
            variant="outlined"
            hide-details
            width="200"
            @update:modelValue="changeItemsPerPage"
        ></v-select>
      </v-col>
      <v-btn size="large" variant="tonal" prepend-icon="mdi-account" @click="popupCreateCafe">
        유저 생성
      </v-btn>
    </v-row>

    <!-- 유저 리스트 -->
    <v-data-table
        :headers="headers"
        no-data-text="데이터가 없습니다."
        :items="serverItems"
        :loading="loading"
        :total-items="totalItems"
        :items-per-page="itemPerPage"
        :items-per-page-options="items_per_page_options"
        :server-items-length="totalItems"
        :page="currentPage"
        hover
        hide-default-footer
        disable-sort
        item-key="id"
    >

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.isDeleted="{ item }">
        <span>{{ item.isDeleted ? 'Y' : 'N' }}</span>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="popupModifyMember(item.id)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="popupDeleteMember(item)">
          mdi-delete
        </v-icon>
      </template>

      <template v-slot:bottom>
        <v-row>
          <v-col cols="12">
            <v-pagination
                v-model="currentPage"
                :length="pageCount"
                @update:modelValue="onPageChange($event)"
            ></v-pagination>
          </v-col>
        </v-row>
      </template>
    </v-data-table>

    <!-- 삭제 여부 팝업 -->
    <v-dialog v-model="dialogDelete" max-width="400">
      <v-card>
        <v-card-title class="headline">
          삭제 확인
        </v-card-title>
        <v-card-text>
          선택한 유저를 삭제하시겠습니까?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" @click="dialogDelete = false">
            취소
          </v-btn>
          <v-btn color="red darken-1" @click="deleteMember(selectedMember.id)">
            삭제
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 회원 생성/수정 모달 다이얼로그 -->
    <v-dialog v-model="dialog" max-width="1000px">
      <v-card>
        <v-card-title>
          {{ selectedMember.id ? '회원 정보 수정' : '회원 생성' }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedMember.email"
                  label="회원 이메일"
                  variant="underlined" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedMember.phoneNumber"
                  label="회원 전화번호"
                  variant="underlined" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="selectedMember.nickname"
                  label="회원 닉네임"
                  variant="underlined" />
            </v-col>
            <v-col cols="12">
              <v-select
                  v-model="selectedMember.loginType"
                  :items="['소셜', '일반']"
                  label="로그인 방식"
                  variant="underlined" />
            </v-col>
            <v-col cols="12">
              <v-select
                  v-model="selectedMember.TierType"
                  :items="['MASTER', 'DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'CAFE_MANAGER', 'ADMIN']"
                  label="회원 등급"
                  variant="underlined" />
            </v-col>
            <v-col cols="12">
              <v-select
                  v-model="selectedMember.isDeleted"
                  :items="['탈퇴', '활동']"
                  label="탈퇴 여부"
                  variant="underlined" />
            </v-col>

            <v-col cols="12">
              <v-text-field
                  v-model="findCafeId"
                  label="카페(ID) 검색"
                  variant="outlined"
                  prepend-inner-icon="mdi-coffee"
                  clearable>
                <template v-slot:append>
                  <v-btn
                      color="primary"
                      @click="findMember">
                    검색
                  </v-btn>
                </template>
              </v-text-field>
              <v-data-table
                  :items="managerList"
                  @click:row="(e, { item }) => onRowClick(item)"
                  no-data-text="검색한 카페가 존재하지 않습니다."
                  hover
                  expand-on-click
                  hide-default-footer>
              </v-data-table>
            </v-col>

            <v-col cols="12">
              <v-text-field
                  v-model="selectedMember.cafeAdmin.cafeName"
                  readonly
                  label="카페 관리">
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-btn color="primary" size="large" variant="tonal" @click="saveCafe">
            저장
          </v-btn>
          <v-btn color="red-lighten-4" size="large" variant="tonal" @click="dialog = false">
            닫기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import SearchBox from "@/components/admin/SearchBox";

export default {
  name: "MemberManage",
  components: {
    SearchBox,
  },
  data() {
    return {
      // 검색 옵션
      options: [
        { value: "email", title: "이메일" },
        { value: "phoneNumber", title: "전화번호" },
        { value: "nickname", title: "닉네임" },
        { value: "loginType", title: "로그인 방식" },
        { value: "TierType", title: "회원 등급" },
        { value: "CafeAdmin", title: "카페 관리자 여부" },
        { value: "isDeleted", title: "탈퇴 여부" },
      ],
      // 검색어
      search: "",
      findCafeId: "",
      managerList: [],
      // 로딩 상태
      loading: false,
      pagination: {},
      page: 1,
      pageSize: 5,
      // 페이지네이션 관련: 현재 페이지 및 페이지당 아이템 수
      currentPage: 1,
      headers: [
        { key: "email", title: "이메일", align: 'center', sortable: false },
        { key: "phoneNumber", title: "전화번호", align: 'center', sortable: false },
        { key: "nickname", title: "닉네임", align: 'center', sortable: false },
        { key: "loginType", title: "로그인 방식", align: 'center', sortable: false },
        { key: "TierType", title: "회원 등급", align: 'center', sortable: false },
        { key: "cafeAdmin.cafeName", title: "카페 관리자 여부", align: 'center', sortable: false },
        { key: "isDeleted", title: "탈퇴 여부", align: 'center', sortable: false },
        { key: "registrationDate", title: "가입일", align: 'center', sortable: false },
        { key: "actions", title: "수정/ 삭제", align: 'center', sortable: false }
      ],
      items_per_page_options: [
        {value: 2, title: '2'},
        {value: 10, title: '10'},
        {value: 25, title: '25'},
        {value: 50, title: '50'},
      ],
      itemPerPage: 2,
      serverItems: [],
      totalItems: 0,
      // 모달 다이얼로그 관련
      dialogDelete: false,
      dialog: false,
      selectedMember: {
        id: null,
        email: "",
        phoneNumber: "",
        nickname: "",
        loginType: "",
        TierType: "",
        isDeleted: "",
        registrationDate: "",
        cafeAdmin: {
          id: "",
          cafeName: "",
        }
      },
      // 실제 데이터 (Fake API용)
      members: [
        {
          id: 1,
          email: "test@test.com",
          phoneNumber: "010-1234-5678",
          nickname: "테스트",
          loginType: "일반", // 소셜, 일반
          TierType: "CAFE_MANAGER", // MASTER ,DIAMOND ,PLATINUM ,GOLD ,SILVER ,CAFE_MANAGER ,ADMIN
          cafeAdmin: {
            id: 1,
            cafeName: "카페1"
          },
          isDeleted: false,
          registrationDate: "2021-09-01",
        },
        {
          id: 2,
          email: "test1@test.com",
          phoneNumber: "010-1234-5678",
          nickname: "테스트1",
          loginType: "소셜", // 소셜, 일반
          TierType: "CAFE_MANAGER", // MASTER ,DIAMOND ,PLATINUM ,GOLD ,SILVER ,CAFE_MANAGER ,ADMIN
          cafeAdmin: {
            id: 2,
            cafeName: "카페2"
          },
          isDeleted: false,
          registrationDate: "2021-09-01",
        },
        {
          id: 3,
          email: "test2@test.com",
          phoneNumber: "010-1234-5678",
          nickname: "테스트2",
          loginType: "일반", // 소셜, 일반
          TierType: "PLATINUM", // MASTER ,DIAMOND ,PLATINUM ,GOLD ,SILVER ,CAFE_MANAGER ,ADMIN
          cafeAdmin: null,
          isDeleted: false,
          registrationDate: "2021-09-01",
        },
        {
          id: 4,
          email: "test3@test.com",
          phoneNumber: "010-1234-5678",
          nickname: "테스트3",
          loginType: "소셜", // 소셜, 일반
          TierType: "GOLD", // MASTER ,DIAMOND ,PLATINUM ,GOLD ,SILVER ,CAFE_MANAGER ,ADMIN
          cafeAdmin: null,
          isDeleted: false,
          registrationDate: "2021-09-01",
        }
      ],
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.totalItems / this.itemPerPage);
    },
  },
  methods: {
    onRowClick(item) {
      this.selectedMember.cafeAdmin = item;
    },
    popupDeleteMember(item) {
      this.selectedMember = item;
      this.dialogDelete = true;
    },
    deleteMember(id) {
      console.log("삭제할 유저 ID:", id);
      const index = this.members.findIndex((member) => member.id === id);
      if (index !== -1) {
        this.members.splice(index, 1);
        console.log(this.members)
      }
      this.dialogDelete = false;

      this.loadItems();
    },
    async findMember() {
      /*const response = await $axios.get("/admin/user/search", {
        params: {
          userId: this.findUserId,
        },
      });
      this.managerList = response.data.data;*/

      this.managerList = [{id : 1, cafeName: "카페1"}, {id : 2, cafeName: "카페2"}];
    },
    async loadItems(param) {
      this.loading = true;
      const page = this.currentPage;
      const itemsPerPage = this.itemPerPage;
      this.search = param ? param.searchQuery : this.search;

      // 검색어로 필터링
      let filtered = this.members.filter((member) =>
          member.email.includes(this.search)
      );
      // axios 예시
      // const response = await $axios.get("/admin/cafe/search", { param });

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
     * 검색어 변경 시 현재 페이지를 1로 초기화한 후 데이터를 재로딩합니다.
     */
    onSearch() {
      this.currentPage = 1;
      this.loadItems();
    },
    /**
     * 페이지 변경 시 데이터를 다시 로드합니다.
     */
    onPageChange(page) {
      this.currentPage = page;
      this.loadItems();
    },
    /**
     * 테이블 행 클릭 시 해당 카페 정보를 모달에서 수정할 수 있도록 설정합니다.
     */
    popupModifyMember(memberId) {
      const member = this.members.find((member) => member.id === memberId);
      if (member) {
        this.selectedMember = {
          ...member,
          cafeAdmin: {
            id: member.cafeAdmin ? member.cafeAdmin.id : '',
            userId: member.cafeAdmin ? member.cafeAdmin.cafeName : '',
          },
        };
        this.dialog = true;
      }
    },
    changeItemsPerPage(value) {
      this.itemPerPage = value;
      this.loadItems();
    },
    /**
     * 카페 생성 팝업을 띄웁니다.
     */
    popupCreateCafe() {
      this.selectedMember = {
        id: null,
        email: "",
        phoneNumber: "",
        nickname: "",
        loginType: "",
        TierType: "",
        isDeleted: "",
        registrationDate: new Date().toISOString().substr(0, 10),
        cafeAdmin: {
          id: "",
          cafeName: "",
        }
      };
      this.dialog = true;
    },
    /**
     * 모달에서 수정 혹은 생성한 카페 정보를 저장합니다.
     * 수정 시 기존 데이터를 업데이트하고, 생성 시 새로운 아이템을 추가합니다.
     */
    saveCafe() {
      if (this.selectedMember.id) {
        // 수정: 기존 데이터 갱신
        const index = this.members.findIndex(
            (member) => member.id === this.selectedMember.id
        );
        if (index !== -1) {
          this.members.splice(index, 1, { ...this.selectedMember });
        }
      } else {
        // 생성: 새로운 카페 추가 (새로운 id 할당)
        const newId =
            this.members.length > 0
                ? Math.max(...this.members.map((member) => member.id)) + 1
                : 1;
        const newMember = { ...this.selectedMember, id: newId };
        this.members.push(newMember);
      }
      this.dialog = false;
      // 데이터 변경 반영을 위해 다시 로드
      this.loadItems();
    },
    searchData(param) {
      console.log("검색어:", param);
      this.currentPage = 1;
      this.loadItems(param);
    }
  },
  created() {
    // 초기 데이터 로드
    this.loadItems();
  },
};
</script>

<style scoped>
::v-deep .v-data-table__td {
  vertical-align: middle;
}
</style>