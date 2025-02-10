import sys
import os
import re
import pandas as pd
from selenium import webdriver
from bs4 import BeautifulSoup
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from selenium.webdriver.chrome.options import Options

def initialize_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver

def get_review_url(product_url):
    product_id_match = re.search(r'/(\d+)/buy', product_url)
    if product_id_match:
        return f'https://www.myntra.com/reviews/{product_id_match.group(1)}'
    print("Invalid product URL format")
    return None

def scroll_and_scrape(driver, review_url, max_reviews=200):
    try:
        driver.get(review_url)
        WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, 'user-review-reviewTextWrapper'))
        )
        
        review_texts = []
        star_ratings = []
        last_count = 0
        
        while len(review_texts) < max_reviews:
            reviews = driver.find_elements(By.CLASS_NAME, 'user-review-reviewTextWrapper')
            if not reviews:
                print("No reviews found after scrolling")
                break
                
            try:
                driver.execute_script("arguments[0].scrollIntoView();", reviews[-1])
            except IndexError:
                break
                
            time.sleep(2) 
            
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            new_reviews = soup.find_all('div', class_='user-review-reviewTextWrapper')
            new_ratings = soup.find_all('span', class_='user-review-starRating')
            
            if len(new_reviews) == last_count:
                print("No more reviews loading")
                break
                
            last_count = len(new_reviews)
            review_texts = [r.get_text(strip=True) for r in new_reviews][:max_reviews]
            star_ratings = [s.get_text(strip=True) for s in new_ratings][:max_reviews]

        return review_texts, star_ratings
        
    except Exception as e:
        print(f"Error during scraping: {str(e)}")
        return [], []

def scrape_reviews_from_product_url(product_url, max_reviews=200):
    driver = None
    try:
        review_url = get_review_url(product_url)
        if not review_url:
            return None, None
            
        driver = initialize_driver()
        review_texts, star_ratings = scroll_and_scrape(driver, review_url, max_reviews)
        
        # Create DataFrame and save
        df = pd.DataFrame({'Review': review_texts, 'Stars': star_ratings})
        df.to_csv(os.path.join("data", "myntra_reviews.csv"), index=False)
        return df
        
    finally:
        if driver:
            driver.quit() 

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <product_url>")
        sys.exit(1)
        
    product_url = sys.argv[1]
    scrape_reviews_from_product_url(product_url)