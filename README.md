# Youtube Summarize Tool: Digest
- 유튜브 URL을 넣으면 내용을 요약하여 개인 스페이스에 추가할 수 있습니다.
- 요약된 내용을 수정하거나, 삭제할 수 있습니다.
- 개인 스페이스에 추가된 요약본을 팀 스페이스에 추가하고, 팀 스페이스에 다른 유저를 초대하여 요약본을 공유할 수 있습니다.
<img width="650" alt="image" src="https://github.com/gitFILO/oss_final_project/assets/109865133/50c1d6e9-33b9-4488-962a-1b87aa47a654">

  - 한줄 요약, 전체 요약을 통한 빠른 내용 파악
  - 요약과 동영상을 동시 제공
  - 자동 생성된 타임 라인을 클릭하면 해당 부분의 동영상을 바로 재생
  - 키워드 분석을 통한 내용 구체화

# Basic Architecture
<img width="628" alt="image" src="https://github.com/gitFILO/oss_final_project/assets/109865133/795a8f4f-4d80-4690-a4f2-eb279399782b">

- Shadcn UI
- Next Auth 5/beta
- Tailwindcss

#  Getting Started

## 1. 관련 패키지 설치
```bash
npm i
```
## 2. DB 연결 및 마이그레이션
  - PostgreSQL 설치 및 연결
  - 참고 링크(MacOS): https://velog.io/@jochedda/Mac-OS-PostgreSQL-%EC%84%A4%EC%B9%98-%EB%B0%8F-%EC%A0%91%EC%86%8D-DBeaver-%EC%99%80-%EC%97%B0%EA%B2%B0%ED%95%98%EA%B8%B0
  ```
  # env.local 예시 - 포트번호: 5432, DB 이름: cjk
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cjk?search_path=public"
  ```
  - DBeaver 예시
    
    <img width="354" alt="image" src="https://github.com/gitFILO/oss_final_project/assets/109865133/56598639-f639-4aa5-89fc-c4e544f8fa81">

- 스크립트 명령어를 통해 마이그레이션 진행
  <img width="846" alt="image" src="https://github.com/gitFILO/oss_final_project/assets/109865133/397c4b53-0aca-4e51-9b5f-f3580f43aad4">
  ```
  # db를 리셋하고 싶은 경우
  npm run db:reset
  ```
## 3. env.local 변수 추가

- Next-Auth 5에 사용되는 Github, Google 로그인 토큰을 발급받아 env.local에 추가
  ```
  # env.local
  GITHUB_ID=
  GITHUB_SECRET=

  GOOGLE_ID=
  GOOGLE_SECRET=
  ```

- JWT 토큰에 사용되는 AUTH_SECRET 추가: ```openssl rand -base64 32 ``` 결과를 AUTH_SECRET에 추가
  ```
  # env.local
  AUTH_SECRET=
  ```
- OpenAI API 키를 발급받아 env.local에 추가: 만약 무료 할당량이 없다면 ```x1xgudwls@naver.com```로 메일 요청 바랍니다.
  ```
  # env.local
  OPENAI_API_KEY=
  ```

- ```nodemailer```라이브러리 사용을 위해 구글 이메일 입력
  ```
  # env.local
  USER_EMAIL=
  ```
  - 만약 2단계 인증이 있는 경우, 다음 링크에 적힌 내용을 통해 PASS 키 생성하여 추가: https://minu0807.tistory.com/155
  ```
  # env.local
  PASS=
  ```

- 그 외
  ```
  # env.local
  NEXT_PUBLIC_APP_URL="http://localhost:3000" # 포트번호 주의!
  
  ```
## 4. 실행
```bash
npm run dev
```
## 사용 예시
### 개인 스페이스
1. 유튜브 url 붙여넣기 후 digest 버튼 클릭
2. 요약이 완료되면, 개인 스페이스 클릭
3. 유튜브를 요약한 내용과 타임라인이 포함된 요약본 확인

https://github.com/gitFILO/oss_final_project/assets/109865133/5eef6367-ecde-4a05-8703-9fafea1cf198

### 팀 스페이스
1. 팀 스페이스 생성
2. 개인 스페이스에 저장된 요약본을 팀 스페이스에 추가하여 공유

https://github.com/gitFILO/oss_final_project/assets/109865133/1c3b50a8-fbfd-4229-9740-20dc41c5be65

### 팀 스페이스 초대
1. 내가 만든 팀 스페이스에 초대할 계정 입력
2. 초대받은 계정의 이메일로 온 인증 코드를 입력하여 초대 수락
3. 초대된 팀 스페이스에서 요약된 내용을 공유

https://github.com/gitFILO/oss_final_project/assets/109865133/930fa2c0-3180-428a-9998-825d49fb42cb



# Reference
https://github.com/gitFILO/digest

## TODO List
- next-auth로 로그인 구현
- postgreSQL 연결
- Drizzle ORM 연결 및 마이그레이션
- Youtube API 연결
- OpenAI API 연결
- 데이터 파이프라인 구축
- 팀 스페이스 관련 내용 추가
