# Module 2 Group Assignment

CSCI 5117, Spring 2024, [assignment description](https://canvas.umn.edu/courses/413159/pages/project-2)

## App Info:

* Team Name: The Forge
* App Name: SafeRoute
* App Link: https://calm-glacier-0c8e2970f.5.azurestaticapps.net

### Students

* Ariel Larin, larin006@umn.edu
* Stephen Ma, ma000094@umn.edu
* Robert Wang, wan00379@umn.edu
* Benjamin Lindeen, lind1669@umn.edu
* Justin Lee, lee03360@umn.edu


## Key Features

**Describe the most challenging features you implemented
(one sentence per bullet, maximum 4 bullets):**

* The push notification feature was challenging since it involved setting up a service worker and maintaining a detailed flow of data between the front end, back end, and the service worker.
* Graphing the information as the main part of the project was challenging because we had to learn a lot about the google maps API, as well as using other analysis methods to parse the data.

Which (if any) device integration(s) does your app support?

* Location services integrated through Google Maps API is supported on both computers and mobile devices.

Which (if any) progressive web app feature(s) does your app support?

* The app supports push notifications.



## Mockup images

https://app.moqups.com/abx4pEKNdH0metME5E7IDc1ecnt1kwx1/view/page/ad64222d5

<img width="1166" alt="Screenshot 2024-03-29 at 1 38 06 PM" src="https://github.com/csci5117s24/project-2-forge/assets/84486871/b1fd7989-7134-4044-b2ae-1beaefe97425">

<img width="966" alt="Screenshot 2024-03-29 at 1 38 58 PM" src="https://github.com/csci5117s24/project-2-forge/assets/84486871/f73c0b9b-8fa9-4222-b84c-0f848b7468ec">

<img width="846" alt="Screenshot 2024-03-29 at 1 39 34 PM" src="https://github.com/csci5117s24/project-2-forge/assets/84486871/f83b3ca9-2626-4fd8-93ef-2e773701bcd6">

<img width="857" alt="Screenshot 2024-03-29 at 1 39 57 PM" src="https://github.com/csci5117s24/project-2-forge/assets/84486871/4e14418a-f9c2-4e64-bc8b-2aed2f8e64de">



<img width="1098" alt="Screenshot 2024-03-29 at 1 40 32 PM" src="https://github.com/csci5117s24/project-2-forge/assets/84486871/24ea72b0-b0a6-4f80-aeb7-aa7bdb9b8a75">

<img width="593" alt="Screenshot 2024-03-29 at 1 41 05 PM" src="https://github.com/csci5117s24/project-2-forge/assets/84486871/4db81f22-bdb7-4f8f-bfa8-d664516deeeb">



## Testing Notes

**Is there anything special we need to know in order to effectively test your app? (optional):**

* When searching for a location on the map page, you won't see a marker/icon for that location unless it's within the predefined boundaries (on campus). The same goes for seeing your location and saved locations.
* To enable notifications, press the notifications button at the top right corner of the screen.


## Screenshots of Site (complete)

**Home Page:** Splash page with description of what SafeRoute is 
![image](https://github.com/csci5117s24/project-2-forge/assets/96703864/57eba8a8-6cad-41f4-b758-d5322f9e2696)

**Map Page:** Map displaying crime-heavy areas, user location, saved locations with sidebar that allows user to search for and find locations
![image](https://github.com/csci5117s24/project-2-forge/assets/96703864/4010bf9a-d8ca-4fef-93be-ff15a30571d7)

**Locations Page:** Allows user to create saved locations and view those saved locations
![image](https://github.com/csci5117s24/project-2-forge/assets/96703864/590a8ece-c2bc-4333-b408-f2cdb6b93ddf)

**Edit Locations Page:** Allows user to update saved location's custom name and address, and to delete the saved location
![image](https://github.com/csci5117s24/project-2-forge/assets/96703864/7eb26984-0788-48b0-a71a-bbd620059baf)

**Admin Interface Page:** Allows admin to send push notifications 
![image](https://github.com/csci5117s24/project-2-forge/assets/96703864/bc220fdc-a16a-478f-b7fa-5dcb2b5e2090)


## External Dependencies

**Document integrations with 3rd Party code or services here.
Please do not document required libraries (e.g., React, Azure serverless functions, Azure nosql).**

* Library or service name: description of use

* UMN Department of Public Safety; Daily Crime Log; https://publicsafety.umn.edu/campus-safety/daily-crime-log
  This was used to inform our app of where crime is happenning on campus. The data provides the case #, the nature of the crime, the date/time it occurred, date reported, incident       location, and disposition/status of the case. 

* Zamzar: https://www.zamzar.com/convert/pdf-to-csv/
This was used to convert the Daily Crime Log data from a PDF to a CSV that we could manipulate with Python.

* Pandas Library:
There was a good amount of columns and data that we did not need for our app. Moreover, there was data that was missing like city, state, and country. To Geocode this data, adding these columns was necessary. Pandas helped us to manipulate and shape our dataframe to one that was perfect for our project.

* GeoPy/OpenStreetMaps/Nominatim: https://geopy.readthedocs.io/en/stable/#nominatim
This is the open source software that we used in order to add the longitude and latitude to the CSV file; it takes each line of data (focuses on incident location, city, state, and country columns) and adds the associated longitude and latitude to each address. This is necessary to map the se crime data points onto a map.

* Leaflet/React Leaflet: https://react-leaflet.js.org/docs/start-introduction/
This software enables us to visualize our data onto maps; this is crucial for empowering users to see high crime areas. It also provides a ton of functionalities such as making our map draggable, adding dialogue messages, etc.



**If there's anything else you would like to disclose about how your project
relied on external code, expertise, or anything else, please disclose that
here:**

...
