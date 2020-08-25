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
print("Logged into the portal. Attempt to upload a file")
upload_button = driver.find_element_by_xpath('//a[text()="Upload New File"]')
upload_button.click()
time.sleep(2)
tabs = driver.window_handles
if (len(tabs)>1):
    driver.switch_to.window(tabs[1])
browse_button = driver.find_element_by_id("files")
browse_button.send_keys("/home/darkaether0x1/Desktop/pima-indians-diabetes.data.csv")
time.sleep(3)
perform_upload = driver.find_element_by_xpath('//a[text()="Upload File"]')
perform_upload.click()
time.sleep(3)
driver.switch_to.alert.accept()
driver.close()
#close the tab
time.sleep(3)
driver.switch_to.window(driver.window_handles[0])

print("Now testing repeat upload of the same file")
upload_button = driver.find_element_by_xpath('//a[text()="Upload New File"]')
upload_button.click()
time.sleep(2)
tabs = driver.window_handles
if (len(tabs)>1):
    driver.switch_to.window(tabs[1])
browse_button = driver.find_elements_by_id("files")[0]
browse_button.send_keys("/home/darkaether0x1/Desktop/pima-indians-diabetes.data.csv")
time.sleep(3)
perform_upload = driver.find_element_by_xpath('//a[text()="Upload File"]')
perform_upload.click()
time.sleep(3)
driver.switch_to.alert.accept()
driver.close()
#close the tab
time.sleep(3)
driver.switch_to.window(driver.window_handles[0])

print("Now testing the upload of an archive file")
upload_button = driver.find_element_by_xpath('//a[text()="Upload New File"]')
upload_button.click()
time.sleep(2)
tabs = driver.window_handles
if (len(tabs)>1):
    driver.switch_to.window(tabs[1])
browse_button = driver.find_elements_by_id("files")[0]
browse_button.send_keys("/home/darkaether0x1/Desktop/geckodriver.tar.gz")
time.sleep(3)
perform_upload = driver.find_element_by_xpath('//a[text()="Upload File"]')
perform_upload.click()
time.sleep(3)
driver.close()
#close the tab
time.sleep(3)
driver.switch_to.window(driver.window_handles[0])
driver.close()
driver.quit()

