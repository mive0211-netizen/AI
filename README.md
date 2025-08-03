# AI Academy 웹사이트

AI 강의 신청 사이트로, 파이어베이스를 연동한 관리자 대시보드를 포함합니다.

## 주요 기능

### 🎯 메인 페이지
- 반응형 디자인
- 신청하기 버튼이 있는 모달 폼
- 파이어베이스 연동으로 데이터 저장

### 📊 관리자 대시보드
- 실시간 신청 현황 통계
- 신청 목록 조회 및 관리
- 상세 정보 보기
- 검토 상태 관리
- 신청 삭제 기능

## 설정 방법

### 1. Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. 새 프로젝트 생성
3. Firestore Database 활성화
4. 웹 앱 추가

### 2. Firebase 설정
`firebase-config.js` 파일에서 Firebase 설정을 업데이트하세요:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 3. Firestore 보안 규칙 설정
Firestore Database > 규칙에서 다음 규칙을 설정하세요:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /applications/{document} {
      allow read, write: if true; // 개발용 (실제 운영 시 인증 추가 필요)
    }
  }
}
```

## 파일 구조

```
Project/
├── index.html              # 메인 페이지
├── admin-login.html        # 관리자 로그인 페이지
├── admin-dashboard.html    # 관리자 대시보드
├── firebase-config.js      # Firebase 설정
├── admin-script.js         # 관리자 대시보드 스크립트
└── README.md              # 프로젝트 설명서
```

## 사용 방법

### 메인 페이지
1. `index.html` 파일을 웹 브라우저에서 열기
2. "신청하기" 버튼 클릭
3. 폼 작성 후 제출
4. 데이터가 Firebase에 자동 저장

### 관리자 대시보드
1. 메인 페이지 우상단 "관리자" 버튼 클릭
2. 관리자 로그인 페이지에서 비밀번호 `000000` 입력
3. 로그인 성공 시 관리자 대시보드로 이동
4. 신청 현황 및 통계 확인
5. 신청 목록에서 상세보기, 검토, 삭제 가능
6. 우상단 "로그아웃" 버튼으로 세션 종료

## 주요 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: Firebase Firestore
- **UI/UX**: 반응형 디자인, 모던 UI
- **Animation**: CSS3 Animations, Intersection Observer API

## 기능 상세

### 신청 폼
- 이름, 이메일, 휴대폰, 신청동기 입력
- 실시간 유효성 검사
- Firebase 실시간 저장

### 관리자 기능
- **통계 대시보드**: 총 신청, 신규, 오늘, 이번 주 신청 수
- **신청 목록**: 날짜순 정렬, 상태별 필터링
- **상세 보기**: 전체 신청 정보 모달 표시
- **상태 관리**: 검토 완료/미완료 토글
- **삭제 기능**: 신청 데이터 영구 삭제

## 보안 고려사항

현재 설정은 개발용으로 모든 사용자가 읽기/쓰기가 가능합니다. 실제 운영 시에는:

1. Firebase Authentication 추가
2. 관리자 권한 검증
3. 적절한 보안 규칙 설정
4. HTTPS 사용

## 문제 해결

### Firebase 연결 오류
- Firebase 설정이 올바른지 확인
- 인터넷 연결 상태 확인
- 브라우저 콘솔에서 오류 메시지 확인

### 데이터가 표시되지 않음
- Firestore Database가 활성화되었는지 확인
- 보안 규칙이 올바르게 설정되었는지 확인
- 브라우저 캐시 삭제 후 재시도

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 