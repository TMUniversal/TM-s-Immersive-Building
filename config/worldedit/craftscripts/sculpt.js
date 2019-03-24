// $Id$
/*
 * Sculpt
 * Copyright (C) 2013 K0Gs <http://www.kogshole.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should see <http://www.gnu.org/licenses/>.
*/


importPackage(Packages.java.io);
importPackage(Packages.java.awt);
importPackage(Packages.javax.imageio);
importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.blocks);

function ColorEngine(r, g, b) {
    return new Color(r / 255, g / 255, b / 255);
}

var clothColors = [ 
    ColorEngine(248,249,0), //gold block 41, 0   
    ColorEngine(237,237,237), //ironblock 42, 0
    ColorEngine(220,204,160), //sandstone 24, 0   
    ColorEngine(216,216,82), //sponge 19, 0
    ColorEngine(184,149,96), //oakstack 5, 0
    ColorEngine(118,86,53), //sprucestack 5, 1
    ColorEngine(215,208,155), //birchstack 5, 2
    ColorEngine(128,250,128), //emeraldblock 133:0
    ColorEngine(147,106,73), //dirt    3, 0
    ColorEngine(144,87,63), //hardclay 172, 0
    ColorEngine(102,102,102), //stone 1, 0
    ColorEngine(83,113,160), //ice 79, 0
    ColorEngine(77,77,77), //cobble   4, 0
    ColorEngine(47,66,118), //lapisblock 22, 0 
    ColorEngine(27,81,165), //lapisore 21, 0
    ColorEngine(26,26,26), //coal   173, 0    
    ColorEngine(254,254,254), // White wool 35, 0
    ColorEngine(255,128,0), // Orange wool    35, 1
    ColorEngine(200,0,200), // Magenta wool 35, 2
    ColorEngine(87,132,223), // Light blue wool 35, 3
	 ColorEngine(255,255,0), // Yellow wool 35, 4
    ColorEngine(128,255,0), // Cactus green wool 35, 5 48,80,0
    ColorEngine(255,128,255), // Pink wool 35, 6
    ColorEngine(128,128,128), // Gray wool 35, 7  
    ColorEngine(173,173,173), // Light grey wool 35, 8
    ColorEngine(0,100,160), // Cyan wool 35, 9
    ColorEngine(120,0,200), // Purple wool  35, 10 
    ColorEngine(50,50,255), // Blue wool  35, 11 
    ColorEngine(100,60,0), // Brown wool    35, 12 
    ColorEngine(48,80,0), // Green wool 35, 13  0,255,0
    ColorEngine(255,0,0), // Red wool   35, 14 
    ColorEngine(0,0,0), // Black wool 35, 15     
    ColorEngine(205,174,158), //whiteclay 159, 0
    ColorEngine(255,128,38), //orangeclay    159, 1
    ColorEngine(200,0,128), //magentaclay  159, 2
    ColorEngine(109,104,134), //lightblueclay 159, 3
    ColorEngine(182,130,35), //yellowclay 159, 4
    ColorEngine(0,255,0), //limeclay 159, 5
    ColorEngine(255,127,192), //pinkclay 159, 6
    ColorEngine(56,41,34), //grayclay 159, 7
    ColorEngine(134,106,97), //lightgreyclay 159, 8
    ColorEngine(84,87,87), //cyanclay 159, 9
    ColorEngine(116,70,83), //purpleclay 159, 10
    ColorEngine(73,58,90), //blueclay  159, 11
    ColorEngine(74,49,34), //brownclay 159, 12
    ColorEngine(84,87,161), //greenclay 159, 13
    ColorEngine(139,61,45), //redclay   159, 14   
    ColorEngine(36,23,17), //blackclay 159, 15 
    ColorEngine(234,232,226), //quart 43, 7 
    ColorEngine(157,112,73), //jungle 5, 3 
    ColorEngine(158,89,11), //pumpkin 86, 0 
    ColorEngine(137,114,17), //hay 170, 0 
    ColorEngine(153,85,66), //brick 43, 4 
    ColorEngine(11,9,11), //obsidian 49, 0 
    ColorEngine(104,220,215), //diamond 57, 0 
    ColorEngine(167,171,187) //clay 82, 0
]

function colorDistance(c1, c2) {
    var rmean = (c1.getRed() + c2.getRed()) / 2;
    var r = c1.getRed() - c2.getRed();
    var g = c1.getGreen() - c2.getGreen();
    var b = c1.getBlue() - c2.getBlue();
    var weightR = 2 + rmean/256;
    var weightG = 4.0;
    var weightB = 2 + (255-rmean)/256
    return Math.sqrt(weightR*r*r + weightG*g*g + weightB*b*b);
}

function range (low, high, step) {
  var web = [];
  var invalue, endvalue, pls;
  var walker = step || 1;
  var chars = false;

  if (!isNaN(low) && !isNaN(high)) {
    invalue = low;
	
	
	
    endvalue = high;
	
  } else if (isNaN(low) && isNaN(high)) {
  
    chars = true;
	
	
    invalue = low.charCodeAt(0);
    endvalue = high.charCodeAt(0);
	
  } else {
    invalue = (isNaN(low) ? 0 : low);
    endvalue = (isNaN(high) ? 0 : high);
  }

  pls = ((invalue > endvalue) ? false : true);
  if (pls) {
    while (invalue <= endvalue) {
	
	
      web.push(((chars) ? String.fromCharCode(invalue) : invalue));
      invalue += walker;
    }
  } else {
  
    while (invalue >= endvalue) {
      web.push(((chars) ? String.fromCharCode(invalue) : invalue));
	  
	  
   invalue -= walker;
    }
  }

  return web;
}


