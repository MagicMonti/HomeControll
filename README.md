# HomeControll (alpha)
### This is a simple Web-App to control the GPIO pins on the Raspberry PI
This whole app is powered by nodes.js and mango-DB
To control the GPIO pins, the user has to add a new device (name and pin) to manipulate the states of the pin per UI,
It is also possible to create timestamps. With timestamps it is possible to activate or deactivate devices at a specific time, you can also set the repetition on which day the device should change its state.
**1) At first you have to install node.js**

    sudo apt-get install nodejs

**2) clone the repository in your working directory**

    cd <our directory>
    clone https://github.com/MagicMonti/HomeControll.git

**3) install mongo db**

    sudo apt-get install mongodb

**4) run mongodb**

    sudo mongod


 optional

    sudo mongod --port <your database port>

**5) config HomeControll**
    navigate to `config.json` file and change the properties you want.

**6) run**

    sudo node app.js

**7) have fun**

**Startpage**
![startpage](https://github.com/MagicMonti/HomeControll/blob/master/Screen%20Shot%202017-08-05%20at%2017.20.29.png?raw=true)

**Manage Devices**
![manage devices](https://github.com/MagicMonti/HomeControll/blob/master/Screen%20Shot%202017-08-05%20at%2017.20.44.png?raw=true)
![manage devices](https://github.com/MagicMonti/HomeControll/blob/master/Screen%20Shot%202017-08-05%20at%2017.20.52.png?raw=true)

**Timestamps**
![manage timestamp](https://github.com/MagicMonti/HomeControll/blob/master/Screen%20Shot%202017-08-05%20at%2017.21.03.png?raw=true)
![manage timestamp](https://github.com/MagicMonti/HomeControll/blob/master/Screen%20Shot%202017-08-05%20at%2017.21.16.png?raw=true)
