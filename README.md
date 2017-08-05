# HomeControll (alpha)
### this is a simple Web-App to control the GPIO pins on the Raspberry PI 
this whole app is powered with nodes.js and mango-DB
To control the GPIO pins, the user has to add a new device (name and pin) to manipulate the states of the pin per UI,
It is also possible to create timestamps, with timestamps it is possible to activate or deactivate devices at a specific time, you can also set the repetition on which day the device should change its state. 
1) At first you have to install node js
2) make sure the following npm-packages are installed 
  express
  body-parser
  mongoose
  pi-gpio
  
 3) install mongo db and run it on default port
 4) now run the app with 'node app.js'
 5) Now have fun with your tool
 
Startpage
![startpage](https://github.com/MagicMonti/HomeControll/blob/master/Screen%20Shot%202017-08-05%20at%2017.20.29.png?raw=true)

Manage Devices 
![manage devices](https://github.com/MagicMonti/HomeControll/blob/master/Screen%20Shot%202017-08-05%20at%2017.20.44.png?raw=true)
![manage devices](https://github.com/MagicMonti/HomeControll/blob/master/Screen%20Shot%202017-08-05%20at%2017.20.52.png?raw=true)

TimeStamps
![manage timestamp](https://github.com/MagicMonti/HomeControll/blob/master/Screen%20Shot%202017-08-05%20at%2017.21.03.png?raw=true)
![manage timestamp](https://github.com/MagicMonti/HomeControll/blob/master/Screen%20Shot%202017-08-05%20at%2017.21.16.png?raw=true)





 
