import axios from 'axios';

const $axios = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 0,
    withCredentials: true, // 쿠키 포함
});

// 응답 인터셉터 설정
$axios.interceptors.response.use(
    response => {
        // 요청 시 커스텀 옵션이 있다면 내부 데이터만 반환
        if (response.config.returnInner) {
            return response.data && response.data.data !== undefined
                ? response.data.data
                : response.data;

        }
        return response;
    },
    error => {
        // 에러 응답 처리
        if (error.response) {
            // 서버 응답이 있는 경우
            const status = error.response.status;
            switch (status) {
                case 401:
                    // 예: 인증 실패 시 로그인 페이지로 리다이렉트
                    console.error('Unauthorized, redirecting to login...');
                    // window.location = '/login';
                    break;
                case 403:
                    console.error('Forbidden request.');
                    break;
                case 500:
                    console.error('Internal Server Error.');
                    break;
                default:
                    console.error(`Error status: ${status}`);
            }
        } else if (error.request) {
            // 요청이 이루어졌으나 응답을 받지 못함
            console.error('Network error or no response received.');
        } else {
            // 기타 오류
            console.error('Error', error.message);
        }
        // 필요시 Promise.reject로 에러를 반환하여 개별 요청에서도 추가 처리를 할 수 있도록 함
        return Promise.reject(error);
    }
);

export default $axios;