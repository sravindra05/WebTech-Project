from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
driver = webdriver.Firefox()
driver.get("http://localhost:3000/signup")
user_name = "daemonuser"
password = "password"
element = driver.find_element_by_id("username")
element.send_keys(user_name)
element = driver.find_element_by_id("password")
element.send_keys(password)
send_button = driver.find_element_by_xpath('//button[text()="SignUp"]')
time.sleep(3)
send_button.click()
print("Sleeping for 5 seconds for convenience")
time.sleep(5)
driver.switch_to.alert.accept()
try:
    driver.close()
except:
    driver.close()