function findClosestWoolColor(col, clothColors, type) {
	//var closestArray = new Array();
	var closestId = 1;
	var closestDistance = colorDistance(col, clothColors[0]);
	
	for(var i = 1; i < clothColors.length; i++) {
		var dist = colorDistance(col, clothColors[i]);
		
		if(dist < closestDistance) {
			closestId = i;
			closestDistance = dist;
		}
	}
	//player.print(closestId);
	if (closestId == 0) {
		var closestBlock = 41;
		var closestData = 0;
		//player.print("S1");
		}
		else if (closestId == 1){
		
		var closestBlock = 42;
		var closestData = 0; 
		//player.print("S2");
		}
		else if (closestId == 2){
		
		var closestBlock = 24;
		var closestData = 0; 
		//player.print("S3");
		}
		else if (closestId == 3){
		
		var closestBlock = 35;
		var closestData = 4; 
		//player.print("S4");
		}
		else if (closestId == 4){
		
		var closestBlock = 5;
		var closestData = 0; 
		//player.print("S5");
		}
		else if (closestId == 5){
		
		var closestBlock = 5;
		var closestData = 1; 
		//player.print("S6");
		}
		else if (closestId == 6){
		
		var closestBlock = 5;
		var closestData = 2; 
		//player.print("S7");
		}
		else if (closestId == 7){
		
		var closestBlock = 133;
		var closestData = 0; 
		//player.print("S8");
		}
		else if (closestId == 8){
		
		var closestBlock = 3;
		var closestData = 0; 
		//player.print("S9");
		}
		else if (closestId == 9){
		
		var closestBlock = 172;
		var closestData = 0; 
		//player.print("S10");
		}
		else if (closestId == 10){
		
		var closestBlock =1;
		var closestData = 0; 
		//player.print("S11");
		}
		else if (closestId == 11){
		
		var closestBlock = 79;
		var closestData = 0; 
		//player.print("S12");
		}
		else if (closestId == 12){
		
		var closestBlock = 4;
		var closestData = 0; 
		//player.print("S13");
		}
		else if (closestId == 13){
		
		var closestBlock = 22;
		var closestData = 0; 
		//player.print("S14");
		}
		else if (closestId == 14){
		
		var closestBlock = 42;
		var closestData = 0; 
		//player.print("S15");
		}
		else if (closestId == 15){
		
		var closestBlock = 173;
		var closestData = 0; 
		//player.print("S16");
		}
		else if (closestId == 16){
		
		var closestBlock = 35;
		var closestData = 0; 
		//player.print("S17");
		}
		else if (closestId == 17){
		
		var closestBlock = 35;
		var closestData = 1; 
		//player.print("S18");
		}
		else if (closestId == 18){
		
		var closestBlock = 35;
		var closestData = 2; 
		//player.print("S19");
		}
		else if (closestId == 19){
		
		var closestBlock = 35;
		var closestData = 3; 
		//player.print("S20");
		}
		else if (closestId == 20){
		
		var closestBlock = 19;
		var closestData = 0; 
		//player.print("S21");
		}
		else if (closestId == 21){
		
		var closestBlock = 35;
		var closestData = 5; 
		//player.print("S22");
		}
		else if (closestId == 22){
		
		var closestBlock = 35;
		var closestData = 6; 
		//player.print("S23");
		}
		else if (closestId == 23){
		
		var closestBlock = 35;
		var closestData = 7; 
		//player.print("S24");
		}
		else if (closestId == 24){
		
		var closestBlock = 35;
		var closestData = 8; 
		//player.print("S25");
		}
		else if (closestId == 25){
		
		var closestBlock = 35;
		var closestData = 9; 
		//player.print("S26");
		}
		else if (closestId == 26){
		
		var closestBlock = 35;
		var closestData = 10; 
		//player.print("S27");
		}
		else if (closestId == 27){
		
		var closestBlock = 35;
		var closestData = 11; 
		//player.print("S28");
		}
		else if (closestId == 28){
		
		var closestBlock = 35;
		var closestData = 12; 
		//player.print("S29");
		}
		else if (closestId == 29){
		
		var closestBlock = 35;
		var closestData = 13; 
		//player.print("S30");
		}
		else if (closestId == 30){
		
		var closestBlock = 35;
		var closestData = 14; 
		//player.print("S31");
		}
		else if (closestId == 31){
		
		var closestBlock = 35;
		var closestData = 15; 
		//player.print("S32");
		}
		else if (closestId == 32){
		
		var closestBlock = 159;
		var closestData = 0; 
		//player.print("S33");
		}
		else if (closestId == 33){
		
		var closestBlock = 159;
		var closestData = 1; 
		//player.print("S34");
		}
		else if (closestId == 34){
		
		var closestBlock = 159;
		var closestData = 2; 
		//player.print("S35");
		}
		else if (closestId == 35){
		
		var closestBlock = 159;
		var closestData = 3; 
		//player.print("S36");
		}
		else if (closestId == 36){
		
		var closestBlock = 159;
		var closestData = 4; 
		//player.print("S37");
		}
		else if (closestId == 37){
		
		var closestBlock = 159;
		var closestData = 5; 
		//player.print("S38");
		}
		else if (closestId == 38){
		
		var closestBlock = 159;
		var closestData = 6; 
		//player.print("S39");
		}
		else if (closestId == 39){
		
		var closestBlock = 159;
		var closestData = 7; 
		//player.print("S40");
		}
		else if (closestId == 40){
		
		var closestBlock = 159;
		var closestData = 8; 
		//player.print("S41");
		}
		else if (closestId == 41){
		
		var closestBlock = 159;
		var closestData = 9; 
		//player.print("S42");
		}
		else if (closestId == 42){
		
		var closestBlock = 159;
		var closestData = 10; 
		//player.print("S43");
		}
		else if (closestId == 43){
		
		var closestBlock = 159;
		var closestData = 11;
		//player.print("S44");
		}
		else if (closestId == 44){
		
		var closestBlock = 159;
		var closestData = 12;
		//player.print("S45");
		}
		else if (closestId == 45){
		
		var closestBlock = 159;
		var closestData =  13;
		//player.print("S46");
		}
		else if (closestId == 46){
		
		var closestBlock = 159;
		var closestData = 14; 
		//player.print("S47");
		}
		else if (closestId == 47){
		
		var closestBlock = 159;
		var closestData = 15;
		//player.print("S48");
		}
		else if (closestId == 48){
		
		var closestBlock = 43;
		var closestData = 7;
		//player.print("S48");
		}
		else if (closestId == 49){
		
		var closestBlock = 5;
		var closestData = 3;
		//player.print("S48");
		}
		else if (closestId == 50){
		
		var closestBlock = 86;
		var closestData = 0;
		//player.print("S48");
		}
		else if (closestId == 51){
		
		var closestBlock = 170;
		var closestData = 0;
		//player.print("S48");
		}
		else if (closestId == 52){
		
		var closestBlock = 43;
		var closestData = 4;
		//player.print("S48");
		}
		else if (closestId == 53){
		
		var closestBlock = 49;
		var closestData = 0;
		//player.print("S48");
		}
		else if (closestId == 54){
		
		var closestBlock = 57;
		var closestData = 0;
		//player.print("S48");
		}
		else if (closestId == 55){
		
		var closestBlock = 82;
		var closestData = 0;
		//player.print("S48");
		}
	if (type == "data"){
	//player.print("data");
	//player.print(closestData);
	return closestData;
	}
	else if (type == "block"){
	//player.print("Block");
	//player.print(closestBlock);
	return closestBlock;
	}
}


context.checkArgs(1, 3, "<name> <orientation> <hat>");

var f = context.getSafeFile("drawings", argv[1] + ".png");
var sess = context.remember();
var upright = argv[2] == "v";
var colors = clothColors;
var nheight = argv[1];
var nwidth = argv[2];
var ndepth = argv[3];
var wallblock = argv[4];
var roofblock = argv[5];


