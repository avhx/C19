#C19
Covid-19 tracking utility for Tennessee

## Inspiration
We have always wanted to take on a data visualization project and now seems like the right time and place with _Covid-19_. Especially so, since there are so many different lenses that we can apply, analyze, and learn from.

## What it does
_C-19_ is a data aggregation and analysis tool that provides insights into the evolution of Covid-19 within the state of Tennessee. It utilizes many different lenses such as: news sources, demographics, mobility reports, and time series data. Not only is it a great place to learn more about Covid-19 and how it is spreading within the state of Tennessee but also it may be used as a tool for potential policy-related decisions.

## How we built it
We used many tools to build _C-19_. The dashboard was built using Angular framework with a back-end consisting of Firebase and Express.js. An integral part of our website’s functionality comes from many useful APIs. One such API was the RDS API, which allowed us to interact with a multitude of datasets (Google Mobility Reports, Tennessee Health Department data, and Knoxville Health Department data) with ease. Furthermore, Google Maps API combined with the power of OpenStreetMaps allowed us to construct a custom GIS experience. Last but not least, we utilized News API to easily query Covid-19 related data in JSON.

![Image shows the custom GIS interaction we made with the help of Google Maps API and OpenStreetMaps](https://i.imgur.com/5Qn7DYL.png)

Other than the tools -- a restless night with a steady supply of caffeine helped us pull through!

## Challenges we ran into
When developing the Angular frontend, we ran into problems regarding connecting to our Firebase databases and dealing with concepts such as Promises and Observables. In addition to problems on the frontend, when we attempted to use the official RDS Javascript SDK in a Node.JS environment,  we faced many errors. Discussing our issues with one of the actual SDK developers showed us that it was just not possible to use it in a Node.JS environment. Instead, we had to craft our own rudimentary HTTP functions to get our RDS data.

## Accomplishments that we're proud of

**Ankush:** Personally, my proudest moment during the whole experience was converting over 100,000 geographic coordinates into polygons and sticking it onto a map! It was really satisfying being able to design county boundaries with a fine granularity and to be able to interact with each individual county.

**Vijay:** The proudest moment for me would be when all of the database we had been requesting from RDS seamlessly flowed into our Firebase database. It was made _even_ better by the fact that we formatted the data in a way so it was incredibly easy to visualize the data with the graphing library we were using (Chart.js)!

## What we learned

**Ankush:** More than I wanted to about handling asynchronous data.

**Vijay:** I learned a lot about Express.js as well as how to deal with Angular imports (struggled to install Chart.js)

## What's next for C-19
After the competition is over, we want to go back and polish up C-19 because the insights and experiences that we gained from designing this tool were invaluable. Hopefully, we can keep our tool running for others to see and use!
