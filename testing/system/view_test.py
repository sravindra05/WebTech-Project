from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
driver = webdriver.Firefox()
driver.get("http://localhost:3000/login")
user_name = "daemonuser"
password = "password"
element = driver.find_element_by_id("username")
element.send_keys(user_name)
element = driver.find_element_by_id("password")
element.send_keys(password)
send_button = driver.find_element_by_xpath('//button[text()="Login"]')
time.sleep(2)
send_button.click()
driver.switch_to.alert.accept()
time.sleep(3)
print("Logged into the portal. Attempt to view a file")
view_button = driver.find_elements_by_xpath('//a[text()="View"]')[0]
view_button.click()
time.sleep(2)
tabs = driver.window_handles
if (len(tabs)>1):
    driver.switch_to.window(tabs[1])
time.sleep(5)
driver.close()
#close the tab
time.sleep(2)
driver.switch_to.window(driver.window_handles[0])

print("Trying to view a file that doesn't exist")
driver.get("http://localhost:3000/view/unkown_file.csv")
time.sleep(5)

driver.close()
driver.quit()