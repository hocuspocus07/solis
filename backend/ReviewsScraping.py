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
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver

#getting review url (made by analysing a pattern in links)
def get_review_url(product_url):
    product_id_match = re.search(r'/(\d+)/buy', product_url)
    
    if product_id_match:
        product_id = product_id_match.group(1)
        review_url = f'https://www.myntra.com/reviews/{product_id}'
        return review_url
    else:
        print("Invalid product URL. Could not extract product ID.")
        return None

def scroll_and_scrape(driver, review_url, max_reviews=200):
    driver.get(review_url)
    try:
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, 'user-review-reviewTextWrapper')))
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, 'user-review-starRating')))
        time.sleep(2)
    except Exception as e:
        print(f"Error while waiting for elements: {e}")

    review_texts = []
    star_ratings = []

    while len(review_texts) < max_reviews:
        last_review = driver.find_elements(By.CLASS_NAME, 'user-review-reviewTextWrapper')[-1]
        driver.execute_script("arguments[0].scrollIntoView();", last_review)
        time.sleep(2)

        
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        reviews = soup.find_all('div', class_='user-review-reviewTextWrapper')
        ratings = soup.find_all('span', class_='user-review-starRating')

       
        if len(reviews) == len(review_texts):
            break
        
        
        review_texts = [review.get_text(strip=True) for review in reviews]
        star_ratings = [rating.get_text(strip=True) for rating in ratings]
    
    
    review_texts = review_texts[:max_reviews]
    star_ratings = star_ratings[:max_reviews]

    return review_texts, star_ratings


def scrape_reviews_from_product_url(product_url, max_reviews=1000):
    review_url = get_review_url(product_url)
    
    if review_url is None:
        return None, None
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    review_texts, star_ratings = scroll_and_scrape(driver, review_url, max_reviews)
    if len(review_texts) != len(star_ratings):
        min_len = min(len(review_texts), len(star_ratings))
        review_texts = review_texts[:min_len]
        star_ratings = star_ratings[:min_len]

    data = {
        'Review': review_texts,
        'Stars': star_ratings
    }
    df = pd.DataFrame(data)
    df.to_csv(os.path.join("data", "myntra_reviews.csv"), index=False)

    driver.quit()

    return df


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(1)

    product_url = sys.argv[1]
    scrape_reviews_from_product_url(product_url)






