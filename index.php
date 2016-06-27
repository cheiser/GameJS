<?php $title='Template for testprogram'; include(__DIR__ . '/./mall/header.php'); ?>
 
<div id='flash'>
<p>Gameinstructions: Steer with the arrows UP, LEFT and RIGHT but not down!
The goal is to stay alive for as long as possible and you gain one point for each new enemy that appears</p>
<div id="drawingcanvas">

<canvas id="gameCanvas" width="700" height="500"></canvas>

<br />
<button id="restart">restart</button>
</div><!-- close div drawingcanvas -->
<audio id="sound1">
<source src="music/ET.mp3" type="audio/mpeg">
</audio>

<audio id="sound2">
<source src="music/DMD.mp3" type="audio/mpeg">
</audio>

</div><!-- close div flash -->
 
<?php $path=__DIR__; include(__DIR__ . '/./mall/footer.php'); ?>