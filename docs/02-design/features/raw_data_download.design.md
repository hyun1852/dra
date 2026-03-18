# [Design] Raw Data 자동 다운로드 및 엑셀 가공 프로그램

## 1. 개요 (Executive Summary)
| 항목 | 내용 |
| --- | --- |
| **기능명** | Raw Data 자동 다운로드 및 엑셀 가공 |
| **작성일** | 2026-03-18 |
| **상태** | 🎨 Designing |
| **주요 기술** | Python 3.10+, Playwright, Pandas, python-dotenv |

## 2. 시스템 아키텍처 (System Architecture)
### 2.1 프로세스 흐름 (Process Flow)
1. **Init**: `.env` 로드 및 브라우저 실행.
2. **Auth**: 세션 쿠키 확인 → 유효하지 않을 경우 로그인 수행 및 쿠키 저장.
3. **Scrape**: 설정된 날짜 범위(Start ~ End)에 따라 페이지 이동 및 HTML 파싱.
4. **Transform**: 수집된 데이터를 리스트/딕셔너리 구조로 정리.
5. **Excel**: Pandas DataFrame으로 변환 후 스타일링된 `.xlsx` 파일로 저장.

## 3. 상세 모듈 설계 (Detailed Module Design)
### 3.1 Auth & Session (`auth.py`)
- **Login Logic**: 
  - `page.fill("#user_id", os.getenv("USER_ID"))`
  - `page.fill("#user_pw", os.getenv("USER_PW"))`
- **Session Persistence**: `browser.new_context(storage_state="state.json")` 활용하여 로그인 횟수 최소화.

### 3.2 Scraper Engine (`scraper.py`)
- **Date Navigation**: URL 파라미터 또는 달력 컨트롤러를 조작하여 특정 날짜 데이터 접근.
- **Data Extraction**: 테이블 행(`tr`) 데이터를 순회하며 텍스트 추출.
- **Error Handling**: 페이지 로딩 지연 대응을 위한 `wait_for_selector` 적용.

### 3.3 Data Processor (`processor.py`)
- **Cleaning**: 불필요한 특수문자 제거 및 날짜 형식 포맷팅.
- **Aggregation**: 여러 날짜의 데이터를 하나의 시트 혹은 파일로 통합.
- **Excel Output**: `df.to_excel("report.xlsx", index=False)` 및 열 너비 자동 조정.

## 4. 데이터 스키마 (Data Schema)
| 컬럼명 | 데이터 타입 | 설명 |
| --- | --- | --- |
| Date | String/DateTime | 데이터 수집 날짜 |
| Category | String | 부품 또는 시스템 분류 |
| Name | String | 항목 이름 |
| Value | Float | 투자비 또는 지표 값 |
| Status | String | 완료/진행 등 상태값 |

## 5. 로그인 접근 및 보안 가이드
- **파일 보안**: `state.json`(세션), `.env`(계정) 파일은 `.gitignore`에 반드시 등록.
- **우회 전략**: 봇 감지 사이트의 경우 `user_agent` 설정 및 클릭 간격(`delay`) 랜덤화 적용.

## 6. 검증 계획 (Validation Plan)
- **로그인 성공 여부**: `state.json` 파일 생성 및 재사용 확인.
- **날짜 정합성**: 엑셀 내의 데이터가 요청한 날짜 범위와 일치하는지 샘플링 검사.
- **엑셀 가독성**: 생성된 엑셀 파일이 엑셀 프로그램에서 오류 없이 열리는지 확인.

---
*bkit PDCA Methodology v1.5.8*
