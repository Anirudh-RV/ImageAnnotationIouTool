from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(ChromeDriverManager().install())

print("here")
driver.get('http://172.20.10.4:8080/')
print("after get")
screenshot = driver.save_screenshot('my_screenshot.png')
driver.quit()
