# LWHfrontend
<h1>This is the Local History Webapp React Frontend.</h1> 

<h3>#Purpose</h3>

The application is a local history application. The purpose of this 
application is to give individuals who may like to travel to new locations 
and explore the local history a place to do so. In this application the users 
will be able to search for a location and get an overview of a location with 
a list of little known historical facts in the area. If the historical fact 
happened in a specific location, or has a location still existing, it will have 
a map with a marker for that location. The app also allows contributors to make 
accounts, so that they can add little known historical facts for their own areas.

<br/>
<h3>#Technologies</h3>
Mapbox API<br/>
Python Django REST backend<br/>
React.js Frontend<br/>
JWT authentication<br/>

<br/>
<h3>#Technical</h3>
DOM manipulation and instancing.<br/> 
Django custom queries.<br/>
user Authentication with JWT tokens.<br/>
<br/>

<h3>#If you're here for the MapBox code</h3>
I know that in time, as I post this in more locations, Some of you may be here for the MapBox code. For starters, I have left my mapbox key available to you all within this code. Please do not take advantage of this key. It does not offer any special attributes that the basic public key from the MabBox website does not, so please obtain your own. <br/>
<h3>So now for the fun stuff....</h3><br/>
If you are trying to integrate MapBox into your React.js App, it is important to know that Mapbox directly manipulates the DOM. This is important to understand, because one of the primary attributes of React.js is that it has a virtual DOM, and it also manipulates the DOM. As some of you may have realized, attempting to run something that directly manipulates the DOM, inside of something else that is also manipulating the DOM, does not go well. Because of this, we must run a separate instance of our map within React.js. It is important to understand this when proceeding, as it will help greatly when you are trying to take this code, and customize it into what you want. Because the map is inside of its own instance, we need to remember that it is not really part of much of our reactapp functionality, but is howerver part of our global javascript functionality. Therefore, for ease of use and organization, handling dynamic statebased decisions that must connect to functionlaity of our reactapp should be handled through global javascript functionality, and not the stateful functionality that reactapp offers. Inside of the map.jsx file, I have left extensive commentary, if this is too vague, or you have questions, please do not hesitate to ask.
