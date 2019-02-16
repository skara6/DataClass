from splinter import Browser
from bs4 import BeautifulSoup as bs
import requests
import time
from selenium import webdriver
import pandas as pd

def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {"executable_path": "chromedriver"}
    return Browser('chrome', headless=True)


def scrape():
    #browser = init_browser()
    # create mars_data dict that we can insert into mongo
    mars_data = {}

    # visit 'https://mars.nasa.gov/news'
    url = 'https://mars.nasa.gov/news'
    response = requests.get(url)
    # Create BeautifulSoup object; parse with 'lxml'
    soup = bs(response.text, 'html.parser')
    
    # Latest news Title
    news_title = soup.find('div', class_ ='content_title')
    # Extract text and remove newline characters
    news_title = news_title.text.strip()
   #  News Paragraph 
    news_paragraphs = soup.find('div', class_='rollover_description_inner')
    # Extract text and remove newline characters
    news_paragraphs = news_paragraphs.text.strip()

    # add our src to surf data with a key of src
    mars_data["news_title"] = news_title  
    mars_data["news_paragraphs"] = news_paragraphs

    #JPL Mars Space Images - Featured Image
    browser = Browser('chrome', headless=True)
    img_url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    browser.visit(img_url)

    html = browser.html
    soup2 =bs(html, 'html.parser')

    featured_img= soup2.find_all('div',class_='carousel_items')
    featured_img2= soup2.find('a',class_="button fancybox")

    browser.click_link_by_partial_text('FULL IMAGE')
    time.sleep(5)
    browser.click_link_by_partial_text('more info')
    image_html = browser.html
    soup2 = bs(image_html, 'html.parser')

    image = soup2.find('figure', class_="lede").find('a')['href']

    featured_image_url = "https://www.jpl.nasa.gov" + image
    
    mars_data["featured_image_url"] = featured_image_url 

    browser = Browser('chrome', headless=True)
    img_url = "https://twitter.com/marswxreport?lang=en"
    browser.visit(img_url)

    html = browser.html
    soup3 =bs(html, 'html.parser')

    mars_weather = ''

    for div in soup3.find_all('div', attrs={'data-name': 'Mars Weather'}):
        tweet = div.find('p', class_='tweet-text')
        if tweet and tweet.text.find('Sol ') != -1:
            mars_weather = mars_weather + tweet.text.strip().replace('\n', ' ')
            break
        else:
            pass


    mars_data["mars_weather"] = mars_weather

    #Using Pandas to get data about Mars
    url = 'http://space-facts.com/mars/'
    tables = pd.read_html(url)

    mars_df=tables[0]
    mars_df.columns=['Profile', 'Stats']
    mars_df.set_index('Profile', inplace= True)
    mars_table=mars_df.to_html(classes='table table-striped')

    mars_data["mars_table"]= mars_table
    print(mars_table)

    # Mars Hemispheres
    browser = Browser('chrome', headless=True)
    img_url = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
    browser.visit(img_url)

    html = browser.html
    soup5 = bs(html, 'html.parser')
    hemisphere_image_urls = []

    # main_url 
    main_url = 'https://astrogeology.usgs.gov'

    items = soup5.find_all('div', class_='item')

    # Loop 
    for i in items: 
      title = i.find('h3').text
    
      partial_img_url = i.find('a', class_='itemLink product-item')['href']
      print(partial_img_url)
    
      browser.visit(main_url + partial_img_url)      
      partial_img_html = browser.html
      soup = bs( partial_img_html, 'html.parser')
      
      full_img_url = main_url + soup.find('img', class_='wide-image')['src']
      
      hemisphere_image_urls.append({"title" : title, "img_url" : full_img_url})

    mars_data["hemisphere_image_urls"]= hemisphere_image_urls


     # Quite the browser after scraping
    browser.quit
      
      
      
    # Return results    
    return mars_data