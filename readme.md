## A billiard simulation
<a href="https://a-billiard-simulation.vercel.app/" target="_blank">
<img src="static/html/appIcon.png" width="100"/><br>
</a> 

## Introduction
- Date: October 2022 to Febraury 2023
- Personal project in 'Introduction of Computer Graphics' class
- It shows a billiard simulation implemented [Elastic Collision](https://en.wikipedia.org/wiki/Elastic_collision#One-dimensional_Newtonian).

## Features
- Click the “Reset Speed” button to assign new velocity vector to each ball.
- When rebounding off the cushion, the velocity of each ball drops by 20%.
- Due to friction on the pool table, each ball's velocity drops by 20% every second.
- The position, intensity, angle and color of the light, as well as the velocity volume, can be adjusted in the Debug UI.

## Built with
![JavaScript](https://img.shields.io/badge/JavaScript-FFD700?style=for-the-badge&logo=javascript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css&logoColor=white)
![Blender](https://img.shields.io/badge/Blender-%23F58500?style=for-the-badge&logo=blender&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
* Vite.js provided by [Three.js journey](https://threejs-journey.com/)
* Debug UI from [lil-gui](https://lil-gui.georgealways.com/)

## Issues
- Balls sometimes roll over with attached.