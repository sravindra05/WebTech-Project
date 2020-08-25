from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
driver = webdriver.Firefox()
driver.get("http://localhost:3000/dashboard")
time.sleep(3)
driver.switch_to.alert.accept()
time.sleep(3)
try:
    driver.close()
except:
    driver.close()