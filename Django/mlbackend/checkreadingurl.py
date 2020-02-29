import urllib
import urllib.request
import PIL
from PIL import Image
from io import BytesIO
import matplotlib.pyplot as plt
import requests
from ssd_data import preprocess
import numpy as np

input_shape = (512,512,3)
input_size = input_shape[:2]
print(input_size)


url = "http://localhost:4000/img/user1_1.png"
response = requests.get(url)
img = Image.open(BytesIO(response.content))
print(img.size)
img_h = img.size[0]
img_w = img.size[1]
print(img_h)
print(img_w)

x = np.array([preprocess(img, input_size)])
print(x.shape)

plt.imshow(img)
plt.show()
