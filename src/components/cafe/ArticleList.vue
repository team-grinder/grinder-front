<template>
  <v-container class="pa-4">
    <v-row
        v-for="(article, aIndex) in articles"
        :key="article.id"
        class="mb-4"
    >
      <v-col>
        <v-card class="pa-3" elevation="2">
          <v-card-title>
            <v-avatar>
              <v-img
                  :src="!!article.memberImage ? article.memberImage : defaultImage"
                  alt="회원 이미지"
                  cover
              />
            </v-avatar>

            <strong class="pa-5">{{ article.memberName }}</strong>
            <span class="text-caption text-gray-500">
                {{ article.period }}
            </span>

            <div class="text-caption text-gray-500 ">평점:
              <template v-for="n in 5" :key="n">
                <v-icon
                    v-if="n <= article.rating"
                    color="yellow"
                    size="24"
                    density="compact"
                >
                  mdi-star
                </v-icon>
                <v-icon
                    v-else
                    color="yellow"
                    size="24"
                    density="compact"
                >
                  mdi-star-outline
                </v-icon>
              </template>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <div class="mb-2">
              {{ article.content }}
            </div>

            <!-- 첨부 이미지 영역 -->
            <div class="d-flex flex-column mt-3">
              <v-row class="flex-row">
                <v-col
                    class="d-flex justify-center align-center"
                    v-for="(image, index) in visibleImages(article)"
                    :key="index"
                >
                  <v-img
                      :src="image"
                      contain
                      max-height="150"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- 좋아요와 댓글 버튼 -->
            <div class="d-flex justify-end align-center mt-2">
              <div>
                <v-btn
                    class=""
                    color="green-darken-1"
                    icon="mdi-thumb-up"
                    variant="text"
                    @click="likeArticle(aIndex)"
                ></v-btn>
                <span>{{ article.likes }}</span>
              </div>
              <div>
                <v-btn
                    class=""
                    color="green-darken-1"
                    icon="mdi-comment-outline"
                    variant="text"
                    @click="toggleComments(aIndex)"
                ></v-btn>
                <span>{{ article.comments.length }}</span>
              </div>
            </div>

            <div v-if="article.showComments" class="mt-4 pa-2">
              <div
                  v-for="(comment, cIndex) in article.comments"
                  :key="cIndex"
                  class="pa-3 mb-2"
                  style="border: 1px solid #ccc; border-radius: 4px;"
              >
                <div class="d-flex align-center mb-2">
                  <v-avatar size="32">
                    <v-img
                        :src="!!comment.memberImage ? comment.memberImage : defaultImage"
                        alt="댓글 작성자 프로필"
                        cover
                    />
                  </v-avatar>
                  <span class="ml-2 font-weight-medium">
                    {{ comment.memberName }}
                  </span>
                  <v-spacer></v-spacer>
                </div>

                <div>{{ comment.content }}</div>

                <!-- 좋아요와 댓글 버튼 -->
                <div class="d-flex justify-end align-center mt-2">
                  <div class="pa-2">
                    <v-btn
                        class=""
                        color="green-darken-1"
                        icon="mdi-comment-outline"
                        variant="text"
                        @click="toggleReplies(aIndex, cIndex)"
                    ></v-btn>
                    <span>{{ comment.replies.length }}</span>
                  </div>
                </div>

                <div
                    v-if="comment.showReplies"
                    class="mt-2 ml-4"
                >
                  <div
                      v-for="(reply, rIndex) in comment.replies"
                      :key="rIndex"
                      class="pa-2 mb-1"
                      style="border-left: 3px solid #999;"
                  >
                    <div class="d-flex align-center mb-1">
                      <v-avatar size="24">
                        <v-img
                            :src="!!reply.memberImage ? reply.memberImage : defaultImage"
                            alt="대댓글 작성자 프로필"
                            cover
                        />
                      </v-avatar>
                      <span class="ml-1">
                        {{ reply.memberName }}
                      </span>
                    </div>
                    <div class="ml-3">{{ reply.content }}</div>
                  </div>

                  <div
                      class="d-flex align-center mt-2"
                      v-if="isAuthenticated">
                    <v-text-field
                        v-model="comment.newReply.content"
                        label="대댓글 작성"
                        variant="outlined"
                        density="compact"
                        class="mr-2 flex-grow-1"
                    />
                    <v-btn
                        color="green-darken-1"
                        @click="addReply(aIndex, cIndex)"
                    >
                      등록
                    </v-btn>
                  </div>
                </div>
              </div>

              <div
                  class="d-flex align-center mt-4"
                  v-if="isAuthenticated">
                <v-text-field
                    v-model="article.newComment.content"
                    label="댓글 작성"
                    variant="outlined"
                    density="compact"
                    class="mr-2 flex-grow-1"
                />
                <v-btn
                    color="green-darken-1"
                    @click="addComment(aIndex)"
                >
                  등록
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import defaultImage from "@/assets/images/basic-user-img.png";

