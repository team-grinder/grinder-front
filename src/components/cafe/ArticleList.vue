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

            <div class="d-flex flex-row align-center">
              <v-avatar>
                <v-img
                    :src="!!article.memberImage ? article.memberImage : defaultImage"
                    alt="회원 이미지"
                    cover
                />
              </v-avatar>
              <strong class="pl-5 pr-5">{{ article.nickname }}</strong>
              <span class="text-caption text-gray-500">
                {{ article.period }}
              </span>
              <v-spacer></v-spacer>
              <v-icon v-if="article.nickname === nickname">
                mdi-dots-vertical
              </v-icon>
            </div>

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
                  class="pa-3 mb-2 border-thin rounded-lg"
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
                    {{ comment.nickname }}
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
                        {{ reply.nickname }}
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
                        hide-details="auto"
                        class="mr-2"
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
                    hide-details="auto"
                    class="mr-2"
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
    articles: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      defaultImage: defaultImage,
    };
  },
  methods: {
    // 새 댓글 등록
    addComment(articleIndex) {
      const article = this.articles[articleIndex];
      const { content } = article.newComment;
      if (content.trim()) {
        // 새 댓글 객체 생성
        const newC = {
          nickname: this.nickname,
          memberImage: this.imageUrl,
          content: content.trim(),
          showReplies: false,
          newReply: { content: "" },
          replies: [],
        };
        article.comments.push(newC);
        // 입력 폼 초기화
        article.newComment = { content: "" };
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
      const { content } = comment.newReply;
      if (content.trim()) {
        // 새 대댓글 객체 생성
        const newR = {
          nickname: this.nickname,
          memberImage: this.imageUrl,
          content: content.trim(),
          showReplies: false,
          newReply: { content: "" },
          replies: [],
        };
        comment.replies.push(newR);
        // 입력 폼 초기화
        comment.newReply = { content: "" };
      }
    },

    likeArticle(articleIndex) {
      this.$props.articles[articleIndex].likes++;
    },
    toggleComments(articleIndex) {
      this.$props.articles[articleIndex].showComments =
          !this.articles[articleIndex].showComments;
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