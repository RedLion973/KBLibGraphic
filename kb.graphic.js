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

// draws links between 2 elements
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
			bg: bg && bg.split && this.path(path).initZoom().toBack() && this.path(path).setAttr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}).toBack(),
			line: this.path(path).initZoom().toBack() && this.path(path).setAttr({stroke: color, fill: "none"}).toBack(),
			from: obj1,
			to: obj2
		};
	}
};

// draw an arrow with its branch or not
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

// draws an element as a file graphic representation
Raphael.fn.file = function(maxx, maxy, fsize, type, data) {
	var c;
	var t;
	var cInv;
	
	switch(type) {
		case "step":
			c = '270-#FFFFFF-#DCFFBD';
			cInv = '270-#DCFFBD-#FFFFFF';
			t = '#75D025';
			break;
		case "process":
			c = '270-#FFFFFF-#FFECC1';
			cInv = '270-#FFECC1-#FFFFFF';
			t = '#FFC53C';
			break;
		case "act":
			c = '270-#FFFFFF-#C5F0FF';
			cInv = '270-#C5F0FF-#FFFFFF';
			t = '#2EC7FF';
			break;
		case "task":
			c = '270-#FFFFFF-#F4C7FF';
			cInv = '270-#F4C7FF-#FFFFFF';
			t = '#D942FF';
			break;
	}
	
	var x = Math.floor(Math.random() * maxx + 1);
	var y = Math.floor(Math.random() * maxy + 1);
	// Text
	var text = this.text(x + 12, y, data[1]).attr({"font-size": fsize, "font-family": "Verdana", fill: t, "text-anchor": "start"});
	var w = text.getBBox().width + 30;
	var h = text.getBBox().height + 30;
	var dx = 0;
	var dy = 0;
	if((x + w + 5) > maxx) x = x - ((x + w + 5) - maxx);
	if((y + h + 5) > maxy) y = y - ((y + h + 5) - maxy);
	text.translate(x + 12 - text.attr("x"), y + (h / 2) - text.attr("y"));
	text.initZoom();
	// Corner
	var corner = this.path(
		"M" + x + " " + (y + 12)
		+ " L" + (x + 12) + " " + (y + 12)
		+ " L" + (x + 12) + " " + y 
		+ " L" + x + y + " Z"
	).initZoom();
	corner.setAttr({fill: c.split("-")[1], stroke: t, "stroke-width": 1, opacity: 1, "title": data[0]});
	// Reflection
	var reflect = this.rect(x, y + h, w, h / 4).initZoom();
	reflect.setAttr({fill: cInv, stroke: "none", opacity: 0.1});
	// MainBox
	var mainBox = this.path(
		"M" + (x + 12) + " " + y
		+ " L" + (x + w) + " " + y
		+ " L" + (x + w) + " " + (y + h)
		+ " L" + x + " " + (y + h)
		+ " L" + x + " " + (y + 12)
		+ " L" + (x + 12) + " " + (y + 12)
		+ " L" + (x + 12) + " " + y + " Z"
	).initZoom();
	mainBox.setAttr({fill: c, stroke: t, "stroke-width": 1, opacity: 1, "title": data[0]});	
	text.toFront();
	return [mainBox, corner, text, reflect];
} 