if (!f.exists()) {
    player.printError("Specified file doesn't exist.");
} else {
    var img = ImageIO.read(f);

    var width = img.getWidth();
    var height = img.getHeight();
    //player.print(height);
	//player.print(width);*/
//if (0 = 0){
    var origin = player.getBlockIn();
	

		

    var XDIM = 1
    var YDIM = 2
    var ZDIM = 3
	
	var regions = new Array();
	
		if (argv[2] == "south"){
	
   	   regions['HeadTop'] = new Array(8, 15, 0, 7, XDIM, ZDIM, 4, 28, 0);	//Head Top 8,15,0,7, XDIM, ZDIM, 4, 29, 0
	   regions['headbottom']= new Array(16, 23, 0, 7, XDIM, ZDIM, 4, 21, 0);	// Head Bottom
	   regions['headleft'] = new Array ( 16,  23,  8,  15, -ZDIM,  YDIM,  4,  21,  1);	// Head Left 
	    regions['headright'] = new Array(0,  7,  8,  15,  ZDIM,  YDIM,  11,  21,  0);	// Head Right 16,  23,  8,  15,
	   regions['headback'] = new Array(24,  31,  8,  15,  XDIM,  YDIM,  4,  21, 0);	// Head Back
	    regions['headfront'] = new Array(15,  8,  8,  15,  XDIM,  YDIM,  4,  21,  7);	// Head Front
	    regions['leftlegtop'] = new Array(4,  7,  16,  19,  XDIM,  -ZDIM,  4,  11,  3);	// Left Leg Top
	    regions['rightlegtop'] = new Array(4,  7,  16,  19,  XDIM,  -ZDIM,  8,  11,  3);	// Right Leg Top
	    regions['leftlegbottom'] = new Array(8,  11,  16,  19,  XDIM,  -ZDIM,  4,  0,  3);	// Left Leg Bottom
	    regions['rightlegbottom'] = new Array(8,  11,  16,  19,  XDIM,  -ZDIM,  8,  0,  3);	// Right Leg Bottom
	    regions['legsleft'] = new Array(0,  3,  20,  30,  -ZDIM,  YDIM,  4,  0,  3);	// Legs Left 0,  3,  20,  30,
	    regions['legsright'] = new Array(0,  3,  20,  30,  -ZDIM,  YDIM,  11,  0,  3);	// Legs Right 0,  3,  20,  30,
	    regions['leftlegback'] = new Array(4,  7,  20,  30,  -XDIM,  YDIM,  5,  0,  5);	// Left Leg Back12,  15,  20,  30,
	    regions['rightlegback'] = new Array(4,  7,  20,  30,  XDIM,  YDIM,  8,  0,  5);	// Right Leg Back
	    regions['leftlegfront'] = new Array(12,  15,  20,  30,  -XDIM,  YDIM,  5,  0,  2);	// Left Leg Front4,  7,  20,  30,
	    regions['rightlegfront'] = new Array(12,  15,  20,  30,  XDIM,  YDIM,  8,  0,  2);	// Right Leg Front
	    regions['bodytop'] = new Array(20,  27,  16,  19,  XDIM,  -ZDIM,  4,  20,  3); // Body Top
	    regions['bodybottom'] = new Array(28,  35,  16,  19,  XDIM,  -ZDIM,  4,  10,  3);// Body Bottom
	    regions['bodyleft'] = new Array(16,  19,  20,  30,  -ZDIM,  YDIM,  4,  10,  3);// Body Left 28,  31,  20,  30,
	    regions['bodyright'] = new Array(28,  31,  20,  30,  ZDIM,  YDIM,  11,  10,  2);// Body Right 16,  19,  20,  30,
	    regions['bodyback'] = new Array(20,  27,  20,  30,  XDIM,  YDIM,  4,  10,  5); // Body Back
	    regions['bodyfront'] = new Array(32,  39,  20,  30,  XDIM,  YDIM,  4,  10,  2);	// Body Front
	    regions['leftarmtop'] = new Array(44,  47,  16,  19,  XDIM,  -ZDIM,  0,  20,  3);	// Left Arm Top
	    regions['rightarmtop'] = new Array(44,  47,  16,  19,  XDIM,  -ZDIM,  12,  20,  3);	// Right Arm Top
	    regions['leftarmbottom'] = new Array(48,  51,  16,  19,  XDIM,  -ZDIM,  0,  10,  3);	// Left Arm Bottom
	    regions['rightarmbottom'] = new Array(48,  51,  16,  19,  XDIM,  -ZDIM,  12,  10,  3);// Right Arm Bottom
	    regions['armsleft'] = new Array(40,  43,  20,  30, -ZDIM,  YDIM,  0,  10,  3);	// Arms Left 40,  43,  20,  30, 
	    regions['armsright'] = new Array(40,  43,  20,  30,  -ZDIM,  YDIM,  15,  10,  3);	// Arms Right40,  43,  20,  30,
	    regions['leftarmback'] = new Array(44,  47,  20,  30,  XDIM,  YDIM,  0,  10,  5);	// Left Arm Back
	    regions['rightarmback'] = new Array(47,  44,  20,  30,  XDIM,  YDIM,  12,  10,  5);	// Right Arm Back52,  55,  20,  30,
	    regions['leftarmfront'] = new Array(52,  55,  20,  30,  -XDIM,  YDIM,  1,  10,  2);	// Left Arm Front44,  47,  20,  30,
	    regions['rightarmfront'] = new Array(55,  52,  20,  30,  -XDIM,  YDIM,  19,  10,  2);	// Right Arm Front 
		}
		else if (argv[2] == "east"){

   	   regions['HeadTop'] = new Array(8, 15, 0, 7, XDIM, ZDIM, 4, 28, 0);	//Head Top
	   regions['headbottom']= new Array(16, 23, 0, 7, XDIM, ZDIM, 4, 21, 0);	// Head Bottom
	   regions['headleft'] = new Array (0,  7,  8,  15, XDIM,  YDIM,  4,  21,  0);	// Head Left-ZDIM,  YDIM,  3,  22,  0
	    regions['headright'] = new Array(16,  23,  8,  15, XDIM,  YDIM,  4,  21, 7);	// Head RightZDIM,  YDIM,  12,  22,  0
	   regions['headback'] = new Array(24,  31,  8,  15, -ZDIM,  YDIM,  4,  21,  1);	// Head BackXDIM,  YDIM,  4,  22, 8
	    regions['headfront'] = new Array(8,  15,  8,  15, ZDIM,  YDIM,  11,  21,  0);	// Head FrontXDIM,  YDIM,  4,  22,  -1
	    regions['leftlegtop'] = new Array(4,  7,  16,  19,  XDIM,  -ZDIM,  6,  11,  1);	// Left Leg Top
	    regions['rightlegtop'] = new Array(4,  7,  16,  19,  XDIM,  -ZDIM,  6,  11,  5);	// Right Leg Top
	    regions['leftlegbottom'] = new Array(8,  11,  16,  19,  XDIM,  -ZDIM,  6,  0,  1);	// Left Leg Bottom
	    regions['rightlegbottom'] = new Array(8,  11,  16,  19,  XDIM,  -ZDIM,  6,  0,  4);	// Right Leg Bottom*/
	    regions['legsleft'] = new Array(0,  3,  20,  30,  XDIM,  YDIM,  6,  0,  0);	// Legs Left
	    regions['legsright'] = new Array(0,  3,  20,  30,  -XDIM,  YDIM,  7,  0,  7);	// Legs Right
	    regions['leftlegback'] = new Array(12,  15,  20,  30,  -ZDIM,  YDIM,  6,  0,  1);	// Left Leg Back
	    regions['rightlegback'] = new Array(12,  15,  20,  30,  ZDIM,  YDIM,  6,  0,  4);	// Right Leg Back
	    regions['leftlegfront'] = new Array(4,  7,  20,  30,  -ZDIM,  YDIM,  9,  0,  1);	// Left Leg Front
	    regions['rightlegfront'] = new Array(4,  7,  20,  30,  ZDIM,  YDIM,  9,  0,  4);	// Right Leg Front
	    regions['bodytop'] = new Array(20,  27,  16,  19, -ZDIM,  XDIM,  6,  20,  1); // Body Top
	    regions['bodybottom'] = new Array(28,  35,  16,  19, -ZDIM,  XDIM,  6,  10,  1);// Body Bottom
	    regions['bodyleft'] = new Array(28,  31,  20,  30,  XDIM,  YDIM,  6,  10,  0);// Body Left16,  19,  20,  30,
	    regions['bodyright'] = new Array(16,  19,  20,  30,  -XDIM,  YDIM,  7,  10,  7);// Body Right28,  31,  20,  30,
	    regions['bodyfront'] = new Array(32,  39,  20,  30,  -ZDIM,  YDIM,  6,  10,  1);	// Body Front20,  27,  20,  30,*/
	    regions['bodyback'] = new Array(20,  27,  20,  30,  -ZDIM,  YDIM,  9,  10,  1); // Body Back32,  39,  20,  30,
	    regions['leftarmtop'] = new Array(44,  47,  16,  19,  XDIM,  -ZDIM,  6,  20,  -3);	// Left Arm Top
	    regions['rightarmtop'] = new Array(44,  47,  16,  19,  XDIM,  -ZDIM,  6,  20,  9);	// Right Arm Top
	    regions['leftarmbottom'] = new Array(48,  51,  16,  19,  XDIM,  -ZDIM,  6,  10,  -3);	// Left Arm Bottom
	    regions['rightarmbottom'] = new Array(48,  51,  16,  19,  XDIM,  -ZDIM,  6,  10,  9);// Right Arm Bottom
	    regions['armsleft'] = new Array(40,  43,  20,  30,  -XDIM,  YDIM,  7,  10,  -4);	// Arms Left
	    regions['armsright'] = new Array(40,  43,  20,  30,  -XDIM,  YDIM,  7,  10,  11);	// Arms Right
	    regions['leftarmfront'] = new Array(44,  47,  20,  30,  ZDIM,  YDIM,  9,  10,  -4);	// Left Arm Front
	    regions['rightarmfront'] = new Array(47,  44,  20,  30,  ZDIM,  YDIM,  9,  10,  8);	// Right Arm Front */
	    regions['leftarmback'] = new Array(55,  52,  20,  30,  ZDIM,  YDIM,  6,  10,  -4);	// Left Arm Back
	    regions['rightarmback'] = new Array(52,  55,  20,  30,  ZDIM,  YDIM,  6,  10,  8);	// Right Arm Back
		
		}
		else if (argv[2] == "west"){

   	   regions['HeadTop'] = new Array(8, 15, 0, 7, XDIM, ZDIM, 4, 28, 0);	//Head Top
	   regions['headbottom']= new Array(16, 23, 0, 7, XDIM, ZDIM, 4, 21, 0);	// Head Bottom
	   regions['headleft'] = new Array (16,  23,  8,  15, XDIM,  YDIM,  4,  21,  0);	// Head Left-ZDIM,  YDIM,  3,  21,  0 0,  8,  8,  15,
	    regions['headright'] = new Array(0,  7,  8,  15, XDIM,  YDIM,  4,  21, 7);	// Head RightZDIM,  YDIM,  12,  21,  0 16,  24,  8,  15
	    regions['headfront'] = new Array(24,  31,  8,  15, ZDIM,  YDIM,  11,  21,  0);	// Head FrontXDIM,  YDIM,  4,  21,  -1 8,  16,  8,  15,
	   regions['headback'] = new Array(8,  15,  8,  15, -ZDIM,  YDIM,  4,  21,  1);	// Head BackXDIM,  YDIM,  4,  22, 8 23,  32,  8,  15,
	    regions['leftlegtop'] = new Array(4,  7,  16,  19,  XDIM,  -ZDIM,  6,  11,  1);	// Left Leg Top
	    regions['rightlegtop'] = new Array(4,  7,  16,  19,  XDIM,  -ZDIM,  6,  11,  5);	// Right Leg Top
	    regions['leftlegbottom'] = new Array(8,  11,  16,  19,  XDIM,  -ZDIM,  6,  0,  1);	// Left Leg Bottom
	    regions['rightlegbottom'] = new Array(8,  11,  16,  19,  XDIM,  -ZDIM,  6,  0,  5);	// Right Leg Bottom
	    regions['legsleft'] = new Array(0,  3,  20,  30,  XDIM,  YDIM,  6,  0,  0);	// Legs Left
	    regions['legsright'] = new Array(0,  3,  20,  30,  -XDIM,  YDIM,  7,  0,  7);	// Legs Right
	    regions['leftlegfront'] = new Array(12,  15,  20,  30,  -ZDIM,  YDIM,  9,  0,  1);	// Left Leg Front4,  7,  20,  30,
	    regions['rightlegfront'] = new Array(12,  15,  20,  30,  ZDIM,  YDIM,  9,  0,  4);	// Right Leg Front
	    regions['leftlegback'] = new Array(4,  7,  20,  30,  -ZDIM,  YDIM,  6,  0,  1);	// Left Leg Back12,  15,  20,  30,
	    regions['rightlegback'] = new Array(4,  7,  20,  30,  ZDIM,  YDIM,  6,  0,  4);	// Right Leg Back
	    regions['bodytop'] = new Array(20,  27,  16,  19, -ZDIM,  XDIM,  6,  20,  1); // Body Top
	    regions['bodybottom'] = new Array(28,  35,  16,  19, -ZDIM,  XDIM,  6,  10,  1);// Body Bottom
	    regions['bodyleft'] = new Array(16,  19,  20,  30,  XDIM,  YDIM,  6,  10,  0);// Body Left16,  19,  20,  30,
	    regions['bodyright'] = new Array(28,  31,  20,  30,  -XDIM,  YDIM,  7,  10,  7);// Body Right 28,  31,  20,  30,
	    regions['bodyback'] = new Array(32,  39,  20,  30,  -ZDIM,  YDIM,  9,  10,  1); // Body Back32,  39,  20,  30,
	    regions['bodyfront'] = new Array(20,  27,  20,  30,  -ZDIM,  YDIM,  6,  10,  1);	// Body Front20,  27,  20,  30,*/
	    regions['leftarmtop'] = new Array(44,  47,  16,  19,  XDIM,  -ZDIM,  6,  20,  -3);	// Left Arm Top
	    regions['rightarmtop'] = new Array(44,  47,  16,  19,  XDIM,  -ZDIM,  6,  20,  9);	// Right Arm Top
	    regions['leftarmbottom'] = new Array(48,  51,  16,  19,  XDIM,  -ZDIM,  6,  10,  -3);	// Left Arm Bottom
	    regions['rightarmbottom'] = new Array(48,  51,  16,  19,  XDIM,  -ZDIM,  6,  10,  9);// Right Arm Bottom
	    regions['armsleft'] = new Array(40,  43,  20,  30,  -XDIM,  YDIM,  7,  10,  -4);	// Arms Left
	    regions['armsright'] = new Array(40,  43,  20,  30,  -XDIM,  YDIM,  7,  10,  11);	// Arms Right
	    regions['leftarmfront'] = new Array(55,  52,  20,  30,  ZDIM,  YDIM,  9,  10,  -4);	// Left Arm Front44,  47,  20,  30,
	    regions['rightarmfront'] = new Array(52,  55,  20,  30,  ZDIM,  YDIM,  9,  10,  8);	// Right Arm Front 
	    regions['leftarmback'] = new Array(44,  47,  20,  30,  ZDIM,  YDIM,  6,  10,  -4);	// Left Arm Back52,  55,  20,  30,
	    regions['rightarmback'] = new Array(47,  44,  20,  30,  ZDIM,  YDIM,  6,  10,  8);	// Right Arm Back */
		
		}
		else if (argv[2] == "north"){

   	   regions['HeadTop'] = new Array(8, 15, 0, 7, XDIM, ZDIM, 4, 28, 0);	//Head Top 8,15,0,7, XDIM, ZDIM, 4, 29, 0
	   regions['headbottom']= new Array(16, 23, 0, 7, XDIM, ZDIM, 4, 21, 0);	// Head Bottom
	   regions['headleft'] = new Array (0,  7,  8,  15,  -ZDIM,  YDIM,  4,  21,  1);	// Head Left
	    regions['headright'] = new Array(16,  23,  8,  15,  ZDIM,  YDIM,  11,  21,  0);	// Head Right
	   regions['headback'] = new Array(24,  31,  8,  15,  XDIM,  YDIM,  4,  21, 7);	// Head Back
	    regions['headfront'] = new Array(15,  8,  8,  15,  XDIM,  YDIM,  4,  21,  0);	// Head Front
	    regions['leftlegtop'] = new Array(4,  7,  16,  19,  XDIM,  -ZDIM,  4,  11,  3);	// Left Leg Top
	    regions['rightlegtop'] = new Array(4,  7,  16,  19,  XDIM,  -ZDIM,  8,  11,  3);	// Right Leg Top
	    regions['leftlegbottom'] = new Array(8,  11,  16,  19,  XDIM,  -ZDIM,  4,  0,  3);	// Left Leg Bottom
	    regions['rightlegbottom'] = new Array(8,  11,  16,  19,  XDIM,  -ZDIM,  8,  0,  3);	// Right Leg Bottom
	    regions['legsleft'] = new Array(0,  3,  20,  30,  -ZDIM,  YDIM,  4,  0,  3);	// Legs Left
	    regions['legsright'] = new Array(0,  3,  20,  30,  -ZDIM,  YDIM,  11,  0,  3);	// Legs Right
	    regions['leftlegback'] = new Array(12,  15,  20,  30,  -XDIM,  YDIM,  5,  0,  5);	// Left Leg Back
	    regions['rightlegback'] = new Array(12,  15,  20,  30,  XDIM,  YDIM,  8,  0,  5);	// Right Leg Back
	    regions['leftlegfront'] = new Array(4,  7,  20,  30,  -XDIM,  YDIM,  5,  0,  2);	// Left Leg Front
	    regions['rightlegfront'] = new Array(4,  7,  20,  30,  XDIM,  YDIM,  8,  0,  2);	// Right Leg Front
	    regions['bodytop'] = new Array(20,  27,  16,  19,  XDIM,  -ZDIM,  4,  20,  3); // Body Top
	    regions['bodybottom'] = new Array(28,  35,  16,  19,  XDIM,  -ZDIM,  4,  10,  3);// Body Bottom
	    regions['bodyleft'] = new Array(16,  19,  20,  30,  -ZDIM,  YDIM,  4,  10,  3);// Body Left
	    regions['bodyright'] = new Array(28,  31,  20,  30,  ZDIM,  YDIM,  11,  10,  2);// Body Right
	    regions['bodyback'] = new Array(32,  39,  20,  30,  XDIM,  YDIM,  4,  10,  5); // Body Back
	    regions['bodyfront'] = new Array(20,  27,  20,  30,  XDIM,  YDIM,  4,  10,  2);	// Body Front
	    regions['leftarmtop'] = new Array(44,  47,  16,  19,  XDIM,  -ZDIM,  0,  20,  3);	// Left Arm Top
	    regions['rightarmtop'] = new Array(44,  47,  16,  19,  XDIM,  -ZDIM,  12,  20,  3);	// Right Arm Top
	    regions['leftarmbottom'] = new Array(48,  51,  16,  19,  XDIM,  -ZDIM,  0,  10,  3);	// Left Arm Bottom
	    regions['rightarmbottom'] = new Array(48,  51,  16,  19,  XDIM,  -ZDIM,  12,  10,  3);// Right Arm Bottom
	    regions['armsleft'] = new Array(40,  43,  20,  30,  -ZDIM,  YDIM,  0,  10,  3);	// Arms Left
	    regions['armsright'] = new Array(40,  43,  20,  30,  -ZDIM,  YDIM,  15,  10,  3);	// Arms Right
	    regions['leftarmback'] = new Array(55,  52,  20,  30,  XDIM,  YDIM,  0,  10,  5);	// Left Arm Back
	    regions['rightarmback'] = new Array(52,  55,  20,  30,  XDIM,  YDIM,  12,  10,  5);	// Right Arm Back
	    regions['leftarmfront'] = new Array(47,  44,  20,  30,  -XDIM,  YDIM,  7,  10,  2);	// Left Arm Front
	    regions['rightarmfront'] = new Array(44,  47,  20,  30,  -XDIM,  YDIM,  12,  10,  2);	// Right Arm Front*/ 
		}
		var j = 0;
		var k =0;
	for (i in regions){
	    //player.print(regions[i]);
		
		var xl = 0;
		var xh = 0;
		var yl = 0;
		var yh = 0;
		var dim1 = 0;
		var dim2 = 0;
		var sx = 0;
		var sy = 0;
		var sz = 0;
		var lx = 0;
		var ly = 0;
		var lz = 0;
		var xrange = 0;
		var yrange = 0;
		var xr = new Array();
		var yr = new Array();
		var kr = 0;
		var jr = 0;
		var cnt = 0;
		//var cnt2 = 0;
		
	    xl = regions[i][0];//xl, xh, yl, yh, dim1, dim2, sx, sy, sz
		xh = regions[i][1];//alert (xl, xh, yl, yh, dim1, dim2, sx, sy, sz);
		yl = regions[i][2];//lx = sx;
		yh = regions[i][3];
		dim1 = regions[i][4];//ly = sy;
		dim2 = regions[i][5];
		sx = regions[i][6];//lz = sz;
		sy = regions[i][7];
		sz = regions[i][8];
		lx = sx;//4
		ly = sy;//31
		lz = sz;//1
		if (dim1 == -ZDIM){
			lz = sz + xh-xl - 1;
			//player.print(lz);
		}	
		if (dim2 == -ZDIM){
			lz = sz + yh-yl - 1;
			//player.print(lz);
		}	
		if (dim1 == -XDIM){
			lx = sx + xh-xl - 1;
			//player.print(lx);
		}
		xrange = range(xl, xh);
		yrange = range(yh, yl);
		xr = new Array(range(xl, xh));
		yr = new Array(range(yh, yl));
		//player.print(xrange);
		//player.print(yrange);
		    jr in xr;
		    kr in yr;
		    //var cnt2 = 0;
		for (j in xrange){
			var cnt2 =0;
		    for (k in yrange) {
			//player.print(xr[jr][cnt] + " " + yr[kr][cnt2]);
			//player.print(yr[kr][cnt2]);
            var c = new Color(img.getRGB(xr[jr][cnt], yr[kr][cnt2]));
			//player.print(c);
            var blocks = findClosestWoolColor(c,colors, "block");				
            var datas = findClosestWoolColor(c,colors, "data");
				//player.print(blocks + " " + datas);
				//player.print(datas);
	
                sess.setBlock(origin.add(lx, ly, lz), new BaseBlock(blocks, datas));	
				if (dim2 == YDIM){
					ly = ly + 1;
					}
				if (dim2 == ZDIM){
					lz = lz + 1;
					}
				if (dim2 == -ZDIM){
					lz = lz - 1;
					}
			cnt2 = cnt2 + 1;
			}
			cnt = cnt + 1;
			
			if (dim2 == YDIM){
				ly = sy;
				}
			if (dim2 == ZDIM){
				lz = sz;
				}
			if (dim2 == -ZDIM){
				lz = sz + yh-yl - 1;
				}
			
			if (dim1 == XDIM){
				lx = lx + 1;
				}
			if (dim1 == -XDIM){
				lx = lx - 1;
				}
			if (dim1 == ZDIM){
				lz = lz + 1;
				}
			if (dim1 == -ZDIM){
				lz = lz - 1;
		        }
			
	    }  
		
 
			
	}	
	
	if (argv[3] == "hat") { 
	
		if (argv[2] == "south"){	
		var hats = new Array();
	    hats['hattop'] = new Array(40,  47,  0,  7,  XDIM,  ZDIM,  4,  29,  0);	// Hat Top
	    hats['hatback'] = new Array(40,  47,  8,  15,  XDIM,  YDIM,  4,  21,  8);	// Hat Back56,  63,  8,  15,
	    hats['hatleft'] = new Array(48,  55,  8,  15,  -ZDIM,  YDIM,  3,  21,  1);	// Hat Left32,  39,  8,  15,
	    hats['hatright'] = new Array(32,  39,  8,  15,  ZDIM,  YDIM,  12,  21,  0);	// Hat Right48,  55,  8,  15,
	    hats['hatfront'] = new Array(56,  63,  8,  15,  XDIM,  YDIM,  4,  21,  -1);	// Hat Front*/
	for (i in hats){
	    //player.print(regions[i]);
		
		var xl = 0;
		var xh = 0;
		var yl = 0;
		var yh = 0;
		var dim1 = 0;
		var dim2 = 0;
		var sx = 0;
		var sy = 0;
		var sz = 0;
		var lx = 0;
		var ly = 0;
		var lz = 0;
		var xrange = 0;
		var yrange = 0;
		var xr = new Array();
		var yr = new Array();
		var kr = 0;
		var jr = 0;
		var cnt = 0;
		//var cnt2 = 0;
		
	    xl = hats[i][0];//xl, xh, yl, yh, dim1, dim2, sx, sy, sz
		xh = hats[i][1];//alert (xl, xh, yl, yh, dim1, dim2, sx, sy, sz);
		yl = hats[i][2];//lx = sx;
		yh = hats[i][3];
		dim1 = hats[i][4];//ly = sy;
		dim2 = hats[i][5];
		sx = hats[i][6];//lz = sz;
		sy = hats[i][7];
		sz = hats[i][8];
		lx = sx;//4
		ly = sy;//31
		lz = sz;//1
		if (dim1 == -ZDIM){
			lz = sz + xh-xl - 1;
			//player.print(lz);
		}	
		if (dim2 == -ZDIM){
			lz = sz + yh-yl - 1;
			//player.print(lz);
		}	
		if (dim1 == -XDIM){
			lx = sx + xh-xl - 1;
			//player.print(lx);
		}
		xrange = range(xl, xh);
		yrange = range(yh, yl);
		xr = new Array(range(xl, xh));
		yr = new Array(range(yh, yl));
		//player.print(xrange);
		//player.print(yrange);
		    jr in xr;
		    kr in yr;
		    //var cnt2 = 0;
		for (j in xrange){
			var cnt2 =0;
		    for (k in yrange) {
			//player.print(xr[jr][cnt]);
			//player.print(yr[kr][cnt2]);
            var c = new Color(img.getRGB(xr[jr][cnt], yr[kr][cnt2]));

            var blocks = findClosestWoolColor(c,colors, "block");				
            var datas = findClosestWoolColor(c,colors, "data");
				//player.print(blocks);
				//player.print(datas);	
                
				if (datas != 15){
                sess.setBlock(origin.add(lx, ly, lz), new BaseBlock(blocks, datas));
				}
				if (dim2 == YDIM){
					ly = ly + 1;
					}
				if (dim2 == ZDIM){
					lz = lz + 1;
					}
				if (dim2 == -ZDIM){
					lz = lz - 1;
					}
			cnt2 = cnt2 + 1;
			}
			cnt = cnt + 1;
			
			if (dim2 == YDIM){
				ly = sy;
				}
			if (dim2 == ZDIM){
				lz = sz;
				}
			if (dim2 == -ZDIM){
				lz = sz + yh-yl - 1;
				}
			
			if (dim1 == XDIM){
				lx = lx + 1;
				}
			if (dim1 == -XDIM){
				lx = lx - 1;
				}
			if (dim1 == ZDIM){
				lz = lz + 1;
				}
			if (dim1 == -ZDIM){
				lz = lz - 1;
		        }
			
	    }  
		
 
			
	}
	}
		if (argv[2] == "north"){	
		var hats = new Array();
	    hats['hattop'] = new Array(40,  47,  0,  7,  XDIM,  ZDIM,  4,  29,  0);	// Hat Top
	    hats['hatleft'] = new Array(32,  39,  8,  15,  -ZDIM,  YDIM,  3,  21,  1);	// Hat Left32,  39,  8,  15, 48,  55,  8,  15,
	    hats['hatright'] = new Array(48,  55,  8,  15,  ZDIM,  YDIM,  12,  21,  0);	// Hat Right48,  55,  8,  15, 32,  39,  8,  15,
	    hats['hatback'] = new Array(56,  63,  8,  15,  XDIM,  YDIM,  4,  21,  8);	// Hat Back56,  63,  8,  15, 40,  47,  8,  15,
	    hats['hatfront'] = new Array(40,  47,  8,  15,  XDIM,  YDIM,  4,  21,  -1);	// Hat Front*/
	for (i in hats){
	    //player.print(regions[i]);
		
		var xl = 0;
		var xh = 0;
		var yl = 0;
		var yh = 0;
		var dim1 = 0;
		var dim2 = 0;
		var sx = 0;
		var sy = 0;
		var sz = 0;
		var lx = 0;
		var ly = 0;
		var lz = 0;
		var xrange = 0;
		var yrange = 0;
		var xr = new Array();
		var yr = new Array();
		var kr = 0;
		var jr = 0;
		var cnt = 0;
		//var cnt2 = 0;
		
	    xl = hats[i][0];//xl, xh, yl, yh, dim1, dim2, sx, sy, sz
		xh = hats[i][1];//alert (xl, xh, yl, yh, dim1, dim2, sx, sy, sz);
		yl = hats[i][2];//lx = sx;
		yh = hats[i][3];
		dim1 = hats[i][4];//ly = sy;
		dim2 = hats[i][5];
		sx = hats[i][6];//lz = sz;
		sy = hats[i][7];
		sz = hats[i][8];
		lx = sx;//4
		ly = sy;//31
		lz = sz;//1
		if (dim1 == -ZDIM){
			lz = sz + xh-xl - 1;
			//player.print(lz);
		}	
		if (dim2 == -ZDIM){
			lz = sz + yh-yl - 1;
			//player.print(lz);
		}	
		if (dim1 == -XDIM){
			lx = sx + xh-xl - 1;
			//player.print(lx);
		}
		xrange = range(xl, xh);
		yrange = range(yh, yl);
		xr = new Array(range(xl, xh));
		yr = new Array(range(yh, yl));
		//player.print(xrange);
		//player.print(yrange);
		    jr in xr;
		    kr in yr;
		    //var cnt2 = 0;
		for (j in xrange){
			var cnt2 =0;
		    for (k in yrange) {
			//player.print(xr[jr][cnt]);
			//player.print(yr[kr][cnt2]);
            var c = new Color(img.getRGB(xr[jr][cnt], yr[kr][cnt2]));

            var blocks = findClosestWoolColor(c,colors, "block");				
            var datas = findClosestWoolColor(c,colors, "data");
				//player.print(blocks);
				//player.print(datas);	
                
				if (datas != 15){
                sess.setBlock(origin.add(lx, ly, lz), new BaseBlock(blocks, datas));
				}
				if (dim2 == YDIM){
					ly = ly + 1;
					}
				if (dim2 == ZDIM){
					lz = lz + 1;
					}
				if (dim2 == -ZDIM){
					lz = lz - 1;
					}
			cnt2 = cnt2 + 1;
			}
			cnt = cnt + 1;
			
			if (dim2 == YDIM){
				ly = sy;
				}
			if (dim2 == ZDIM){
				lz = sz;
				}
			if (dim2 == -ZDIM){
				lz = sz + yh-yl - 1;
				}
			
			if (dim1 == XDIM){
				lx = lx + 1;
				}
			if (dim1 == -XDIM){
				lx = lx - 1;
				}
			if (dim1 == ZDIM){
				lz = lz + 1;
				}
			if (dim1 == -ZDIM){
				lz = lz - 1;
		        }
			
	    }  
		
 
			
	}
	}
		if (argv[2] == "east"){	
		var hats = new Array();
	    hats['hattop'] = new Array(40,  47,  0,  7,  XDIM,  ZDIM,  4,  29,  0);	// Hat Top
	    hats['hatleft'] = new Array(56,  63,  8,  15,  -ZDIM,  YDIM,  3,  21,  1);	// Hat Left 32,  39,  8,  15,
	    hats['hatright'] = new Array(40,  47,  8,  15,  ZDIM,  YDIM,  12,  21,  0);	// Hat Right 48,  55,  8,  15,
	    hats['hatback'] = new Array(55,  48,  8,  15,  XDIM,  YDIM,  4,  21,  8);	// Hat Back5 56,  63,  8,  15,
	    hats['hatfront'] = new Array(32,  39,  8,  15,  XDIM,  YDIM,  4,  21,  -1);	// Hat Front*/ 40,  47,  8,  15,
	for (i in hats){
	    //player.print(regions[i]);
		
		var xl = 0;
		var xh = 0;
		var yl = 0;
		var yh = 0;
		var dim1 = 0;
		var dim2 = 0;
		var sx = 0;
		var sy = 0;
		var sz = 0;
		var lx = 0;
		var ly = 0;
		var lz = 0;
		var xrange = 0;
		var yrange = 0;
		var xr = new Array();
		var yr = new Array();
		var kr = 0;
		var jr = 0;
		var cnt = 0;
		//var cnt2 = 0;
		
	    xl = hats[i][0];//xl, xh, yl, yh, dim1, dim2, sx, sy, sz
		xh = hats[i][1];//alert (xl, xh, yl, yh, dim1, dim2, sx, sy, sz);
		yl = hats[i][2];//lx = sx;
		yh = hats[i][3];
		dim1 = hats[i][4];//ly = sy;
		dim2 = hats[i][5];
		sx = hats[i][6];//lz = sz;
		sy = hats[i][7];
		sz = hats[i][8];
		lx = sx;//4
		ly = sy;//31
		lz = sz;//1
		if (dim1 == -ZDIM){
			lz = sz + xh-xl - 1;
			//player.print(lz);
		}	
		if (dim2 == -ZDIM){
			lz = sz + yh-yl - 1;
			//player.print(lz);
		}	
		if (dim1 == -XDIM){
			lx = sx + xh-xl - 1;
			//player.print(lx);
		}
		xrange = range(xl, xh);
		yrange = range(yh, yl);
		xr = new Array(range(xl, xh));
		yr = new Array(range(yh, yl));
		//player.print(xrange);
		//player.print(yrange);
		    jr in xr;
		    kr in yr;
		    //var cnt2 = 0;
		for (j in xrange){
			var cnt2 =0;
		    for (k in yrange) {
			//player.print(xr[jr][cnt]);
			//player.print(yr[kr][cnt2]);
            var c = new Color(img.getRGB(xr[jr][cnt], yr[kr][cnt2]));

            var blocks = findClosestWoolColor(c,colors, "block");				
            var datas = findClosestWoolColor(c,colors, "data");
				//player.print(blocks);
				//player.print(datas);	
                
				if (datas != 15){
                sess.setBlock(origin.add(lx, ly, lz), new BaseBlock(blocks, datas));
				}
				if (dim2 == YDIM){
					ly = ly + 1;
					}
				if (dim2 == ZDIM){
					lz = lz + 1;
					}
				if (dim2 == -ZDIM){
					lz = lz - 1;
					}
			cnt2 = cnt2 + 1;
			}
			cnt = cnt + 1;
			
			if (dim2 == YDIM){
				ly = sy;
				}
			if (dim2 == ZDIM){
				lz = sz;
				}
			if (dim2 == -ZDIM){
				lz = sz + yh-yl - 1;
				}
			
			if (dim1 == XDIM){
				lx = lx + 1;
				}
			if (dim1 == -XDIM){
				lx = lx - 1;
				}
			if (dim1 == ZDIM){
				lz = lz + 1;
				}
			if (dim1 == -ZDIM){
				lz = lz - 1;
		        }
			
	    }  
		
 
			
	}
	}
		if (argv[2] == "west"){	
		var hats = new Array();
	    hats['hattop'] = new Array(40,  47,  0,  7,  XDIM,  ZDIM,  4,  29,  0);	// Hat Top
	    hats['hatleft'] = new Array(40,  47,  8,  15,  -ZDIM,  YDIM,  3,  21,  1);	// Hat Left 56,  63,  8,  15,
	    hats['hatright'] = new Array(56,  63,  8,  15, ZDIM,  YDIM,  12,  21,  0);	// Hat Right 40,  47,  8,  15, 
	    hats['hatback'] = new Array(39,  32,  8,  15,  XDIM,  YDIM,  4,  21,  8);	// Hat Back 48,  55,  8,  15,
	    hats['hatfront'] = new Array(48,  55,  8,  15,  XDIM,  YDIM,  4,  21,  -1);	// Hat Front*/  32,  39,  8,  15,
	for (i in hats){
	    //player.print(regions[i]);
		
		var xl = 0;
		var xh = 0;
		var yl = 0;
		var yh = 0;
		var dim1 = 0;
		var dim2 = 0;
		var sx = 0;
		var sy = 0;
		var sz = 0;
		var lx = 0;
		var ly = 0;
		var lz = 0;
		var xrange = 0;
		var yrange = 0;
		var xr = new Array();
		var yr = new Array();
		var kr = 0;
		var jr = 0;
		var cnt = 0;
		//var cnt2 = 0;
		
	    xl = hats[i][0];//xl, xh, yl, yh, dim1, dim2, sx, sy, sz
		xh = hats[i][1];//alert (xl, xh, yl, yh, dim1, dim2, sx, sy, sz);
		yl = hats[i][2];//lx = sx;
		yh = hats[i][3];
		dim1 = hats[i][4];//ly = sy;
		dim2 = hats[i][5];
		sx = hats[i][6];//lz = sz;
		sy = hats[i][7];
		sz = hats[i][8];
		lx = sx;//4
		ly = sy;//31
		lz = sz;//1
		if (dim1 == -ZDIM){
			lz = sz + xh-xl - 1;
			//player.print(lz);
		}	
		if (dim2 == -ZDIM){
			lz = sz + yh-yl - 1;
			//player.print(lz);
		}	
		if (dim1 == -XDIM){
			lx = sx + xh-xl - 1;
			//player.print(lx);
		}
		xrange = range(xl, xh);
		yrange = range(yh, yl);
		xr = new Array(range(xl, xh));
		yr = new Array(range(yh, yl));
		//player.print(xrange);
		//player.print(yrange);
		    jr in xr;
		    kr in yr;
		    //var cnt2 = 0;
		for (j in xrange){
			var cnt2 =0;
		    for (k in yrange) {
			//player.print(xr[jr][cnt]);
			//player.print(yr[kr][cnt2]);
            var c = new Color(img.getRGB(xr[jr][cnt], yr[kr][cnt2]));

            var blocks = findClosestWoolColor(c,colors, "block");				
            var datas = findClosestWoolColor(c,colors, "data");
				//player.print(blocks);
				//player.print(datas);	
                
				if (datas != 15){
                sess.setBlock(origin.add(lx, ly, lz), new BaseBlock(blocks, datas));
				}
				if (dim2 == YDIM){
					ly = ly + 1;
					}
				if (dim2 == ZDIM){
					lz = lz + 1;
					}
				if (dim2 == -ZDIM){
					lz = lz - 1;
					}
			cnt2 = cnt2 + 1;
			}
			cnt = cnt + 1;
			
			if (dim2 == YDIM){
				ly = sy;
				}
			if (dim2 == ZDIM){
				lz = sz;
				}
			if (dim2 == -ZDIM){
				lz = sz + yh-yl - 1;
				}
			
			if (dim1 == XDIM){
				lx = lx + 1;
				}
			if (dim1 == -XDIM){
				lx = lx - 1;
				}
			if (dim1 == ZDIM){
				lz = lz + 1;
				}
			if (dim1 == -ZDIM){
				lz = lz - 1;
		        }
			
	    }  
		
 
			
	}
	}
	}
   var i = 0;

}