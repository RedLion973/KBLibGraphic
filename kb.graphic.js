////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//                                                                            //
//    KBLibGraphic                                                            //
//    Author : Ludovic LEGENDART                                              //
//    Version : 1.0                                                           //
//    Date : 2011                                                             //
//    Project : KBBox                                                         //
//    Description : Librairie graphique permettant la génération de visuel    //
//                  pour les parcours clients créés à partir de la KBBox.     //
//                                                                            //
//    Dépendances : jQuery / jQuery-UI / RaphaelJS / Basic JavaScript         //
//                                                                            //
//                                                                            //
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

Raphael.fn.panControls = {
	arrow: function (x1, y1, x2, y2, size, color, branch) {
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
			this.setAttr({
				cx: this.ox + dx, 
				cy: this.oy + dy
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
	this.zoom; // zoom flag
	this.zoomValue; // zoom flag
	this.minZoom; // minimum value of zoom
	this.maxZoom; // maximum value of zoom
	
	// Init function
	// it creates the canvas and all the controls depending on the parameters
	this.init = function(id, w, h, enableZoom, minZoom, maxZoom) {
		this.height = h;
		this.width = w;
		this.idPaper = id + "_graph"; // CSS id of the div containing the canvas
		$('<div id="' + this.idPaper + '"></div>').appendTo('#' + id); // adds the div where the canvas will be displayed
		$('#' + this.idPaper).css('float', 'left');				  //
		$('#' + this.idPaper).css('border', '2px #A2A2A2 solid'); //  CSS for the div
		$('#' + this.idPaper).css('margin', '20px'); 			  //
		$('<div id="' + this.idPaper + '_clear">&nbsp;</div>').appendTo('#' + id); // adds a div with clear style for a nice display
		$('#' + this.idPaper + '_clear').css('clear', 'both');	
		this.elements = new Array();
		// if zoom is not enabled
		if(enableZoom == false) {
			this.zoom = false;
			this.paper = Raphael(this.idPaper, this.width, this.height); // creates canvas without the zoom feature
		}
		else {
			// inverts max and min if misentered
			if(minZoom > maxZoom) {
				var invertZoom = minZoom;
				minZoom = maxZoom;
				maxZoom = invertZoom;
			}
			// checks the values, if there doesn't match, default values are used
			if((minZoom < 5) || (minZoom > 100) || (maxZoom < 100) || (maxZoom > 1000) || (minZoom == maxZoom)) {
				alert("Valeurs de zoom Min et Max trop faible ou trop élevée ou égales entre elles : utilisation des valeurs par défaut min = 25 et max = 300");
				minZoom = 25;
				maxZoom = 300;
			}
			// creates canvas without the zoom feature
			else {
				this.paper = Raphael(this.idPaper, this.width, this.height).initZoom(); // draws the main canvas and enables intern zoom feature	
				var zpd = new RaphaelZPD(this.paper, {zoom: false, pan: false, drag: false}); // enables intern pan feature				
				this.minZoom = minZoom;
				this.maxZoom = maxZoom;
				this.zoomValue = 1; // current zoom value set to 100%
				this.processZoom(this.zoomValue); // sets the zoom to the current value
				this.viewport = zpd.gelem; // sets the viewport
				//defines the default viewport transform matrix
				this.matrix = new Array();
				this.updateMatrix(0, 1, "set");
				this.updateMatrix(1, 0, "set");
				this.updateMatrix(2, 0, "set");
				this.updateMatrix(3, 1, "set");
				this.updateMatrix(4, 0, "set");
				this.updateMatrix(5, 0, "set");
				// drawing test
				this.draw();
				// creates the zoom and pan feature
				this.setZoomControls(this.paper, this.viewport, this.matrix);
			}
		}
	};
		
	this.draw = function() {
		var stage1 = new Array();
		var stage2 = new Array();
		
		for(var j = 0; j < 15; j++) {
			var x = new KBElement(this.paper.circle(35*j, 20*j, 10).initZoom());
			x.raphElement.setAttr({
						fill: '270-#FFFFFF-#000000',
						stroke: "none",
						cursor: "pointer"
			});
			x.init();
			stage1.push(x);
		}
		
		for(var h = 0; h < 3; h++) {
			var y = new KBElement(this.paper.circle(50*h, 100*h, 20).initZoom());
			y.raphElement.setAttr({
						fill: '270-#A60000-#000000',
						stroke: "none",
						cursor: "pointer"
			});
			y.init();
			stage2.push(y);
			for(var k = 5*h; k < 5*(h+1); k++) {
				y.linkedElements.push(stage1[k]);
			}
			y.drawLink();
		}
		
		var z = new KBElement(this.paper.circle(600, 200, 30).initZoom());
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

	//  Set Zoom Controls Function
	// creates the zoom and pan feature
	this.setZoomControls = function(paper, viewport, matrix) {	
		// Pan Controls
		var idPanControls = this.idPaper + '_pan_controls';
		$('<div id="' + idPanControls + '"></div>').insertAfter('#' + this.idPaper); // adds the div with pan controls
		var panBox = Raphael(idPanControls, 100, 100); // draws the controls  canvas
		$('#' + idPanControls).css('float', 'left');		//
		$('#' + idPanControls).css('clear', 'right');		// CSS for the div
		$('#' + idPanControls).css('margin-left', '20px'); //  with pan controls
		$('#' + idPanControls).css('margin-top', '20px');  //
		var panArrows = new Array(); // list of controls
		panArrows.push(
			panBox.panControls.arrow(50, 50, 50, 15, 8, '#A2A2A2', true),    // upArrow
			panBox.panControls.arrow(50, 50, 50, 85, 8, '#A2A2A2', true),    // downArrow
			panBox.panControls.arrow(50, 50, 15, 50, 8, '#A2A2A2', true),    // leftArrow
			panBox.panControls.arrow(50, 50, 85, 50, 8, '#A2A2A2', true),    // rightArrow
			panBox.panControls.arrow(30, 30, 29, 29, 8, '#A2A2A2', false),   // upLeftArrow
			panBox.panControls.arrow(70, 30, 71, 29, 8, '#A2A2A2', false),   // upRightArrow
			panBox.panControls.arrow(30, 70, 29, 71, 8, '#A2A2A2', false),   // downLeftArrow
			panBox.panControls.arrow(70, 70, 71, 71, 8, '#A2A2A2', false)    // downRightArrow
		);
		// draws a circle as a "background" decorator for the pan controls
		panBox.circle(50, 50, 45).attr({
			"stroke": "none",
			"fill": "r#FFFFFF-#B9DDC0"
		}).toBack();
		// enables the "hover" feature
		panArrows[0][0].mouseover(function() {
			panArrows[0][0].attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
			panArrows[0][1].attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
		});
		panArrows[0][0].mouseout(function() {
			panArrows[0][0].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
			panArrows[0][1].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
		});
		panArrows[0][1].mouseover(function() {
			panArrows[0][0].attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
			panArrows[0][1].attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
		});
		panArrows[0][1].mouseout(function() {
			panArrows[0][0].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
			panArrows[0][1].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
		});
		panArrows[1][0].mouseover(function() {
			panArrows[1][0].attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
			panArrows[1][1].attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
		});
		panArrows[1][0].mouseout(function() {
			panArrows[1][0].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
			panArrows[1][1].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
		});
		panArrows[1][1].mouseover(function() {
			panArrows[1][0].attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
			panArrows[1][1].attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
		});
		panArrows[1][1].mouseout(function() {
			panArrows[1][0].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
			panArrows[1][1].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
		});
		panArrows[2][0].mouseover(function() {
			panArrows[2][0].attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
			panArrows[2][1].attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
		});
		panArrows[2][0].mouseout(function() {
			panArrows[2][0].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
			panArrows[2][1].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
		});
		panArrows[2][1].mouseover(function() {
			panArrows[2][0].attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
			panArrows[2][1].attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
		});
		panArrows[2][1].mouseout(function() {
			panArrows[2][0].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
			panArrows[2][1].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
		});
		panArrows[3][0].mouseover(function() {
			panArrows[3][0].attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
			panArrows[3][1].attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
		});
		panArrows[3][0].mouseout(function() {
			panArrows[3][0].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
			panArrows[3][1].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
		});
		panArrows[3][1].mouseover(function() {
			panArrows[3][0].attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
			panArrows[3][1].attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
		});
		panArrows[3][1].mouseout(function() {
			panArrows[3][0].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
			panArrows[3][1].attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
		});
		panArrows[4].mouseover(function() {
			this.attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
		});
		panArrows[4].mouseout(function() {
			this.attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
		});
		panArrows[5].mouseover(function() {
			this.attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
		});
		panArrows[5].mouseout(function() {
			this.attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
		});
		panArrows[6].mouseover(function() {
			this.attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
		});
		panArrows[6].mouseout(function() {
			this.attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
		});
		panArrows[7].mouseover(function() {
			this.attr({
				"fill": "#25963A",
				"stroke": "#25963A",
				"cursor": "pointer"
			});
		});
		panArrows[7].mouseout(function() {
			this.attr({
				"fill": "#A2A2A2",
				"stroke": "#A2A2A2",
				"cursor": "default"
			});
		});
		// pan feature functions
		function moveUp(){
			this.updateMatrix(5, 1, "-");
			this.processMatrix();
		}
		function moveDown(){
			this.updateMatrix(5, 1, "+");
			this.processMatrix();
		}
		function moveLeft(){
			this.updateMatrix(4, 1, "-");
			this.processMatrix();
		}
		function moveRight(){
			this.updateMatrix(4, 1, "+");
			this.processMatrix();
		}
		
		/*$('<div id="' + idZoomer + '_hpan"></div>').insertAfter("#" + this.idPaper);
		$('<div class="kb_visual_zoom"></div>').insertAfter(".kb_visual");
		$('<div id="' + idZoomer + '"></div><p id="' + idZoomer + '_label">Zoom : <span id="' + idZoomer + '_value">100</span>%</p>').appendTo(".kb_visual_zoom");
		$('<div id="' + idZoomer + '_value_selectors"><button value="50">50%</button><button value="100">100%</button><button value="150">150%</button><button value="200">200%</button><button value="250">250%</button></div>').insertAfter("#" + idZoomer + "_label");
		$('<div id="' + idZoomer + '_mini"></div>').insertAfter("#" + idZoomer);
		$('<div id="' + idZoomer + '_mini_active">&nbsp;</div>').appendTo("#" + idZoomer + "_mini");
		$("#" + idZoomer).addClass("kb_visual_zoomer");
		$("#" + idZoomer + "_label").addClass("kb_visual_zoomer_label");
		$("#" + idZoomer + "_value").addClass("kb_visual_zoomer_value");
		$("#" + idZoomer + "_value_selectors").addClass("kb_visual_zoomer_value_selectors");
		$("#" + idZoomer + "_vpan").addClass("kb_visual_zoomer_vpan");
		$("#" + idZoomer + "_hpan").addClass("kb_visual_zoomer_hpan");
		$("#" + idZoomer + "_mini").addClass("kb_visual_zoomer_mini");
		$("#" + idZoomer + "_mini_active").addClass("kb_visual_zoomer_mini_active");
		var zoomSlider = $("#" + idZoomer).slider({
			animate: true,
			orientation: "vertical",
			range: "min",
			min: 5,
			max: 350,
			value: 100,
			change: function(event, ui) {
				$("#" + idZoomer + "_value").text(ui.value);
				KBGraphic.zoom(ui.value);
				if(ui.value > 100) {
					$("#" + idZoomer + "_mini_active").css("width", (200 - ((ui.value - 100) * 0.568)) + "px");
					$("#" + idZoomer + "_mini_active").css("height", (107 - ((ui.value - 100) * 0.304)) + "px");
				}
				else {
					$("#" + idZoomer + "_mini_active").css("width", "200px");
					$("#" + idZoomer + "_mini_active").css("height", "107px");
				}
			},
			slide: function(event, ui) {
				$("#" + idZoomer + "_value").text(ui.value);
				KBGraphic.zoom(ui.value);
				if(ui.value > 100) {
					$("#" + idZoomer + "_mini_active").css("width", (200 - ((ui.value - 100) * 0.568)) + "px");
					$("#" + idZoomer + "_mini_active").css("height", (107 - ((ui.value - 100) * 0.304)) + "px");
				}
				else {
					$("#" + idZoomer + "_mini_active").css("width", "200px");
					$("#" + idZoomer + "_mini_active").css("height", "107px");
				}
			}
		});
		$("#" + idZoomer + "_vpan").slider({
			animate: true,
			orientation: "vertical",
			range: "max",
			min: 0,
			max: this.height,
			value: this.height,
			step: 1,
			slide: function(event, ui) {
				var matrix = canvas.gelem.getAttribute("transform");
				if(!matrix) {
					matrix = "matrix(1, 0, 0, 1, 0, " + KBGraphic.height + ")";
				}
				var reg = new RegExp("[(,]+","g");
				var matrix_exploded = matrix.split(reg);
				canvas.gelem.setAttribute("transform","matrix(" + matrix_exploded[1] + ", " + matrix_exploded[2] + ", " + matrix_exploded[3] + ", " + matrix_exploded[4] + ", " + matrix_exploded[5] + ", "+ (ui.value - KBGraphic.height) + ")");
				$("#" + idZoomer + "_mini_active").css("top", (- (ui.value - KBGraphic.height) * 0.1) + "px");
			}
		});
		$("#" + idZoomer + "_hpan").slider({
			animate: true,
			range: "min",
			min: 0,
			max: this.width,
			value: 0,
			step: 1,
			slide: function(event, ui) {
				var matrix = canvas.gelem.getAttribute("transform");
				if(!matrix) {
					matrix = "matrix(1, 0, 0, 1, 0, 0)";
				}
				var reg = new RegExp("[(,]+","g");
				var matrix_exploded = matrix.split(reg);
				canvas.gelem.setAttribute("transform","matrix(" + matrix_exploded[1] + ", " + matrix_exploded[2] + ", " + matrix_exploded[3] + ", " + matrix_exploded[4] + ", -" + (ui.value) + ", " + matrix_exploded[6]);
			}
		});
		$("#" + idZoomer + "_value_selectors button").each(function() {
			$(this).click(function() {
				zoomSlider.slider("value",$(this).attr("value"));
			});
		});*/
	};
	
	this.processZoom = function(zoom) {
		this.zoomValue = zoom / 100;
		this.paper.setZoom(this.zoomValue);
	}
	
	this.updateMatrix = function(index, value, mode) {
		switch(mode) {
			case "+":
				this.matrix[index] += value;
				break;
			case "-":
				this.matrix[index] -= value;
				break;
			case "set":
				this.matrix[index] = value;
				break;
		}
	}
	
	this.processMatrix = function() {
		this.viewport.setAttribute(
			'transform', 
			'matrix(' + this.matrix[0] + ', ' + this.matrix[1] + ', ' + this.matrix[2] + ', ' + this.matrix[3] + ', ' + this.matrix[4] + ', ' + this.matrix[5] + ')'
		);
	}
};