// Class KBElement
function KBElement(type, representation, fzise, data) {
	this.raphElement;
	this.linkedElements = new Array();
	this.links = new Array();
	this.canvas = KBGraphic.paper;
	this.type = type;
	this.representation = representation;
	this.fontSize = fzise;
	this.data = data;
	
	this.init = function() {
		this.setElement(this.type, this.representation, this.fontSize, this.data);
		this.setSimpleDragAndDrop(this.links, this.raphElement);
	};
	
	this.setElement = function(type, representation, fsize, data) {
		switch(representation) {
			case "file":
				var x = Math.floor(Math.random() * (KBGraphic.width - 51) + 1);
				var y = Math.floor(Math.random() * (KBGraphic.height - 51) + 1);
				this.raphElement = this.canvas.file(KBGraphic.width - 51, KBGraphic.height - 51, fsize, type, data);
				break;
			case "ball":
				break;
		}
	};
	
	this.setSimpleDragAndDrop = function(links, elements) {
		var start = function() {
			for(var s = 0; s < elements.length; s++) {
				switch (elements[s].type) {
					case "path":
						var path = elements[s].pathToR();
						var dim = elements[s].pathDim(path);
						elements[s].ox = path[0][1];
						elements[s].oy = path[0][2];
						elements[s].w = dim.width;
						elements[s].h = dim.height;
						break;
					case "circle":
						elements[s].ox = elements[s].attr("cx");
						elements[s].oy = elements[s].attr("cy");
						elements[s].r = elements[s].attr("r");
						break;
					default:
						elements[s].ox = elements[s].attr("x");
						elements[s].oy = elements[s].attr("y");
						if(elements[s].type == "text") {
							elements[s].w = elements[s].getBBox().width;
							elements[s].h = elements[s].getBBox().height;
						}
						else {
							elements[s].w = elements[s].attr("width");
							elements[s].h = elements[s].attr("height");
						}
						break;
				}
				
				if(elements[s].attr("opacity")) {
					elements[s].oop = elements[s].attr("opacity");
				}
				else {
					elements[s].oop = 1;
				}
				if(s < 1) elements[s].animate({"fill-opacity": 0}, 500);
			}
			for(var i = 0; i < links.length; i++) {
				links[i].line.attr({"stroke-width": 2.5});
			}
		},
		move = function(dx, dy) {
			for(var m = 0; m < elements.length; m++) {
				switch (elements[m].type) {
					case "path":
						var nx = elements[m].ox + dx;
						var ny = elements[m].oy + dy;
						
						if(m == 0) {
							if(nx < 0) nx = 12;
							if(nx + elements[m].w > KBGraphic.width * KBGraphic.zoomValue) nx = KBGraphic.width * KBGraphic.zoomValue - elements[m].w + 12;
							if(ny < 0) ny = 0;
							if(ny > KBGraphic.height * KBGraphic.zoomValue - elements[m].h - elements[3].h) ny = KBGraphic.height * KBGraphic.zoomValue - elements[m].h - elements[3].h;
						}
						else {
							if(nx < 0) nx = 0;
							if(nx + elements[0].w > KBGraphic.width * KBGraphic.zoomValue) nx = KBGraphic.width * KBGraphic.zoomValue - elements[0].w;
							if(ny < elements[m].h) ny = elements[m].h;
							if(ny + elements[0].h > KBGraphic.height * KBGraphic.zoomValue) ny = KBGraphic.height * KBGraphic.zoomValue - elements[0].h;
						}
						
						var path = elements[m].pathToR();
						path[0][1] = nx;
						path[0][2] = ny;
						elements[m].setAttr({path: path});
						break;
					case "circle":
						var nx = elements[m].ox + dx - elements[m].r;
						var ny = elements[m].oy + dy - elements[m].r;
						
						if(nx < 0) nx = elements[m].r;
						if(nx > KBGraphic.width * KBGraphic.zoomValue) nx = KBGraphic.width * KBGraphic.zoomValue - elements[m].r;
						if(ny < 0) ny = elements[m].r;
						if(ny > KBGraphic.height * KBGraphic.zoomValue) ny = KBGraphic.height * KBGraphic.zoomValue - elements[m].r;
						
						elements[m].setAttr({
							cx: nx, 
							cy: ny
						});
						break;
					default:
						var nx = elements[m].ox + dx;
						var ny = elements[m].oy + dy;
						
						if(elements[m].type == "text") {
							if(nx < 0) nx = 15;
							if(nx > KBGraphic.width * KBGraphic.zoomValue - elements[m].w - 15) nx = KBGraphic.width * KBGraphic.zoomValue - elements[m].w - 15;
							if(ny < 12 + elements[m].h / 2) ny = elements[m].h / 2 + 12;
							if(ny > KBGraphic.height * KBGraphic.zoomValue - elements[0].h / 2 - elements[3].h) ny = KBGraphic.height * KBGraphic.zoomValue - elements[0].h / 2 - elements[3].h;
						}
						else {
							if(nx < 0) nx = 0;
							if(nx > KBGraphic.width * KBGraphic.zoomValue - elements[m].w) nx = KBGraphic.width * KBGraphic.zoomValue - elements[m].w;
							if(ny < elements[0].h) ny = elements[0].h;
							if(ny > KBGraphic.height * KBGraphic.zoomValue - elements[m].h) ny = KBGraphic.height * KBGraphic.zoomValue - elements[m].h;
						}
						
						elements[m].setAttr({
							x: nx, 
							y: ny
						});
						break;
				}
			}
			for (var i = links.length; i--;) {
				this.paper.connection(links[i]);
			}
		},
		up = function() {
			for(var u = 0; u < elements.length; u++) {
				elements[u].setAttr({
					cursor: "pointer"
				});
				if(u < 1) elements[u].animate({"fill-opacity": elements[u].oop}, 500);
			}

			for(var i = 0; i < links.length; i++) {
				links[i].line.attr({"stroke-width": .8});
			}
		};
		
		this.raphElement[0].drag(move, start, up);
	};
	
	this.drawLink = function() {
		for(var i = 0; i < this.linkedElements.length; i++) {
			var link = this.raphElement[0].paper.connection(
				this.raphElement[0],
				this.linkedElements[i].raphElement[0],
				"#000000"
			);
			this.links.push(link);
			this.linkedElements[i].links.push(link);
		}
		for(var i = 0; i < this.links.length; i++) {
			this.links[i].line.attr({"stroke-width": .8});
		}
	};
}

