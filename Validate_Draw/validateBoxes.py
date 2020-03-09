# DO NOT USE THIS, USING CHECKIOU INSTEAD

#!/usr/bin/env python
# coding: utf-8

# In[ ]:


# Python program to validate boxes drawn in the website by checking against OpenCV outputs

# importing cv2
import cv2
import matplotlib.pyplot as plt


# path
path = r'<path-to-image>.jpeg'

# Reading an image in default mode
imgcv = cv2.imread(path)

plt.imshow(imgcv)
plt.show()

# 101 (168,191) (462,271)
# 110 (10|212) (625|291)
# anirudh_rv_test_custom
"""
(249,145) (380,200)
(386,141) (629,191)
(31,219) (182,268)
(274,281) (470,335)
"""

# represents the top left corner of rectangle
top =(249,145)
# represents the bottom right corner of rectangle
bottom =(380,200)
# Blue color in BGR
color = (255, 0, 0)

# Line thickness of 2 px
thickness = 2

# Using cv2.rectangle() method
# Draw a rectangle with blue line borders of thickness of 2 px
cv2.rectangle(imgcv, top, bottom, (255,0,0) , 2)

# Displaying the image
plt.imshow(imgcv)
plt.show()


# In[ ]:


import cv2

cv2.rectangle(img, (x1, y1), (x2, y2), (255,0,0), 2)


x1,y1 ------
|          |
|          |
|          |
--------x2,y2
