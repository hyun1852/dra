# [Design] 금형공용화율 관리 대시보드 고도화 (Advanced Mold Sharing Dashboard)

## 1. 개요 (Executive Summary)
| 항목 | 내용 |
| --- | --- |
| **기능명** | 금형공용화율 관리 대시보드 고도화 |
| **작성일** | 2026-03-18 |
| **상태** | 🎨 Designing |
| **주요 변경사항** | 투자비 절감액 시각화, 차종 간 공용화 매트릭스, 기여도 랭킹 시스템 |

## 2. 시스템 아키텍처 (System Architecture)
### 2.1 데이터 흐름 (Data Flow)
1. **Raw Data (`data.js`)**: 부품별 금형비 및 `sharedVehicle` 정보 로드.
2. **Logic Layer (`script.js`)**:
   - **Cost Avoidance**: `sum(moldCost where sharedVehicle != "")` 계산.
   - **Matrix Engine**: 차종 리스트를 추출하고, `targetVehicle` vs `sharedVehicle` 매핑 카운트 산출.
3. **UI Layer (`index.html`)**:
   - Tailwind CSS 기반의 3단 레이아웃.
   - CSS Grid를 활용한 반응형 매트릭스 보드.

## 3. 상세 설계 (Detailed Design)
### 3.1 투자비 절감액(Cost Avoidance) 요약 섹션
- **디자인**: 상단 Hero 섹션에 4개의 주요 카드 배치.
  - `기준투자비`: 모든 부품 신규 투자 시 비용.
  - `실제투자비`: 공용화 적용 후 실제 투자 비용.
  - `절감투자비`: 절감된 총액 (기준투자비 - 실제투자비).
  - `공용화율`: (절감투자비 / 기준투자비) * 100.

### 3.2 차종 간 공용화 매트릭스 (Vehicle Sharing Matrix)
- **구조**:
  - Y축: Borrower (금형을 빌려 쓰는 차종 - `targetVehicle`)
  - X축: Provider (금형을 빌려 주는 차종 - `sharedVehicle`)
- **로직**:
  ```javascript
  const matrix = {};
  filteredData.forEach(item => {
    if (item.sharedVehicle) {
      const borrower = item.targetVehicle;
      const provider = item.sharedVehicle;
      matrix[borrower][provider] += item.moldCost;
    }
  });
  ```
- **UI**: 셀의 배경색 농도(Heatmap)를 투자비 규모에 따라 다르게 표시.

### 3.3 시스템별 기여도 및 병목 분석 (System Contribution)
- **Top Efficiency**: 공용화율이 가장 높은 시스템 상위 3개 표시.
- **Investment Bottleneck**: 실제투자비가 가장 많이 발생하는 시스템 상위 3개 표시.

## 4. UI/UX 디자인 가이드
- **Color Palette**: Dark 모드 기반, Accent Color로 `emerald-500`(절감액) 및 `rose-500`(병목 지점) 사용.
- **Layout**:
  - `Section 1`: Summary (Cards)
  - `Section 2`: Matrix (Grid) & Contribution (List)
  - `Section 3`: Raw Data Table (기존 유지 및 필터 강화)

## 5. 검증 계획 (Validation Plan)
- **정확성 검증**: 특정 차종 필터링 시 `Cost Avoidance` 합계가 `data.js`의 개별 항목 합계와 일치하는지 확인.
- **UI 정렬**: 모바일 환경에서 매트릭스 그리드가 스크롤 가능하도록 구현되었는지 확인.

---
*bkit PDCA Methodology v1.5.8*
