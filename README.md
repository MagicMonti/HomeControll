# HomeControll
### this is a simple Web-App to controll the GPIO pins on the Raspberry PI
this whole app is powerd with node.js and mongo-db
To controll the GPIO pins, the user has to add a new device (name and pin) to manipulate the states of the pin per UI,
It is also possible to create timestamps, with timestamps it is possible to activate or deactivate devices at a specific time, you can also set the repetition on which day the device should change its state. 

1) At first you have to install node js
2) make sure following packages are installed
  express
  body-parser
  mongoose
  pi-gpio
  
 3) install mongo db and run it on default port
 4) now run the app with sudo node app.js
 5) Now have fun with your tool
  
