# YouTube embed(오류 153) 해결: 로컬 서버로 실행

**오류 153**은 페이지를 **file://**로 열 때 발생합니다.  
file:// 환경에서는 Referer가 전송되지 않아 YouTube embed가 동작하지 않습니다.

## 해결 방법

반드시 **로컬 서버**를 사용해 `http://localhost` 로 접속하세요.

### 방법 1: npx serve (추천)

```bash
npx serve .
```

브라우저에서 `http://localhost:3000/film.html` 로 접속

### 방법 2: Python

```bash
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080/film.html` 로 접속

### 방법 3: VS Code Live Server

1. Live Server 확장 설치
2. `film.html`에서 우클릭 → "Open with Live Server"

---

⚠️ **file:///Users/.../film.html** 같이 주소창에 `file://`가 보이면 오류 153이 발생합니다.  
항상 `http://localhost:...` 로 열어야 합니다.
