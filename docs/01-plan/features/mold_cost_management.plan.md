# 금형 투자비 및 공용화 분석 대시보드 (Parts Management Dashboard) Plan Document

> Version: 1.0.0 | Created: 2026-03-20 | Status: Draft

## 1. Executive Summary
본 프로젝트는 사내 금형 투자비 관리의 효율성을 높이고, 부품 공용화 현황을 직관적으로 분석하기 위한 로컬 전용 대시보드를 구축하는 것을 목표로 합니다. 보안을 최우선으로 하여 외부 서버 전송 없이 브라우저 내에서 엑셀 데이터를 정규화 및 시각화합니다.

## 2. Goals and Objectives
- **보안성 확보**: 100% 로컬 클라이언트 사이드 데이터 처리를 통한 정보 유출 방지.
- **데이터 정규화**: 비정식 엑셀 데이터(계층 구조)의 자동 복원 및 분석 기반 마련.
- **다차원 분석**: 차종별/시스템별 투자비 및 부품 수 기반의 KPI 시각화.
- **의사결정 지원**: 가상 시뮬레이션을 통한 투자비 절감액 예측 기능 제공.

## 3. Scope
### In Scope
- `SheetJS` 기반 엑셀 파일 로컬 파싱 및 `Forward-fill` 정규화.
- `Chart.js`를 이용한 시스템 비중(Donut) 및 상세 분석(Bar) 차트.
- 차종별/시스템별, 비용/수량 단위 토글 기능.
- 실시간 시뮬레이션 및 데이터 유효성 검사(Validation).
- 새로운 폴더(`mold_cost_management`) 내 독립적인 프로젝트 구성.

### Out of Scope
- 외부 서버 DB 연동 및 로그인 기능.
- 엑셀 파일 외 타 포맷(PDF, CSV 등) 지원.
- 실시간 협업 기능 (로컬 파일 기반이므로 제외).

## 4. Success Criteria
| Criterion | Metric | Target |
|-----------|--------|--------|
| 데이터 정규화 정확도 | 원본 엑셀 행 수 대비 복원 성공률 | 100% |
| 보안성 | 외부 네트워크 호출 발생 여부 | 0건 (완전 차단) |
| 분석 유연성 | 측정 기준 및 관점 전환 속도 | 즉시 (실시간) |
| 시뮬레이션 연동 | 상태 변경 시 KPI 업데이트 정확도 | 수식 일치 여부 확인 |

## 5. Timeline
| Milestone | Date | Description |
|-----------|------|-------------|
| Plan & Design | Day 1 (현재) | bkit 표준 계획 및 설계 문서 작성 |
| Core Implementation | Day 1 | 엑셀 엔진 및 KPI 대시보드 UI 개발 |
| Simulation Feature | Day 1 | 인터랙티브 리스트 및 시뮬레이션 로직 구현 |
| Final Check & Report | Day 1 | PDCA 검증 및 완료 보고서 작성 |

## 6. Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| 엑셀 포맷 변경 | 데이터 파싱 오류 발생 가능성 | 컬럼명 기반의 유연한 매핑 로직 적용 |
| 대용량 데이터 성능 | 브라우저 렌더링 지연 | 가상 스크롤 또는 페이징 처리 검토 |
| 브라우저 호환성 | 차트 미출력 등 UI 깨짐 | 최신 Chrome/Edge 브라우저 최적화 가이드 제공 |