var KBGraphic = new function() {
	this.paper; // main canvas for drawing
	this.viewport; // canvas zone the user can see
	this.matrix; // matrix for the viewport transform attribute
	this.width; // canvas width
	this.height; // canvas height
	this.idPaper; // CSS id of the div containing the graphical elements
	this.save2PNG; // CSS id of the png save button
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
		this.save2PNG = id + '_save2png';
		$('<a id="' + this.save2PNG + '" href="#">Save to PNG</a>').appendTo('#' + id);
		$('<form id="saveForm" method="post" action="svg2png.php">'
		+ '<input id="svgInput" type="hidden" name="svg" value="" />'
		+ '<input id="svgWidth" type="hidden" name="width" value="' + this.width + '" />'
		+ '<input id="svgHeight" type="hidden" name="height" value="' + this.height + '" />'
		+ '</form>').appendTo('#' + id);
		$('#saveForm').ajaxForm();
		$('#' + this.save2PNG).css('margin', '20px');	
		$('#' + this.save2PNG).click(function() {
			var svg = $('#' + KBGraphic.idPaper);
			var link = $(this);
			$('#svgInput').attr('value', svg.html());
			$('#saveForm').ajaxSubmit({
				success: function() {					
					window.open('getimage.php?file=test.png');
				}
			});
			return false;
		});	
	};
		
	this.draw = function() {
		var t = new KBElement("step", "file", 10, ["Étape 01", "Étape 01\n\nDescription : OK.\n\nCommentaires : Je suis une étape\nEntrée : Ok !!!!!!!!!!!!!"]);
		t.init();
		var a = new KBElement("process", "file", 10, ["Processus 01", "Processus 01\n\nDescription : OK.\n\nCommentaires : Aucun\nTest : Ok !!!!!!!!!!!!!"]);
		a.init();
		var b = new KBElement("act", "file", 10, ["Acte 01", "Acte 01\n\nDescription : OK.\n\nCommentaires : Aucun\nTest : Ok !!!!!!!!!!!!!"]);
		b.init();
		var c = new KBElement("act", "file", 10, ["Acte 02", "Acte 02\n\nDescription : OK.\n\nCommentaires : Bah oui ! Ici !\nTest : Ok !!!!!!!!!!!!!"]);
		c.init();
		var d = new KBElement("act", "file", 10, ["Acte 03", "Acte 03\n\nDescription : OK.\n\nCommentaires : ******\nTest : Ok !!!!!!!!!!!!!"]);
		d.init();
		var e = new KBElement("task", "file", 10, ["Tâche 01", "Tâche 01\n\nDescription : OK.\n\nCommentaires : *+++++**\nTest : Ok !!!!!!!!!!!!!"]);
		e.init();
		var f = new KBElement("task", "file", 10, ["Tâche 02", "Tâche 02\n\nDescription : OK.\n\nCommentaires : **+++-+-++*\nTest : Ok !!!!!!!!!!!!!"]);
		f.init();
		a.linkedElements.push(b, c, d);
		a.drawLink();
		t.linkedElements.push(a);
		t.drawLink();
		c.linkedElements.push(e, f);
		c.drawLink();
		/*var b = new KBElement(this.paper.file(100, 100, 100, 55, 10, "etape", ["Étape 01", "Étape 01"]));
		var c = new KBElement(this.paper.file(600, 200, 100, 55, 10, "act", ["Acte 01", "Acte 01"]));
		var d = new KBElement(this.paper.file(300, 300, 100, 55, 10, "task", ["Tâche 01", "Tâche 01"]));*/
		this.elements.push(a, b, c, d);
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
