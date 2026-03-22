# 금형 투자비 및 공용화 분석 대시보드 (Mold Cost Management) Completion Report

> Version: 1.0.0 | Date: 2026-03-20 | Status: Completed

## 1. Executive Summary

본 문서는 `mold_cost_management` 기능의 PDCA 사이클 완료 보고서입니다. 데이터 보안을 유지하면서 정규화되지 않은 엑셀 데이터를 로컬에서 효과적으로 분석할 수 있는 기반이 마련되었습니다.

| Project | Feature | Date | Scope |
|---|---|---|---|
| 금형 투자비 관리 | 대시보드 개발 | 2026-03-20 | 프론트엔드 로컬 웹앱 |

**Results Summary:**
- **Match Rate**: 100% (기획 및 사용자 요청사항 전면 반영)
- **Completed Items**: 엑셀 파싱 엔진, 다차원 대시보드, 인터랙티브 시뮬레이터, UI/UX 애니메이션

**Value Delivered:**
| Perspective | 내용 |
|---|---|
| **Problem** | 외부 반출 불가 보안 데이터의 안전한 처리 필요 |
| **Solution** | `SheetJS` 기반 100% 로컬 엑셀 파싱 및 정규화(Forward-fill) 도입 |
| **Function UX Effect** | Drag & Drop 지원, 부드러운 애니메이션을 동반한 실시간 시뮬레이션 |
| **Core Value** | 직관적인 데이터 분석과 신속한 공용화 성과 가시화를 통한 의사결정 지원 |

## 2. Implementation Details
### 2.1. 기술 스택 및 구조
- **Frontend**: 순수 HTML/CSS/JavaScript (Vanilla) 적용으로 가벼운 구성.
- **Libraries**: `SheetJS` (엑셀 데이터 파싱), `Chart.js` (시각화), `Lucide` (아이콘).
- **Architecture**: `Empty State` (초기 안내) → `Parsing` (정규화) → `Dashboard Sync` (시뮬레이션 및 차트 연동) 파이프라인 구축.

### 2.2. 핵심 기능 달성 (Key Achievements)
1. **Excel Normalization Engine**: 계층형 엑셀 구조를 1차원 데이터로 변환하는 `Forward-fill` 로직 구현.
2. **Interactive Dashboard**:
   - 도메인, 시스템, 부품 수 등의 수치를 요약하는 KPI 그리드 뷰.
   - 차종별, 시스템별 공용화 달성률을 비교하는 동적 `Chart.js` 통합.
3. **Enhanced UI/UX**:
   - Drag & Drop으로 간편한 파일 업로드 지원.
   - 카드와 차트에 상태 업데이트 시 유연하게 반응하는 CSS 및 `Chart.js update()` 트랜지션 애니메이션 반영.
   - 피드백 수용: KPI 카드 디자인 간소화(보더 제거) 및 지표 성격에 따른 색상 구분(회색/녹색).

## 3. Retrospective (회고)
- **What went well**: 사용자 피드백(UI 개선, 드래그앤드롭 추가, 애니메이션 반영 등)을 반복적(Iteration)으로 수용하며 시스템의 완성도와 사용성을 크게 높였습니다.
- **What could be improved**: 현재는 `.xlsx` 단일 시트 데이터만을 가정하여 파싱하고 있습니다. 추후 복수 시트나 다양한 컬럼 포맷에 유연하게 대응할 수 있도록 컬럼 매핑 마법사 도입을 고려해볼 수 있습니다.
- **Next Steps**: 해당 기능을 기반으로, 추후 `parts_management` 등 다른 분석 모듈과의 데이터 통합 연계 방안을 모색할 수 있습니다.
