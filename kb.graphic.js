//
//                                                                            							
//    KBLibGraphic                                                            						
//    Author : Ludovic LEGENDART  
//    Version : 1.0        
//    Date : 2011   
//    Project : KBBox
//    Description : Librairie graphique permettant la génération de visuel  
//                  pour les parcours clients créés à partir de la KBBox.   
//
//    Dépendances : jQuery / jQuery-UI / RaphaelJS / Basic JavaScript   
//                                                                      
//                                                                      
////////////////////////////////////////////////////////////////////////////////

Raphael.fn.connection = function (obj1, obj2, line, bg) {
	if (obj1.line && obj1.from && obj1.to) {
		line = obj1;
		obj1 = line.from;
		obj2 = line.to;
	}
	var bb1 = obj1.getBBox(),
		bb2 = obj2.getBBox(),
		p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
		{x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
		{x: bb1.x - 1, y: bb1.y + bb1.height / 2},
		{x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
		{x: bb2.x + bb2.width / 2, y: bb2.y - 1},
		{x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
		{x: bb2.x - 1, y: bb2.y + bb2.height / 2},
		{x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
		d = {}, dis = [];
	for (var i = 0; i < 4; i++) {
		for (var j = 4; j < 8; j++) {
			var dx = Math.abs(p[i].x - p[j].x),
				dy = Math.abs(p[i].y - p[j].y);
			if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
				dis.push(dx + dy);
				d[dis[dis.length - 1]] = [i, j];
			}
		}
	}
	if (dis.length == 0) {
		var res = [0, 4];
	} else {
		res = d[Math.min.apply(Math, dis)];
	}
	var x1 = p[res[0]].x,
		y1 = p[res[0]].y,
		x4 = p[res[1]].x,
		y4 = p[res[1]].y;
	dx = Math.max(Math.abs(x1 - x4) / 2, 10);
	dy = Math.max(Math.abs(y1 - y4) / 2, 10);
	var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
		y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
		x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
		y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
	var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
	if (line && line.line) {
		line.bg && line.bg.setAttr({path: path});
		line.line.setAttr({path: path});
	} else {
		var color = typeof line == "string" ? line : "#000";
		return {
			bg: bg && bg.split && this.path(path).initZoom() && this.path(path).setAttr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
			line: this.path(path).initZoom() && this.path(path).setAttr({stroke: color, fill: "none"}),
			from: obj1,
			to: obj2
		};
	}
};

Raphael.fn.arrow = function (x1, y1, x2, y2, size, color, branch) {
	var angle = Math.atan2(x1-x2,y2-y1);
	angle = (angle / (2 * Math.PI)) * 360;
	var arrowPath = this.path("M" + x2 + " " + y2 + " L" + (x2 - size) + " " + (y2 - size) + " L" + (x2 - size) + " " + (y2 + size) + " L" + x2 + " " + y2 );
	arrowPath.attr({
		"fill": color,
		"stroke": color,
	});
	arrowPath.rotate((90+angle), x2, y2);
	if(branch == true) {
		var a = (y2 - y1) / (x2 - x1);
		if((a == 'Infinity') || (a == '-Infinity')) a = 0;
		var b = y1 - (a * x1);
		var x3 = (-(-2*x2-2*a*y2) + Math.sqrt(Math.pow(-2*x2-2*a*y2, 2) - 4*(1 + Math.pow(a,2))*(x2+2*a*b+b-2*b*y2+y2))) / (2*(1 + Math.pow(a,2)));
		if(((x3 < x2) && (x3 < x1)) || ((x3 > x2) && (x3 > x1))) {
			x3 = (-(-2*x2-2*a*y2) - Math.sqrt(Math.pow(-2*x2-2*a*y2, 2) - 4*(1 + Math.pow(a,2))*(x2+2*a*b+b-2*b*y2+y2))) / (2*(1 + Math.pow(a,2)));
		}
		var y3 = a * x3 + b;
		if(x1 == x2) {
			x3 = x1;
			if(y1 < y2) {
				y3 = y2 - size;
			}
			else {
				y3 = y2 + size;
			}
		}
		if(y1 == y2) {
			y3 = y1;
			if(x1 < x2) {
				x3 = x2 - size;
			}
			else {
				x3 = x2 + size;
			}
		}
		var linePath = this.path("M" + x1 + " " + y1 + " L" + x3 + " " + y3).attr("stroke", color).attr("stroke-width", size / 3);
		return [linePath,arrowPath];
	}
	else {
		return arrowPath;
	}
}

function KBElement(element) {
	this.raphElement = element;
	this.linkedElements = new Array();
	this.links = new Array();
	
	this.init = function() {
		this.setSimpleDragAndDrop(this.links);
	};
	
	this.setSimpleDragAndDrop = function(links) {
		var start = function() {
			this.ox = this.attr("cx");
			this.oy = this.attr("cy");
			this.r = this.attr("r");
			if(this.attr("opacity")) {
				this.oop = this.attr("opacity");
			}
			else {
				this.oop = 1;
			}
			this.animate({"fill-opacity": .1}, 500);
			for(var i = 0; i < links.length; i++) {
				links[i].line.attr({"stroke-width": 2});
			}
		},
		move = function(dx, dy) {	
			var nx = this.ox + dx - this.r;
			var ny = this.oy + dy - this.r;
			
			if(nx < 0) nx = this.r;
			if(nx > KBGraphic.width * KBGraphic.zoomValue) nx = KBGraphic.width * KBGraphic.zoomValue - this.r;
			if(ny < 0) ny = this.r;
			if(ny > KBGraphic.height * KBGraphic.zoomValue) ny = KBGraphic.height * KBGraphic.zoomValue - this.r;
			
			this.setAttr({
				cx: nx, 
				cy: ny
			});
			
			for (var i = links.length; i--;) {
				this.paper.connection(links[i]);
			}
		},
		up = function() {
			this.setAttr({
				cursor: "pointer"
			});
			this.animate({"fill-opacity": this.oop}, 500);
			for(var i = 0; i < links.length; i++) {
                                links[i].line.attr({"stroke-width": .8});
                        }
		};
		
		this.raphElement.drag(move, start, up);
	};
	
	this.drawLink = function() {
		for(var i = 0; i < this.linkedElements.length; i++) {
			var link = this.raphElement.paper.connection(
				this.raphElement,
				this.linkedElements[i].raphElement,
				"#000000"
			);
			this.links.push(link);
			this.linkedElements[i].links.push(link);
		}
		for(var i = 0; i < this.links.length; i++) {
			this.links[i].line.attr({"stroke-width": .8});
		}
	}
}

var KBGraphic = new function() {
	this.paper; // main canvas for drawing
	this.viewport; // canvas zone the user can see
	this.matrix; // matrix for the viewport transform attribute
	this.width; // canvas width
	this.height; // canvas height
	this.idPaper; // CSS id of the div containing the graphical elements
	this.elements; // list of elements the canvas contains
	this.panBoxControls; // list of pan controls
	this.zoomValue; // zoom current value
	this.minZoom; // minimum value of zoom
	this.maxZoom; // maximum value of zoom
	
	// Init function
	// it creates the canvas and all the controls depending on the parameters
	this.init = function(id, w, h, enableZoom, minZoom, maxZoom) {
		this.height = h;
		this.width = w;
		this.idPaper = id + '_graph'; // CSS id of the div containing the canvas
		$('<div id="' + this.idPaper + '"></div>').appendTo('#' + id); // adds the div where the canvas will be displayed
		$('#' + this.idPaper).css('float', 'left');				  //
		$('#' + this.idPaper).css('border', '2px #A2A2A2 solid'); //  CSS for the div
		$('#' + this.idPaper).css('margin', '20px'); 			  //
		$('<div id="' + this.idPaper + '_clear">&nbsp;</div>').appendTo('#' + id); // adds a div with clear style for a nice display
		$('#' + this.idPaper + '_clear').css('clear', 'both');	
		this.elements = new Array();
		// if zoom is not enabled
		if(enableZoom == false) {
			this.paper = Raphael(this.idPaper, this.width, this.height); // creates canvas without the zoom feature
		}
		else {
			// inverts max and min if misentered
			if(minZoom > maxZoom) {
				var invertZoom = minZoom;
				minZoom = maxZoom;
				maxZoom = invertZoom;
			}
			// creates canvas without the zoom feature
			else {
				this.paper = Raphael(this.idPaper, this.width, this.height).initZoom(); // draws the main canvas and enables intern zoom feature	
				var zpd = new RaphaelZPD(this.paper, {zoom: false, pan: false, drag: false}); // enables intern pan feature				
				this.minZoom = minZoom / 100;
				this.maxZoom = maxZoom / 100;
				this.viewport = zpd.gelem; // sets the viewport
				this.draw(); // drawing test
				this.matrix = new Array(1, 0, 0, 1, 0, 0); //defines the default viewport transform matrix
				this.panBoxControls = new Array(); // list of pan controls
				this.scaleRadar = 0.208 // scale for radar
				// creates the zoom and pan feature
				this.setZoomControls(this.paper, this.viewport, this.matrix);
				this.updateZoom(100, "set"); // sets the zoom to the current value
				this.processZoom(); // does the zoom
				for(var i = 0; i < this.panBoxControls.length; i++) {
					this.panBoxControls[i][0].attr({
						"fill": "#CCCCCC",
						"stroke": "#CCCCCC",
						"cursor": "no-drop"
					});
					this.panBoxControls[i][1].attr({
						"fill": "#CCCCCC",
						"stroke": "#CCCCCC",
						"cursor": "no-drop"
					});
				}
			}
		}
	};
		
	this.draw = function() {
		var stage1 = new Array();
		var stage2 = new Array();
		
		for(var j = 1; j < 16; j++) {
			var x = new KBElement(this.paper.circle(35*j, 20*j, 10).initZoom());
			x.raphElement.setAttr({
				fill: '270-#FFFFFF-#000000',
				stroke: "none",
				cursor: "pointer"
			});
			x.init();
			stage1.push(x);
		}
		
		for(var h = 1; h < 4; h++) {
			var y = new KBElement(this.paper.circle(50*h, 100*h, 20).initZoom());
			y.raphElement.setAttr({
				fill: '270-#A60000-#000000',
				stroke: "none",
				cursor: "pointer"
			});
			y.init();
			stage2.push(y);
			for(var k = 5 * (h - 1); k < 5 * h; k++) {
				y.linkedElements.push(stage1[k]);
			}
			y.drawLink();
		}
		
		var z = new KBElement(this.paper.circle(100, 500, 30).initZoom());
		z.raphElement.setAttr({
			fill: '270-#1111FF-#000000',
			stroke: "none",
			cursor: "pointer"
		});
		z.init();
		for(var l = 0; l < 3; l++) {
			z.linkedElements.push(stage2[l]);
		}
		z.drawLink();

		this.elements.concat(stage1, stage2);
		this.elements.push(z);
	};
	
	// Check Out Radar Function
	// checks radar and updates it depending on pan & zoom
	this.checkOutRadar = function() {
		var idRadarTarget = $('#' + this.idPaper + '_radar_target');
		if(this.zoomValue > 1) {
			idRadarTarget.css('display', 'block');
			idRadarTarget.css('width', (parseInt(idRadarTarget.attr('targetWidth')) / this.zoomValue) + 'px');
			idRadarTarget.css('height', (parseInt(idRadarTarget.attr('targetHeight')) / this.zoomValue) + 'px');
			idRadarTarget.css('left', this.matrix[4] * this.scaleRadar / this.zoomValue);
			idRadarTarget.css('top', this.matrix[5] * this.scaleRadar / this.zoomValue);
		}
		else {
			idRadarTarget.css('display', 'none');
		}
	}
	
	// Check Out Pan Function
	// checks whether pan is still possible and enables or disables the mouseover event on pan controls
	this.checkOutPan = function() {
		if(this.matrix[4] == 0) {
			$(this.panBoxControls[2][0].node).unbind();
			$(this.panBoxControls[2][1].node).unbind();
			this.panBoxControls[2][0].attr({
				"fill": "#CCCCCC",
				"stroke": "#CCCCCC",
				"cursor": "no-drop"
			});
			this.panBoxControls[2][1].attr({
				"fill": "#CCCCCC",
				"stroke": "#CCCCCC",
				"cursor": "no-drop"
			});
		}
		if(this.matrix[4] > 0) {
			$(this.panBoxControls[2][0].node).bind('mouseover', function() {
				KBGraphic.panBoxControls[2][0].attr({
					"fill": "#25963A",
					"stroke": "#25963A",
					"cursor": "pointer"
				});
				KBGraphic.panBoxControls[2][1].attr({
					"fill": "#25963A",
					"stroke": "#25963A",
					"cursor": "pointer"
				});
			});
			$(this.panBoxControls[2][0].node).bind('mouseout', function() {
				KBGraphic.panBoxControls[2][0].attr({
					"fill": "#A2A2A2",
					"stroke": "#A2A2A2",
					"cursor": "default"
				});
				KBGraphic.panBoxControls[2][1].attr({
					"fill": "#A2A2A2",
					"stroke": "#A2A2A2",
					"cursor": "default"
				});
			});
			$(this.panBoxControls[2][1].node).bind('mouseover', function() {
				KBGraphic.panBoxControls[2][0].attr({
					"fill": "#25963A",
					"stroke": "#25963A",
					"cursor": "pointer"
				});
				KBGraphic.panBoxControls[2][1].attr({
					"fill": "#25963A",
					"stroke": "#25963A",
					"cursor": "pointer"
				});
			});
			$(this.panBoxControls[2][1].node).bind('mouseout', function() {
				KBGraphic.panBoxControls[2][0].attr({
					"fill": "#A2A2A2",
					"stroke": "#A2A2A2",
					"cursor": "default"
				});
				KBGraphic.panBoxControls[2][1].attr({
					"fill": "#A2A2A2",
					"stroke": "#A2A2A2",
					"cursor": "default"
				});
			});
			this.panBoxControls[2][0].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "pointer"
			});
			this.panBoxControls[2][1].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "pointer"
			});
		}
		if(this.matrix[4] < this.width * (this.zoomValue - 1)) {
			$(this.panBoxControls[3][0].node).bind('mouseover', function() {
				KBGraphic.panBoxControls[3][0].attr({
					"fill": "#25963A",
					"stroke": "#25963A",
					"cursor": "pointer"
				});
				KBGraphic.panBoxControls[3][1].attr({
					"fill": "#25963A",
					"stroke": "#25963A",
					"cursor": "pointer"
				});
			});
			$(this.panBoxControls[3][0].node).bind('mouseout', function() {
				KBGraphic.panBoxControls[3][0].attr({
					"fill": "#A2A2A2",
					"stroke": "#A2A2A2",
					"cursor": "default"
				});
				KBGraphic.panBoxControls[3][1].attr({
					"fill": "#A2A2A2",
					"stroke": "#A2A2A2",
					"cursor": "default"
				});
			});
			$(this.panBoxControls[3][1].node).bind('mouseover', function() {
				KBGraphic.panBoxControls[3][0].attr({
					"fill": "#25963A",
					"stroke": "#25963A",
					"cursor": "pointer"
				});
				KBGraphic.panBoxControls[3][1].attr({
					"fill": "#25963A",
					"stroke": "#25963A",
					"cursor": "pointer"
				});
			});
			$(this.panBoxControls[3][1].node).bind('mouseout', function() {
				KBGraphic.panBoxControls[3][0].attr({
					"fill": "#A2A2A2",
					"stroke": "#A2A2A2",
					"cursor": "default"
				});
				KBGraphic.panBoxControls[3][1].attr({
					"fill": "#A2A2A2",
					"stroke": "#A2A2A2",
					"cursor": "default"
				});
			});
			this.panBoxControls[3][0].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "pointer"
			});
			this.panBoxControls[3][1].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "pointer"
			});
		}
		if(this.matrix[4] == this.width * (this.zoomValue - 1)) {
			$(this.panBoxControls[3][0].node).unbind();
			$(this.panBoxControls[3][1].node).unbind();
			this.panBoxControls[3][0].attr({
				"fill": "#CCCCCC",
				"stroke": "#CCCCCC",
				"cursor": "no-drop"
			});
			this.panBoxControls[3][1].attr({
				"fill": "#CCCCCC",
				"stroke": "#CCCCCC",
				"cursor": "no-drop"
			});
		}
		if(this.matrix[5] == 0) {
			$(this.panBoxControls[0][0].node).unbind();
			$(this.panBoxControls[0][1].node).unbind();
			this.panBoxControls[0][0].attr({
				"fill": "#CCCCCC",
				"stroke": "#CCCCCC",
				"cursor": "no-drop"
			});
			this.panBoxControls[0][1].attr({
				"fill": "#CCCCCC",
				"stroke": "#CCCCCC",
				"cursor": "no-drop"
			});
		}
		if(this.matrix[5] > 0) {
			$(this.panBoxControls[0][0].node).bind('mouseover', function() {
				KBGraphic.panBoxControls[0][0].attr({
					"fill": "#25963A",
					"stroke": "#25963A",
					"cursor": "pointer"
				});
				KBGraphic.panBoxControls[0][1].attr({
					"fill": "#25963A",
					"stroke": "#25963A",
					"cursor": "pointer"
				});
			});
			$(this.panBoxControls[0][0].node).bind('mouseout', function() {
				KBGraphic.panBoxControls[0][0].attr({
					"fill": "#A2A2A2",
					"stroke": "#A2A2A2",
					"cursor": "default"
				});
				KBGraphic.panBoxControls[0][1].attr({
					"fill": "#A2A2A2",
					"stroke": "#A2A2A2",
					"cursor": "default"
				});
			});
			$(this.panBoxControls[0][1].node).bind('mouseover', function() {
				KBGraphic.panBoxControls[0][0].attr({
					"fill": "#25963A",
					"stroke": "#25963A",
					"cursor": "pointer"
				});
				KBGraphic.panBoxControls[0][1].attr({
					"fill": "#25963A",
					"stroke": "#25963A",
					"cursor": "pointer"
				});
			});
			$(this.panBoxControls[0][1].node).bind('mouseout', function() {
				KBGraphic.panBoxControls[0][0].attr({
					"fill": "#A2A2A2",
					"stroke": "#A2A2A2",
					"cursor": "default"
				});
				KBGraphic.panBoxControls[0][1].attr({
					"fill": "#A2A2A2",
					"stroke": "#A2A2A2",
					"cursor": "default"
				});
			});
			this.panBoxControls[0][0].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "pointer"
			});
			this.panBoxControls[0][1].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "pointer"
			});
		}
		if(this.matrix[5] < this.height * (this.zoomValue - 1)) {
			$(this.panBoxControls[1][0].node).bind('mouseover', function() {
				KBGraphic.panBoxControls[1][0].attr({
					"fill": "#25963A",
					"stroke": "#25963A",
					"cursor": "pointer"
				});
				KBGraphic.panBoxControls[1][1].attr({
					"fill": "#25963A",
					"stroke": "#25963A",
					"cursor": "pointer"
				});
			});
			$(this.panBoxControls[1][0].node).bind('mouseout', function() {
				KBGraphic.panBoxControls[1][0].attr({
					"fill": "#A2A2A2",
					"stroke": "#A2A2A2",
					"cursor": "default"
				});
				KBGraphic.panBoxControls[1][1].attr({
					"fill": "#A2A2A2",
					"stroke": "#A2A2A2",
					"cursor": "default"
				});
			});
			$(this.panBoxControls[1][1].node).bind('mouseover', function() {
				KBGraphic.panBoxControls[1][0].attr({
					"fill": "#25963A",
					"stroke": "#25963A",
					"cursor": "pointer"
				});
				KBGraphic.panBoxControls[1][1].attr({
					"fill": "#25963A",
					"stroke": "#25963A",
					"cursor": "pointer"
				});
			});
			$(this.panBoxControls[1][1].node).bind('mouseout', function() {
				KBGraphic.panBoxControls[1][0].attr({
					"fill": "#A2A2A2",
					"stroke": "#A2A2A2",
					"cursor": "default"
				});
				KBGraphic.panBoxControls[1][1].attr({
					"fill": "#A2A2A2",
					"stroke": "#A2A2A2",
					"cursor": "default"
				});
			});
			this.panBoxControls[1][0].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "pointer"
			});
			this.panBoxControls[1][1].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "pointer"
			});
		}
		if(this.matrix[5] == this.height * (this.zoomValue - 1)) {
			$(this.panBoxControls[1][0].node).unbind();
			$(this.panBoxControls[1][1].node).unbind();
			this.panBoxControls[1][0].attr({
				"fill": "#CCCCCC",
				"stroke": "#CCCCCC",
				"cursor": "no-drop"
			});
			this.panBoxControls[1][1].attr({
				"fill": "#CCCCCC",
				"stroke": "#CCCCCC",
				"cursor": "no-drop"
			});
		}
	}
	
	// Check Out Zoom Function
	// checks whether zoom is still possible and enables or disables the mouseover event on zoom controls
	this.checkOutZoom = function() {
		$('.zoom-value').text(Math.round(this.zoomValue * 100));
		if(this.zoomValue == this.minZoom) {
			$('.zoom-minus').unbind('mouseover');
			$('.zoom-minus').css('cursor', 'no-drop');			
		}
		if(this.zoomValue > this.minZoom) {
			$('.zoom-minus').bind('mouseover', function() {
				$(this).css('cursor', 'pointer');
			});
		}
		if(this.zoomValue < this.maxZoom) {
			$('.zoom-plus').bind('mouseover', function() {
				$(this).css('cursor', 'pointer');
			});
		}
		if(this.zoomValue == this.maxZoom) {
			$('.zoom-plus').unbind('mouseover');
			$('.zoom-plus').css('cursor', 'no-drop');			
		}
	}
	
	//  Set Zoom Controls Function
	// creates the zoom and pan feature
	this.setZoomControls = function(paper, viewport, matrix) {
		// Control Box
		var idControlBox = this.idPaper + '_controls';
		$('<div id="' + idControlBox + '"></div>').insertAfter('#' + this.idPaper); // adds the div with pan controls
		$('#' + idControlBox).css('float', 'left');		  //
		$('#' + idControlBox).css('clear', 'right');	  // CSS for the div
		$('#' + idControlBox).css('margin-left', '20px'); //  with pan controls
		$('#' + idControlBox).css('margin-top', '20px');  //
		
		// Pan Controls
		var idPanControls = this.idPaper + '_pan_controls';
		$('<div id="' + idPanControls + '"></div>').appendTo('#' + idControlBox); // adds the div with pan controls
		var panBox = Raphael(idPanControls, 100, 100); // draws the controls  canvas
		this.panBoxControls.push(
			panBox.arrow(50, 50, 50, 15, 9, '#A2A2A2', true),    // upArrow
			panBox.arrow(50, 50, 50, 85, 9, '#A2A2A2', true),    // downArrow
			panBox.arrow(50, 50, 15, 50, 9, '#A2A2A2', true),    // leftArrow
			panBox.arrow(50, 50, 85, 50, 9, '#A2A2A2', true)     // rightArrow
		);
		// draws a circle as a "background" decorator for the pan controls
		panBox.circle(50, 50, 45).attr({
			"stroke": "none",
			"fill": "r#FFFFFF-#DDDDDD"
		}).toBack();
		// enables pan feature on click event
		var timeout;
		this.panBoxControls[0][0].mousedown(function() {
			timeout = setInterval(function(){
		        KBGraphic.updateMatrix(5, 1, "-");
				KBGraphic.processMatrix();
		    }, 5);
		});
		this.panBoxControls[0][1].mousedown(function() {
			timeout = setInterval(function(){
		        KBGraphic.updateMatrix(5, 1, "-");
				KBGraphic.processMatrix();
		    }, 5);
		});
		this.panBoxControls[1][0].mousedown(function() {
			timeout = setInterval(function(){
		        KBGraphic.updateMatrix(5, 1, "+");
				KBGraphic.processMatrix();
		    }, 5);
		});
		this.panBoxControls[1][1].mousedown(function() {
			timeout = setInterval(function(){
		        KBGraphic.updateMatrix(5, 1, "+");
				KBGraphic.processMatrix();
		    }, 5);
		});
		this.panBoxControls[2][0].mousedown(function() {
			timeout = setInterval(function(){
		        KBGraphic.updateMatrix(4, 1, "-");
				KBGraphic.processMatrix();
		    }, 5);
		});
		this.panBoxControls[2][1].mousedown(function() {
			timeout = setInterval(function(){
		        KBGraphic.updateMatrix(4, 1, "-");
				KBGraphic.processMatrix();
		    }, 5);
		});
		this.panBoxControls[3][0].mousedown(function() {
			timeout = setInterval(function(){
		        KBGraphic.updateMatrix(4, 1, "+");
				KBGraphic.processMatrix();
		    }, 5);
		});
		this.panBoxControls[3][1].mousedown(function() {
			timeout = setInterval(function(){
		        KBGraphic.updateMatrix(4, 1, "+");
				KBGraphic.processMatrix();
		    }, 5);
		});
		
		// Zoom Controls
		var idZoomControls = this.idPaper + '_zoom_controls';
		var idZoomControlsList = this.idPaper + '_zoom_controls_list';
		$('<div id="' + idZoomControls + '"></div>').appendTo('#' + idControlBox); // adds the div with zoom controls
		$('#' + idZoomControls).css('margin-top', '30px');
		var idZoomControlsList = this.idPaper + '_zoom_controls_list';
		// adds the ul for list of zoom controls
		$('<ul id="' + idZoomControlsList + '" class="ui-widget ui-helper-clearfix">'
			+ '<li class="zoom-buttons"><span class="zoom-minus"></span></li>'
			+ '<li><p class="zoom-label">Zoom : <span class="zoom-value"></span>%</p></li>'
			+ '<li class="zoom-buttons"><span class="zoom-plus"></span></li>'
		+ '</ul>').appendTo('#' + idZoomControls);
		$('#' + idZoomControlsList + ' li').css('list-style', 'none');
		$('#' + idZoomControlsList + ' li').css('float', 'left');
		$('.zoom-plus').addClass('ui-icon ui-icon-circle-plus');
		$('.zoom-plus').bind('mousedown', function() {
			KBGraphic.updateZoom(5, "+");
			KBGraphic.processZoom();	
		});
		$('.zoom-minus').addClass('ui-icon ui-icon-circle-minus');
		$('.zoom-minus').bind('mousedown', function() {
			KBGraphic.updateZoom(5, "-");
			KBGraphic.processZoom();
		});
		$('.zoom-label').css('margin-top', '4px');
		$('.zoom-label').css('margin-bottom', '4px');
		$('.zoom-value').css('font-weight', 'bold');
		$('.zoom-value').text(this.zoomValue * 100);
		$('.ui-icon').css('margin', '4px');
		
		// Mini Radar
		var idRadar = this.idPaper + '_radar';
		var idRadarTarget = idRadar + '_target';
		var targetWidth = this.width * this.scaleRadar;
		var targetHeight = this.height * this.scaleRadar;
		$('<div id="' + idRadar + '"></div>').appendTo('#' + idControlBox); // adds the div with radar
		$('#' + idRadar).css('margin-top', '30px');
		$('#' + idRadar).css('border', '1px #A2A2A2 dashed');
		$('#' + idRadar).css('width', targetWidth + 'px');
		$('#' + idRadar).css('height', targetHeight + 'px');
		$('<div id="' + idRadarTarget + '">&nbsp;</div>').appendTo('#' + idRadar); // adds the div with radar
		$('#' + idRadarTarget).css('border', '1px #A60000 solid');
		$('#' + idRadarTarget).css('width', targetWidth + 'px');
		$('#' + idRadarTarget).css('height', targetHeight + 'px');
		$('#' + idRadarTarget).attr('targetHeight', targetHeight);
		$('#' + idRadarTarget).attr('targetWidth', targetWidth);
		$('#' + idRadarTarget).css('position', 'relative');
		$('#' + idRadarTarget).css('left', '0');
		$('#' + idRadarTarget).css('right', '0');

		// stops the handler function when click is stopped
		$(document).mouseup(function(){
		    clearInterval(timeout);
		    return false;
		});
	};
	
	this.updateZoom = function(zoom, mode) {
		zoom = zoom / 100;
		switch(mode) {
			case "+":
				if(this.zoomValue + zoom <= this.maxZoom) this.zoomValue += zoom;
				else this.zoomValue = this.maxZoom;
				break;
			case "-":
				if(this.zoomValue - zoom  >= this.minZoom) this.zoomValue -= zoom;
				else this.zoomValue = this.minZoom;
				break;
			case "set":
				if((zoom >= this.minZoom) && (zoom <= this.maxZoom)) this.zoomValue = zoom;
				break;
		}
	}
	
	this.processZoom = function() {
		this.paper.setZoom(this.zoomValue);
		this.checkOutZoom();
		this.checkOutPan();
		this.checkOutRadar();
	}
	
	this.updateMatrix = function(index, value, mode) {
		if(index == 4) {
			switch(mode) {
				case "+":
					if(this.matrix[4] + value <= this.width * (this.zoomValue - 1)) this.matrix[4] += value;
					else this.matrix[4] = this.width * (this.zoomValue - 1);
					break;
				case "-":
					if(this.matrix[4] - value >= 0) this.matrix[4] -= value;
					else this.matrix[4] = 0;
					break;
			}
			return true;
		}
		if(index == 5) {
			switch(mode) {
				case "+":
					if(this.matrix[5] + value <= this.height * (this.zoomValue - 1)) this.matrix[5] += value;
					else this.matrix[5] = this.height * (this.zoomValue - 1);
					break;
				case "-":
					if(this.matrix[5] - value >= 0) this.matrix[5] -= value;
					else this.matrix[5] = 0;
					break;
			}
			return true;
		}
	}
	
	this.processMatrix = function() {
		this.viewport.setAttribute(
			'transform', 
			'matrix(' + this.matrix[0] + ', ' + this.matrix[1] + ', ' + this.matrix[2] + ', ' + this.matrix[3] + ', ' + this.matrix[4] + ', ' + this.matrix[5] + ')'
		);
		this.checkOutPan();
		this.checkOutRadar();
	}
};
