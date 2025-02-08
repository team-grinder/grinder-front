import { defineStore } from "pinia";
import $axios from "@/plugins/axios";

export const useFeedStore = defineStore("feed", {
    state: () => ({
        feedList: [], // 피드 목록
        loading: false, // 데이터 로딩 중 여부
        page: 0, // 페이지 번호
        size: 10, // 페이지 크기
        noContents: false, // 더 이상 불러올 데이터가 없는지 여부
    }),
    getters: {
    },
    actions: {
        // 피드 목록 초기화
        resetFeedList() {
            this.feedList = [];
            this.page = 0;
            this.noContents = false;
        },

        async getFeedList(id) {
            if (this.noContents) return;

            if (this.loading) return;
            this.loading = true;
            try {
                const response = await $axios.get(`feed/cafe/${id}`, {
                    params: {
                        page: this.page,
                        size: this.size,
                    }
                });

                if (response.data.data.hasNext === false) {
                    this.noContents = true;
                }

                const {content} = response.data.data; // content 배열

                // 서버 데이터를 ArticleList에서 요구하는 형태로 변환
                const newFeedList = content.map(item => ({
                    id: item.feedId,
                    nickname: item.nickname,
                    memberImage: item.memberImageUrl || '', // null 방어
                    content: item.content,
                    rating: item.grade,            // Vue 템플릿에서 article.rating 사용
                    period: item.createDate,       // "YYYY-MM-DD" 문자열
                    likes: item.likes,             // 좋아요 수
                    attachments: item.imageTagList || [], // 이미지가 들어있는 배열
                    showComments: false,           // 댓글창 펼침 여부
                    newComment: {content: ''},   // 새 댓글 작성 폼
                    comments: [],                  // 실제 댓글 목록
                    commentPage: 0,                // 댓글 페이지
                    isLike: item.like,           // 좋아요 여부
                    isMine: item.mine,           // 내가 작성한 글 여부
                }));
                // 첫 페이지면 교체, 이후 페이지면 기존 배열에 추가
                if (this.page === 0) {
                    this.feedList = newFeedList;
                } else {
                    this.feedList.push(...newFeedList);
                }
                this.page++;

            } catch (err) {
                this.error = '게시글을 불러올 수 없습니다.';
            } finally {
                this.loading = false;
            }
        },
    }
});