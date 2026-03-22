# 금형 투자비 및 공용화 분석 대시보드 (Mold Cost Management) Design Document

> Version: 1.0.0 | Created: 2026-03-20 | Status: Draft

## 1. Overview
본 문서는 `mold_cost_management` 프로젝트의 시스템 아키텍처, 데이터 흐름, UI/UX 설계를 정의합니다. 100% 로컬 클라이언트 환경에서 동작하며, 정규화되지 않은 엑셀 데이터를 분석 가능한 형태로 변환하는 로직을 핵심으로 합니다.

## 2. System Architecture
- **Environment**: Web Browser (Local File Access)
- **Library**: 
  - `xlsx (SheetJS)`: Excel parsing & normalization
  - `Chart.js`: Data visualization
  - `Lucide Icons`: UI iconography
- **State Management**: Browser memory (Native JS objects)

## 3. Data Flow & Normalization
### 3.1. Data Normalization (Forward-fill)
엑셀의 병합된 셀이나 계층 구조를 플랫(Flat)한 데이터 구조로 변환합니다.
- **Input**: `[[ 'A', 'B', 'C' ], [ '', '', 'D' ], [ '', 'E', 'F' ]]`
- **Logic**: 이전 행의 값을 유지하며 빈 셀을 채움.
- **Output**: `[{ col1: 'A', col2: 'B', col3: 'C' }, { col1: 'A', col2: 'B', col3: 'D' }, { col1: 'A', col2: 'E', col3: 'F' }]`

### 3.2. Mapping Schema
| Original Column | Logic | Target Property |
|-----------------|-------|-----------------|
| 차종/기종 | Forward-fill | `model` |
| 시스템 | Forward-fill | `system` |
| 부품명 | Direct | `partName` |
| 투자비 (원) | Numeric parse | `cost` |
| 수량 | Numeric parse | `quantity` |

## 4. UI/UX Design
### 4.1. Dashboard Layout
- **Header**: 파일 업로드 버튼, 전체 KPI (총 투자비, 총 부품 수, 공용화율).
- **Middle (Charts)**:
  - Left: 시스템별 투자비 비중 (Donut Chart)
  - Right: 차종별 투자비/수량 분석 (Bar Chart)
- **Bottom (Table & Simulation)**: 
  - 정규화된 데이터 리스트.
  - 행별 '공용화 여부' 토글 시 KPI 및 차트 실시간 업데이트.

### 4.2. UI Components
- **Upload Zone**: Drag & Drop 지원하는 대형 드롭존.
- **KPI Cards**: 카드 형태의 수치 강조 섹션.
- **Filter Bar**: 차종/시스템별 멀티 셀렉트 필터.

## 5. Implementation Strategy
1. **Core Parser**: `SheetJS`를 이용해 원본 데이터를 가져오고 `Forward-fill` 수행.
2. **Analysis Engine**: 정규화된 데이터를 바탕으로 시스템별/차종별 집계.
3. **UI Sync**: 데이터 상태 변경 시 `Chart.js` 인스턴스 갱신.
4. **Validation**: 엑셀 형식 오류 발생 시 상세 가이드 표시.

## 6. Constraints & Security
- 모든 연산은 로컬(Browser)에서 수행. `window.fetch` 등을 통한 외부 통신 엄격히 배제.
- 데이터는 브라우저 새로고침 시 소멸 (보안상 영구 저장 지양).
