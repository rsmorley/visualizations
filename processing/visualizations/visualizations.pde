color appleIITerminalGreen = 0x8833FF33;
color terminalGrey = 0xFF282828;
color[] eightiesColors = new color[5];
int colorIndex = 0;
float xWalkOrigin = 0;
float yWalkOrigin = 0;
float frameRate = 5.0;

void setup() {
  fullScreen();
  frameRate(frameRate);
  background(0);
  xWalkOrigin = width / 2;
  yWalkOrigin = height / 2;
  eightiesColors[0] = 0x55ff48c4;
  eightiesColors[1] = 0x552bd1fc;
  eightiesColors[2] = 0x55f3ea5f;
  eightiesColors[3] = 0x55c04df9;
  eightiesColors[4] = 0x55ff3f3f;
  stroke(eightiesColors[colorIndex]);
  fill(eightiesColors[colorIndex]);
}

void draw() {

  //drawCirclesWithVaryingSizes();
  //drawWalkingCircles(50);
  drawWalkingCirclesWithVaryingDiameters(50, 10, width/10);
  clearScreen(60, false);
  //drawRandomLinesWithBackgroundBackfill(appleIITerminalGreen, terminalGrey);
}

/**
  Check key pressed and call printScreen if lower(key) == 'p'
)
  Note: key always contains the last key pressed
        keyCode should be used to special keys
 */
void keyPressed() {
  if (key== 'p' || key == 'P') {
    printScreen();
  }
}

/**
  Print screen
 */
void printScreen() {
  saveFrame("screen-" + int(random(10000)) + "-#####.png");
}

/**
  Clear screen at the specified interval

  params:
    TTL: number of seconds between screen wipes
    print: boolean to indicate if the screen should be saved before clearing
 */
void clearScreen(int TTL, boolean print) {
  if(frameCount % int(TTL * frameRate) == 0) {
    if (print) {
      printScreen();
    }
    background(0);
  }
}

/**
  Draws random lines of varying lengths.
  10% of lines are backfilled with the background color

  params:
    fg: color of the lines
    bg: color of the background and backfill lines
*/
void drawRandomLinesWithBackgroundBackfill(color fg, color bg) {
  float xOrigin = random(width);
  float yOrigin = random(height);
  
  float xTerminus = random(width);
  float yTerminus = random(height);
  
  boolean drawBackgroundLine = frameCount % 10 == 0;
  if (drawBackgroundLine) {
    stroke(bg);
  }
  line(xOrigin, yOrigin, xTerminus, yTerminus);
  stroke(fg);
}

/**
  Draws random circles with varying sizes between 10 and screen width / 10
*/
void drawCirclesWithVaryingSizes() {
  float diameter = random(10, width/10);
  
  float xOrigin = random(width);
  float yOrigin = random(height);
  circle(xOrigin, yOrigin, diameter);
}

/**
  Draws random circles with origins within Step pixels of each other
  and diameters within diameterMin and diameterMax
  
  X and Y coordinates are constrained to screen extent

  params:
    step: integer value for pixel distance between circle origins
    diameterMin: integer value for minimum diameter
    diameterMax: integer value for maximum diameter
*/
void drawWalkingCirclesWithVaryingDiameters(int step, int diameterMin, int diameterMax) {
  float diameter = random(diameterMin, diameterMax);

  boolean xNegative = random(-1, 1) < 0;
  boolean yNegative = random(-1, 1) < 0;

  if(xNegative) {
    xWalkOrigin += step;
  } else {
    xWalkOrigin -= step;
  }
 
  if(yNegative) {
    yWalkOrigin += step;
  } else {
    yWalkOrigin -= step;
  }

  xWalkOrigin = min(xWalkOrigin, width);
  xWalkOrigin = max(xWalkOrigin, 0.0);
  yWalkOrigin = min(yWalkOrigin, height);
  yWalkOrigin = max(yWalkOrigin, 0.0);
  
  circle(xWalkOrigin, yWalkOrigin, diameter);
  colorIndex++;
  if(colorIndex > 4) {
    colorIndex = 0;
  }
  stroke(eightiesColors[colorIndex]);
  fill(eightiesColors[colorIndex]);
}

/**
  Draws random circles with origins within Step pixels of each other
  
  X and Y coordinates are constrained to screen extent

  params:
    step: integer value for pixel distance between circle origins
*/
void drawWalkingCircles(int step) {
  float diameter = width/10;

  boolean xNegative = random(-1, 1) < 0;
  boolean yNegative = random(-1, 1) < 0;

  if(xNegative) {
    xWalkOrigin += step;
  } else {
    xWalkOrigin -= step;
  }
 
  if(yNegative) {
    yWalkOrigin += step;
  } else {
    yWalkOrigin -= step;
  }

  xWalkOrigin = min(xWalkOrigin, width);
  xWalkOrigin = max(xWalkOrigin, 0.0);
  yWalkOrigin = min(yWalkOrigin, height);
  yWalkOrigin = max(yWalkOrigin, 0.0);
  
  circle(xWalkOrigin, yWalkOrigin, diameter);
  colorIndex++;
  if(colorIndex > 4) {
    colorIndex = 0;
  }
  stroke(eightiesColors[colorIndex]);
  fill(eightiesColors[colorIndex]);
}

void drawRandomLinesToOrigin() {
  float xOrigin = random(width);
  float yOrigin = random(height);
  line(xOrigin, yOrigin, width/2.0, height/2.0);
}
