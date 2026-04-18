# BookBTI API Server

## 배포 전 Vercel 환경변수 설정 필요

```bash
vercel env add NAVER_CLIENT_ID
# 값: 네이버 개발자센터에서 재발급한 Client ID 입력

vercel env add NAVER_CLIENT_SECRET  
# 값: 재발급한 Client Secret 입력
```

## 엔드포인트

### GET /api/naver
네이버 Book Search API 프록시 (Client Secret 보호)

- `?query=검색어` — 키워드 검색
- `?isbn=9788...` — ISBN으로 상세 조회
- `?display=10` — 결과 수 (기본 10)

### GET /api/aladin
(기존 알라딘 API - 사용 중단 예정)

## 주의사항
- 네이버 API 키를 코드에 직접 넣지 마세요
- Vercel 환경변수로만 관리하세요
