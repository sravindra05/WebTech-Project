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
print("Logged into the portal. Attempt to create model from a file")
learn_button = driver.find_elements_by_xpath('//a[text()="Learn"]')[0]
learn_button.click()
time.sleep(2)
tabs = driver.window_handles
if (len(tabs)>1):
    driver.switch_to.window(tabs[1])

features = driver.find_elements_by_class_name('feat')
features[0].find_element_by_xpath("..").click()
features[1].find_element_by_xpath("..").click()
targets = driver.find_elements_by_class_name("target")
targets[-1].find_element_by_xpath("..").click()

time.sleep(2)
perform_learn = driver.find_element_by_xpath('//a[text()="Learn"]')
perform_learn.click()
time.sleep(10)

driver.switch_to.alert.accept()
print("Try to evaluate the model")
time.sleep(7)
predict_button = driver.find_elements_by_xpath('//a[text()="Predict"]')[0]
predict_button.click()
tabs = driver.window_handles
driver.switch_to.window(tabs[2]) #switch to the eval tab
elem_a = driver.find_element_by_id("A")
elem_a.send_keys("156")
elem_b = driver.find_element_by_id("B")
elem_b.send_keys("2")

internal_pred = driver.find_element_by_xpath('//a[text()="Predict"]')
internal_pred.click()
time.sleep(5)
driver.close()
#close the tab
driver.switch_to.window(driver.window_handles[1])
time.sleep(2)

print("Now try to delete the model")
delete = driver.find_element_by_xpath('//a[text()="Delete"]')
delete.click()
time.sleep(2)
driver.switch_to.alert.accept()
time.sleep(3)
driver.close()
driver.switch_to.window(driver.window_handles[0])

print("Trying to evaluate a model that doesn't exist")
driver.get("http://localhost:3000/predict/A%7CB!T!unknown.data.csv.h5")

time.sleep(4)
driver.close()
driver.quit()