export default {
  name: 'ArticleList',
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
  },
  data() {
    return {
      defaultImage: defaultImage,
      articles: [
        {
          id: 1,
          memberName: "홍길동",
          memberImage: "",
          content: "카페가 너무 좋아요!",
          rating: 4.5,
          period: "2025-01-01",
          likes: 2,
          showComments: false, // 댓글 영역 토글
          newComment: {
            memberName: "",    // 새 댓글 작성 시 입력
            memberImage: "",
            content: "",
          },
          attachments: [
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
          ],
          currentImageIndex: 0,
          comments: [
            {
              memberName: "김영희",
              memberImage: "",
              content: "저도 동감합니다!",
              showReplies: false,
              newReply: {
                memberName: "",
                memberImage: "",
                content: "",
              },
              replies: [
                {
                  memberName: "이철수",
                  memberImage: "",
                  content: "저도 좋아요!",
                  showReplies: false,
                  newReply: { memberName: "", memberImage: "", content: "" },
                  replies: []
                }
              ]
            },
          ]
        },
      ]
    };
  },
  methods: {
    // 새 댓글 등록
    addComment(articleIndex) {
      const article = this.articles[articleIndex];
      const { memberName, memberImage, content } = article.newComment;
      if (memberName.trim() && content.trim()) {
        // 새 댓글 객체 생성
        const newC = {
          memberName: memberName.trim(),
          memberImage: memberImage.trim(),
          content: content.trim(),
          showReplies: false,
          newReply: { memberName: "", memberImage: "", content: "" },
          replies: [],
        };
        article.comments.push(newC);
        // 입력 폼 초기화
        article.newComment = { memberName: "", memberImage: "", content: "" };
      }
    },

    // 대댓글 토글
    toggleReplies(articleIndex, commentIndex) {
      const comment = this.articles[articleIndex].comments[commentIndex];
      comment.showReplies = !comment.showReplies;
    },

    // 대댓글 등록
    addReply(articleIndex, commentIndex) {
      const comment = this.articles[articleIndex].comments[commentIndex];
      const { memberName, memberImage, content } = comment.newReply;
      if (memberName.trim() && content.trim()) {
        // 새 대댓글 객체 생성
        const newR = {
          memberName: memberName.trim(),
          memberImage: memberImage.trim(),
          content: content.trim(),
          showReplies: false,
          newReply: { memberName: "", memberImage: "", content: "" },
          replies: [],
        };
        comment.replies.push(newR);
        // 입력 폼 초기화
        comment.newReply = { memberName: "", memberImage: "", content: "" };
      }
    },

    likeArticle(articleIndex) {
      this.articles[articleIndex].likes++;
    },
    toggleComments(articleIndex) {
      this.articles[articleIndex].showComments =
          !this.articles[articleIndex].showComments;
    },
    prevImage(article) {
      if (article.currentImageIndex > 0) {
        article.currentImageIndex--;
      }
    },
    nextImage(article) {
      if (article.currentImageIndex + 4 < article.attachments.length) {
        article.currentImageIndex++;
      }
    },
    visibleImages(article) {
      return article.attachments.slice(
          article.currentImageIndex,
          article.currentImageIndex + 4
      );
    },
  },
};
</script>