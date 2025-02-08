#!/usr/bin/env python
# coding: utf-8

# In[4]:
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
    # Set up options for headless mode
    options = Options()
    options.add_argument("--headless")  # Run in headless mode (no GUI)
    options.add_argument("--disable-gpu")  # Disable GPU (not needed in headless)
    options.add_argument("--no-sandbox")  # Bypass OS security model
    options.add_argument("--disable-dev-shm-usage")

    # Initialize WebDriver with the options
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver


# In[6]:


#Function to extract review link from product link
def get_review_url(product_url):
    # Extract product ID using regular expression (number before '/buy')
    product_id_match = re.search(r'/(\d+)/buy', product_url)
    
    if product_id_match:
        product_id = product_id_match.group(1)
        # Construct the review URL
        review_url = f'https://www.myntra.com/reviews/{product_id}'
        return review_url
    else:
        print("Invalid product URL. Could not extract product ID.")
        return None


# In[8]:


def scroll_and_scrape(driver, review_url, max_reviews=200):
    # Navigate to the review URL
    driver.get(review_url)
    
    # Wait for the review elements to load
    try:
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, 'user-review-reviewTextWrapper')))
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, 'user-review-starRating')))
        time.sleep(2)
    except Exception as e:
        print(f"Error while waiting for elements: {e}")
    
    review_texts = []
    star_ratings = []
    
    # Scroll until the reviews are loaded, or until the limit is reached
    while len(review_texts) < max_reviews:
        # Get the last review element
        last_review = driver.find_elements(By.CLASS_NAME, 'user-review-reviewTextWrapper')[-1]
        
        # Scroll to the last review element
        driver.execute_script("arguments[0].scrollIntoView();", last_review)
        
        # Wait for the new reviews to load (2 seconds)
        time.sleep(2)

        # Get the current page source and check for new reviews
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        reviews = soup.find_all('div', class_='user-review-reviewTextWrapper')
        ratings = soup.find_all('span', class_='user-review-starRating')

        # If no new reviews were loaded, stop scraping
        if len(reviews) == len(review_texts):
            break
        
        # Update review_texts and star_ratings with the new reviews
        review_texts = [review.get_text(strip=True) for review in reviews]
        star_ratings = [rating.get_text(strip=True) for rating in ratings]
    
    # Ensure the reviews do not exceed max_reviews
    review_texts = review_texts[:max_reviews]
    star_ratings = star_ratings[:max_reviews]

    return review_texts, star_ratings


# In[10]:


def scrape_reviews_from_product_url(product_url, max_reviews=1000):
    # Extract the review URL from the product URL
    review_url = get_review_url(product_url)
    
    if review_url is None:
        return None, None
    
    # Start the WebDriver and scrape reviews
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    review_texts, star_ratings = scroll_and_scrape(driver, review_url, max_reviews)

    # Handle mismatched data by adjusting
    if len(review_texts) != len(star_ratings):
        min_len = min(len(review_texts), len(star_ratings))
        review_texts = review_texts[:min_len]
        star_ratings = star_ratings[:min_len]
    
    # Create a DataFrame
    data = {
        'Review': review_texts,
        'Stars': star_ratings
    }
    df = pd.DataFrame(data)

    # Save the DataFrame to a CSV file
    df.to_csv(os.path.join("data", "myntra_reviews.csv"), index=False)

    # Close the browser
    driver.quit()

    return df


# In[14]:

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(1)

    product_url = sys.argv[1]
    scrape_reviews_from_product_url(product_url)






