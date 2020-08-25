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
print("Logged into the portal. Attempt to plot a file")
plot_button = driver.find_elements_by_xpath('//a[text()="Plot"]')[0]
plot_button.click()
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
perform_plot = driver.find_element_by_xpath('//a[text()="Plot"]')
perform_plot.click()
time.sleep(15)
driver.close()
#close the tab
time.sleep(3)
driver.switch_to.window(driver.window_handles[0])

print("Trying to plot a file that doesn't exist")
driver.get("http://localhost:3000/plot/unkown_file.csv")
time.sleep(3)

driver.close()
driver.quit()