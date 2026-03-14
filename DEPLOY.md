# Cloudflare Pages 배포 가이드

> **nginx가 필요한가요?**  
> 아니요. Cloudflare Pages는 정적 파일(HTML, CSS, JS)을 직접 CDN으로 제공합니다.  
> 별도 웹서버 없이 `wrangler`로 업로드만 하면 됩니다.

---

## 1. 사전 준비

- [Cloudflare](https://dash.cloudflare.com) 계정
- Node.js 설치

## 2. 프로젝트 생성 (최초 1회)

Cloudflare 대시보드에서:

1. **Workers & Pages** → **Create application** → **Pages**
2. **Direct Upload** 선택
3. 프로젝트 이름: `tantanfilm` (또는 원하는 이름)
4. 생성 완료

## 3. 배포 방법

### 방법 A: Wrangler CLI (추천)

```bash
# 1. 로그인
npx wrangler login

# 2. 의존성 설치
npm install

# 3. 배포 (프로젝트 이름이 다르면 --project-name 변경)
npm run deploy
```

### 방법 B: GitHub 연동

1. GitHub에 저장소 푸시
2. Cloudflare 대시보드 → **Pages** → **Create** → **Connect to Git**
3. 저장소 선택
4. 설정:
   - **Build command**: 비워두기 (또는 `echo "no build"`)
   - **Build output directory**: `/` (프로젝트 루트)

---

## 4. 빌드 출력 구조

현재 프로젝트는 이미 정적 사이트 구조입니다. 루트를 그대로 배포합니다.

```
탄탄필름/
├── index.html
├── about.html
├── film.html
├── product.html
├── reservation.html
├── css/
├── js/
├── img/
└── video/
```

## 5. 배포 후

- `https://tantanfilm.pages.dev` 형태로 접속 가능
- 커스텀 도메인은 Pages 프로젝트 설정에서 연결 가능
