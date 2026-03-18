import os
import asyncio
import pandas as pd
from datetime import datetime, timedelta
from dotenv import load_dotenv
from playwright.async_api import async_playwright

# 설정 로드
load_dotenv()

USER_ID = os.getenv("USER_ID")
USER_PW = os.getenv("USER_PW")
TARGET_URL = os.getenv("TARGET_URL")
STATE_FILE = "state.json"

async def login(page):
    """자동 로그인 수행 및 세션 저장"""
    print(f"로그인 시도 중... (ID: {USER_ID})")
    await page.goto(TARGET_URL)
    
    # 사이트 구조에 맞게 셀렉터 수정 필요
    await page.fill("#user_id", USER_ID) 
    await page.fill("#user_pw", USER_PW)
    await page.click("button[type='submit']")
    
    # 로그인 완료 대기 (성공 후 나타나는 요소 기준)
    await page.wait_for_selector(".logout-button", timeout=10000)
    print("로그인 성공!")

async def scrape_data(page, date_str):
    """특정 날짜의 데이터 스크래핑"""
    print(f"[{date_str}] 데이터 수집 중...")
    
    # 1. 날짜 선택 로직 (URL 파라미터 또는 달력 클릭)
    # 예: await page.goto(f"{TARGET_URL}?date={date_str}")
    
    # 2. 데이터 추출 (테이블 구조 가정)
    rows = await page.query_selector_all("table tr")
    data_list = []
    
    for row in rows[1:]:  # 헤더 제외
        cols = await row.query_selector_all("td")
        if len(cols) >= 3:
            data_list.append({
                "Date": date_str,
                "Category": await cols[0].inner_text(),
                "Name": await cols[1].inner_text(),
                "Value": await cols[2].inner_text(),
            })
    
    return data_list

async def main():
    async with async_playwright() as p:
        # 브라우저 실행
        browser = await p.chromium.launch(headless=False) # 디버깅을 위해 False
        
        # 세션 유지 여부 확인
        if os.path.exists(STATE_FILE):
            context = await browser.new_context(storage_state=STATE_FILE)
            print("기존 세션 로드 완료.")
        else:
            context = await browser.new_context()
            page = await context.new_page()
            await login(page)
            await context.storage_state(path=STATE_FILE)
            print("새로운 세션 저장 완료.")

        page = await context.new_page()
        
        # 날짜 범위 설정
        start_date = datetime.strptime(os.getenv("START_DATE", "2026-03-01"), "%Y-%m-%d")
        end_date = datetime.strptime(os.getenv("END_DATE", "2026-03-18"), "%Y-%m-%d")
        
        all_data = []
        current_date = start_date
        
        while current_date <= end_date:
            date_str = current_date.strftime("%Y-%m-%d")
            day_data = await scrape_data(page, date_str)
            all_data.extend(day_data)
            current_date += timedelta(days=1)

        # 엑셀 가공 및 저장
        if all_data:
            df = pd.DataFrame(all_data)
            output_file = f"Raw_Data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            
            # Pandas 스타일링 및 저장
            with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='RawData')
                
            print(f"최종 결과 저장 완료: {output_file}")
        else:
            print("수집된 데이터가 없습니다.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
