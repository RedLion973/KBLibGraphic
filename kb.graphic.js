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

// PCElement Drawer
Raphael.fn.pcElementDrawer = {
	// draws an element as a file graphic representation
	file: function(maxx, maxy, fsize, type, title) {
		var c;
		var t;
		var cInv;
		
		switch(type) {
			case "offer":
				c = '270-#FFFFFF-#FFC2C2';
				cInv = '270-#FFC2C2-#FFFFFF';
				t = '#FF2323';
				break;
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
		var text = this.text(x + 12, y, title).attr({"font-size": fsize, "font-family": "Verdana", "font-weight": "bold", fill: t, "text-anchor": "start", "cursor": "pointer"});
		var w = text.getBBox().width + 23;
		var h = text.getBBox().height + 23;
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
		corner.setAttr({fill: c.split("-")[1], stroke: t, "stroke-width": 1, opacity: 1, "cursor": "pointer"});
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
		mainBox.setAttr({fill: c, stroke: t, "stroke-width": 1, opacity: 1, "cursor": "pointer"});	
		text.toFront();
		return [mainBox, corner, text, reflect];
	},

	// draw an element as a ball representation
	ball: function (maxx, maxy, fsize, type, title) {
		var c;
		var t;
		var cInv;
		var tooltip = $('#tooltip_ball');
		
		switch(type) {
			case "offer":
				c = 'r(.5,.9)#FFFFFF-#FFC2C2';
				cInv = 'r#FF2323-#FFFFFF';
				t = '#FF2323';
				break;
			case "step":
				c = 'r(.5,.9)#FFFFFF-#DCFFBD';
				cInv = 'r#75D025-#FFFFFF';
				t = '#75D025';
				break;
			case "process":
				c = 'r(.5,.9)#FFFFFF-#FFECC1';
				cInv = 'r#FFC53C-#FFFFFF';
				t = '#FFC53C';
				break;
			case "act":
				c = 'r(.5,.9)#FFFFFF-#C5F0FF';
				cInv = 'r#2EC7FF-#FFFFFF';
				t = '#2EC7FF';
				break;
			case "task":
				c = 'r(.5,.9)#FFFFFF-#F4C7FF';
				cInv = 'r#D942FF-#FFFFFF';
				t = '#D942FF';
				break;
		}
		
		var x = Math.floor(Math.random() * maxx + 1);
		var y = Math.floor(Math.random() * maxy + 1);
		// Text
		var text = this.text(x + 12, y, title).attr({"font-size": fsize, "font-family": "Verdana", "font-weight": "bold", fill: t, "cursor": "pointer"});
		var w = text.getBBox().width + 15;
		var h = text.getBBox().height + 15;
		var dx = 0;
		var dy = 0;
		if(w >= h) r = w / 2;
		else r = h / 2
		if(x > maxx - r) x = maxx - r;
		if(y > maxy - r) y = maxy - r;
		if(x < 1 - r) x = 1 + r;
		if(y < 1 - r) y = 1 + r;
		text.translate(x  - text.attr("x"), y - text.attr("y"));
		text.initZoom();
		// MainEllispe
		var mainEl = this.ellipse(x, y, r, r).initZoom();
		mainEl.setAttr({fill: c, stroke: "none", opacity: 1, "cursor": "pointer", stroke: t, "stroke-width": .4});
		// Light
		var light = this.ellipse(x, y, r - r / 5, r - r / 20).initZoom();
		light.setAttr({stroke: "none", fill: "r(.5,.1)#FFF-#FFF", opacity: 0, "cursor": "pointer"});
		// Reflection
		var reflect = this.ellipse(x, y + r - r / 5, r, r / 2).initZoom();
		reflect.setAttr({fill: cInv, stroke: "none", opacity: .4});
		text.toFront();
		reflect.toBack();
		return [mainEl, light, text, reflect];
	}
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
		this.setElement(this.type, this.representation, this.fontSize, this.data[0]);
		this.setDragAndDrop(this.links, this.raphElement);
		this.setHOver(this.data[1]);
	};
	
	this.setElement = function(type, representation, fsize, data) {
		switch(representation) {
			case "file":
				var x = Math.floor(Math.random() * (KBGraphic.width - 51) + 1);
				var y = Math.floor(Math.random() * (KBGraphic.height - 51) + 1);
				this.raphElement = this.canvas.pcElementDrawer.file(KBGraphic.width - 51, KBGraphic.height - 51, fsize, type, data);
				break;
			case "ball":
				var x = Math.floor(Math.random() * (KBGraphic.width - 51) + 1);
				var y = Math.floor(Math.random() * (KBGraphic.height - 51) + 1);
				this.raphElement = this.canvas.pcElementDrawer.ball(KBGraphic.width - 51, KBGraphic.height - 51, fsize, type, data);
				break;
		}
	};
	
	this.setDragAndDrop = function(links, elements) {
		switch(this.representation){
			case "file":
				var start = function() {
					// mainBox
					var path0 = elements[0].pathToR();
					var dim0 = elements[0].pathDim(path0);
					elements[0].ox = path0[0][1];
					elements[0].oy = path0[0][2];
					elements[0].w = dim0.width;
					elements[0].h = dim0.height;
					elements[0].oop = elements[0].attr("opacity");
					elements[0].animate({"fill-opacity": 0}, 600);
					// corner
					var path1 = elements[1].pathToR();
					var dim1 = elements[1].pathDim(path1);
					elements[1].ox = path1[0][1];
					elements[1].oy = path1[0][2];
					elements[1].w = dim1.width;
					elements[1].h = dim1.height;
					// text
					elements[2].ox = elements[2].attr("x");
					elements[2].oy = elements[2].attr("y");
					elements[2].w = elements[2].getBBox().width;
					elements[2].h = elements[2].getBBox().height;
					// reflection
					elements[3].ox = elements[3].attr("x");
					elements[3].oy = elements[3].attr("y");
					elements[3].w = elements[3].attr("width");
					elements[3].h = elements[3].attr("height");
					// saves opacity - if not set, saves as 1
					for(var s = 0; s < elements.length; s++) {
						if(elements[s].attr("opacity")) {
							elements[s].oop = elements[s].attr("opacity");
						}
						else {
							elements[s].oop = 1;
						}
					}
					// update connection links
					for(var i = 0; i < links.length; i++) {
						links[i].line.attr({"stroke-width": 2.5});
					}
				},
				move = function(dx, dy) {
					// mainBox
					var n0x = elements[0].ox + dx;
					var n0y = elements[0].oy + dy;
					if(n0x < 0) n0x = 12;
					if(n0x > KBGraphic.width * KBGraphic.zoomValue - elements[0].w + elements[1].h) n0x = KBGraphic.width * KBGraphic.zoomValue - elements[0].w + elements[1].h;
					if(n0y < 0) n0y = 0;
					if(n0y > KBGraphic.height * KBGraphic.zoomValue - elements[0].h - elements[3].h) n0y = KBGraphic.height * KBGraphic.zoomValue - elements[0].h - elements[3].h;
					var path0 = elements[0].pathToR();
					path0[0][1] = n0x;
					path0[0][2] = n0y;
					elements[0].setAttr({path: path0});
					// corner
					var n1x = elements[1].ox + dx;
					var n1y = elements[1].oy + dy;
					if(n1x < 0) n1x = 0;
					if(n1x + elements[0].w > KBGraphic.width * KBGraphic.zoomValue) n1x = KBGraphic.width * KBGraphic.zoomValue - elements[0].w;
					if(n1y < elements[1].h) n1y = elements[1].h;
					if(n1y > KBGraphic.height * KBGraphic.zoomValue - elements[0].h - elements[3].h + elements[1].h) n1y = KBGraphic.height * KBGraphic.zoomValue - elements[0].h - elements[3].h + elements[1].h;
					var path1 = elements[1].pathToR();
					path1[0][1] = n1x;
					path1[0][2] = n1y;
					elements[1].setAttr({path: path1});
					// text
					var n2x = elements[2].ox + dx;
					var n2y = elements[2].oy + dy;
					if(n2x < 0) n2x = 15;
					if(n2x > KBGraphic.width * KBGraphic.zoomValue - elements[2].w - 15) n2x = KBGraphic.width * KBGraphic.zoomValue - elements[2].w - 15;
					if(n2y < 12 + elements[2].h / 2) n2y = elements[2].h / 2 + 12;
					if(n2y > KBGraphic.height * KBGraphic.zoomValue - elements[0].h / 2 - elements[3].h) n2y = KBGraphic.height * KBGraphic.zoomValue - elements[0].h / 2 - elements[3].h;
					elements[2].setAttr({
						x: n2x, 
						y: n2y
					});
					// reflection
					var n3x = elements[3].ox + dx;
					var n3y = elements[3].oy + dy;
					if(n3x < 0) n3x = 0;
					if(n3x > KBGraphic.width * KBGraphic.zoomValue - elements[3].w) n3x = KBGraphic.width * KBGraphic.zoomValue - elements[3].w;
					if(n3y < elements[0].h) n3y = elements[0].h;
					if(n3y > KBGraphic.height * KBGraphic.zoomValue - elements[3].h) n3y = KBGraphic.height * KBGraphic.zoomValue - elements[3].h;
					elements[3].setAttr({
						x: n3x, 
						y: n3y
					});
					for (var i = links.length; i--;) {
						this.paper.connection(links[i]);
					}
				},
				up = function() {
					elements[0].animate({"fill-opacity": elements[0].oop}, 600);
					for(var i = 0; i < links.length; i++) {
						links[i].line.attr({"stroke-width": .8});
					}
				};
				elements[0].drag(move, start, up);
				elements[1].drag(move, start, up);
				elements[2].drag(move, start, up);
				break;
			case "ball":
				var start = function() {
					// mainEl
					elements[0].ox = elements[0].attr("cx");
					elements[0].oy = elements[0].attr("cy");
					elements[0].w = elements[0].attr("rx");
					elements[0].h = elements[0].attr("ry");
					elements[0].oop = elements[0].attr("opacity");
					elements[0].animate({"fill-opacity": 0}, 600);
					// light
					elements[1].ox = elements[1].attr("cx");
					elements[1].oy = elements[1].attr("cy");
					elements[1].w = elements[1].attr("rx");
					elements[1].h = elements[1].attr("ry");
					// text
					elements[2].ox = elements[2].attr("x");
					elements[2].oy = elements[2].attr("y");
					elements[2].w = elements[2].getBBox().width;
					elements[2].h = elements[2].getBBox().height;
					// reflection
					elements[3].ox = elements[3].attr("cx");
					elements[3].oy = elements[3].attr("cy");
					elements[3].w = elements[3].attr("rx");
					elements[3].h = elements[3].attr("ry");
					elements[3].animate({"fill-opacity": 0}, 600);
					// saves opacity - if not set, saves as 1
					for(var s = 0; s < elements.length; s++) {
						if(elements[s].attr("opacity")) {
							elements[s].oop = elements[s].attr("opacity");
						}
						else {
							elements[s].oop = 1;
						}
					}
					// update connection links
					for(var i = 0; i < links.length; i++) {
						links[i].line.attr({"stroke-width": 2.5});
					}
				},
				move = function(dx, dy) {
					// mainEl
					var n0x = elements[0].ox + dx;
					var n0y = elements[0].oy + dy;
					if(n0x < elements[0].w) n0x = elements[0].w;
					if(n0x > KBGraphic.width * KBGraphic.zoomValue - elements[0].w) n0x = KBGraphic.width * KBGraphic.zoomValue - elements[0].w;
					if(n0y < elements[0].h) n0y = elements[0].h;
					if(n0y > KBGraphic.height * KBGraphic.zoomValue - elements[0].h) n0y = KBGraphic.height * KBGraphic.zoomValue - elements[0].h;
					elements[0].setAttr({
						cx: n0x,
						cy: n0y
					});
					// light
					var n1x = elements[1].ox + dx;
					var n1y = elements[1].oy + dy;
					if(n1x < elements[1].w) n1x = elements[1].w;
					if(n1x > KBGraphic.width * KBGraphic.zoomValue - elements[1].w) n1x = KBGraphic.width * KBGraphic.zoomValue - elements[1].w;
					if(n1y < elements[1].h) n1y = elements[1].h;
					if(n1y > KBGraphic.height * KBGraphic.zoomValue - elements[1].h) n1y = KBGraphic.height * KBGraphic.zoomValue - elements[1].h;
					elements[1].setAttr({
						cx: n1x,
						cy: n1y
					});
					// text
					var n2x = elements[2].ox + dx;
					var n2y = elements[2].oy + dy;
					if(n2x < elements[0].w) n2x = elements[0].w;
					if(n2x > KBGraphic.width * KBGraphic.zoomValue - elements[0].w) n2x = KBGraphic.width * KBGraphic.zoomValue - elements[0].w;
					if(n2y < elements[0].h) n2y = elements[0].h;
					if(n2y > KBGraphic.height * KBGraphic.zoomValue - elements[0].h) n2y = KBGraphic.height * KBGraphic.zoomValue - elements[0].h;
					elements[2].setAttr({
						x: n2x, 
						y: n2y
					});
					// reflection
					var n3x = elements[3].ox + dx;
					var n3y = elements[3].oy + dy;
					if(n3x < elements[0].w) n3x = elements[0].w;
					if(n3x > KBGraphic.width * KBGraphic.zoomValue - elements[0].w) n3x = KBGraphic.width * KBGraphic.zoomValue - elements[0].w;
					if(n3y < elements[0].h - elements[0].h / 5) n3y = elements[0].h - elements[0].h / 5;
					if(n3y > KBGraphic.height * KBGraphic.zoomValue - elements[0].h / 5) n3y = KBGraphic.height * KBGraphic.zoomValue - elements[0].h / 5;
					elements[3].setAttr({
						cx: n3x, 
						cy: n3y
					});
					for (var i = links.length; i--;) {
						this.paper.connection(links[i]);
					}
				},
				up = function() {
					elements[0].animate({"fill-opacity": elements[0].oop}, 600);
					elements[3].animate({"fill-opacity": elements[0].oop}, 600);
					for(var i = 0; i < links.length; i++) {
						links[i].line.attr({"stroke-width": .8});
					}
				};
				elements[0].drag(move, start, up);
				elements[1].drag(move, start, up);
				elements[2].drag(move, start, up);
			default:
				break;
		}
	};
	
	this.setHOver = function(info) {
		var displayBox = $('#' + KBGraphic.infoDisplayBox);
		for(var i = 0; i < this.raphElement.length; i++) {
			$(this.raphElement[i].node).bind('mouseover', function() {
				displayBox.html(info);
			});
			$(this.raphElement[i].node).bind('mouseout', function() {
				displayBox.html("&nbsp;");
			});
		}
	}
	
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
	this.infoDisplayBox; // CSS id of the div displaying element info
	this.elements; // list of elements the canvas contains
	this.panBoxControls; // list of pan controls
	this.idControlBox; // CSS id of the div containing all controls
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
		$('#' + this.idPaper).css('width', this.width + 'px'); 			  //
		$('#' + this.idPaper).css('height', this.height + 'px'); 			  //
		$('<div id="' + this.idPaper + '_clear">&nbsp;</div>').appendTo('#' + id); // adds a div with clear style for a nice display
		$('#' + this.idPaper + '_clear').css('clear', 'both');	
		this.elements = new Array();
		// Control Box
		this.idControlBox = this.idPaper + '_controls';
		$('<div id="' + this.idControlBox + '"></div>').insertAfter('#' + this.idPaper); // adds the div with pan controls
		$('#' + this.idControlBox).css('float', 'left');	   	   //
		$('#' + this.idControlBox).css('clear', 'right');	       // CSS for the div
		$('#' + this.idControlBox).css('margin-left', '20px'); 	   //  with pan controls
		$('#' + this.idControlBox).css('margin-top', '20px');      //
		$('#' + this.idControlBox).css('font-family', 'Verdana');  //
		$('#' + this.idControlBox).css('font-size', '11px');       //
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
		$('<button id="' + this.save2PNG + '">Exporter au format PNG</button>').appendTo('#' + this.idControlBox);
		$('<form id="saveForm" method="post" action="svg2png.php">'
		+ '<input id="svgInput" type="hidden" name="svg" value="" />'
		+ '<input id="svgWidth" type="hidden" name="width" value="' + this.width + '" />'
		+ '<input id="svgHeight" type="hidden" name="height" value="' + this.height + '" />'
		+ '</form>').appendTo('#' + id);
		$('#saveForm').ajaxForm();
		$('#' + this.save2PNG).css('margin-top', '30px');	
		$('#' + this.save2PNG).css('background-color', '#DDDDDD');	
		$('#' + this.save2PNG).css('border', '1px #A2A2A2 solid');	
		$('#' + this.save2PNG).css('padding', '2px');	
		$('#' + this.save2PNG).css('color', '#A2A2A2');	
		$('#' + this.save2PNG).css('font-weight', 'bold');		
		$('#' + this.save2PNG).hover(
			function() {
				$(this).css('border', '1px #2A2A2A solid');		
				$(this).css('color', '#2A2A2A');	
			},
			function() {
				$(this).css('border', '1px #A2A2A2 solid');	
				$(this).css('color', '#A2A2A2');
			}
		);		
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
		this.infoDisplayBox = id + '_infodisplay';
		$('<div id="' + this.infoDisplayBox + '">&nbsp;</div>').appendTo('#' + this.idControlBox);
		$('#' + this.infoDisplayBox).css('border', '1px #2A2A2A solid');
		$('#' + this.infoDisplayBox).css('color', '#2A2A2A');
		$('#' + this.infoDisplayBox).css('padding', '5px');
		$('#' + this.infoDisplayBox).css('min-height', '50px');
		$('#' + this.infoDisplayBox).css('max-width', '200px');
		$('<p>Informations</p>').css('margin-top', '30px').css('color', '#2A2A2A').insertBefore('#' + this.infoDisplayBox);
		this.draw(); // drawing test
	};
		
	this.draw = function() {
		var r = new KBElement("offer", "file", 10, ["Offre 01", "Offre 01<br /><br />Description : OK.<br /><br />Commentaires : Je suis une offre<br />Entrée : Bah oui !!!!!!!!!!!!!"]);
		r.init();
		var s = new KBElement("offer", "file", 10, ["Offre 02", "Offre 02<br /><br />Description : OK.<br /><br />Commentaires : Je suis une offre<br />Entrée : Non ?!!!!"]);
		s.init();
		var t = new KBElement("step", "ball", 10, ["Étape 01","Étape 01<br /><br />Description : OK.<br /><br />Commentaires : Je suis une étape<br />Entrée : Ok !!!!!!!!!!!!!"]);
		t.init();
		var a = new KBElement("process", "ball", 10, ["Processus 01", "Processus 01<br /><br />Description : OK.<br /><br />Commentaires : Aucun<br />Test : Ok !!!!!!!!!!!!!"]);
		a.init();
		var b = new KBElement("act", "file", 10, ["Acte 01", "Acte 01<br /><br />Description : OK.<br /><br />Commentaires : Aucun<br />Test : Ok !!!!!!!!!!!!!"]);
		b.init();
		var c = new KBElement("act", "file", 10, ["Acte 02", "Acte 02<br /><br />Description : OK.<br /><br />Commentaires : Bah oui ! Ici !<br />Test : Ok !!!!!!!!!!!!!"]);
		c.init();
		var d = new KBElement("act", "file", 10, ["Acte 03", "Acte 03<br /><br />Description : OK.<br /><br />Commentaires : ******<br />Test : Ok !!!!!!!!!!!!!"]);
		d.init();
		var e = new KBElement("task", "file", 10, ["Tâche 01", "Tâche 01<br /><br />Description : OK.<br /><br />Commentaires : *+++++**<br />Test : Ok !!!!!!!!!!!!!"]);
		e.init();
		var f = new KBElement("task", "file", 10, ["Tâche 02", "Tâche 02<br /><br />Description : OK.<br /><br />Commentaires : **+++-+-++*<br />Test : Ok !!!!!!!!!!!!!"]);
		f.init();
		a.linkedElements.push(b, c, d);
		a.drawLink();
		t.linkedElements.push(a);
		t.drawLink();
		c.linkedElements.push(e, f);
		c.drawLink();
		r.linkedElements.push(t);
		r.drawLink();
		s.linkedElements.push(t);
		s.drawLink();
		this.elements.push(a, b, c, d, e, f, r, s, t);
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
					"fill": "#2A2A2A",
					"stroke": "#2A2A2A",
					"cursor": "pointer"
				});
				KBGraphic.panBoxControls[2][1].attr({
					"fill": "#2A2A2A",
					"stroke": "#2A2A2A",
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
					"fill": "#2A2A2A",
					"stroke": "#2A2A2A",
					"cursor": "pointer"
				});
				KBGraphic.panBoxControls[2][1].attr({
					"fill": "#2A2A2A",
					"stroke": "#2A2A2A",
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
					"fill": "#2A2A2A",
					"stroke": "#2A2A2A",
					"cursor": "pointer"
				});
				KBGraphic.panBoxControls[3][1].attr({
					"fill": "#2A2A2A",
					"stroke": "#2A2A2A",
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
					"fill": "#2A2A2A",
					"stroke": "#2A2A2A",
					"cursor": "pointer"
				});
				KBGraphic.panBoxControls[3][1].attr({
					"fill": "#2A2A2A",
					"stroke": "#2A2A2A",
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
					"fill": "#2A2A2A",
					"stroke": "#2A2A2A",
					"cursor": "pointer"
				});
				KBGraphic.panBoxControls[0][1].attr({
					"fill": "#2A2A2A",
					"stroke": "#2A2A2A",
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
					"fill": "#2A2A2A",
					"stroke": "#2A2A2A",
					"cursor": "pointer"
				});
				KBGraphic.panBoxControls[0][1].attr({
					"fill": "#2A2A2A",
					"stroke": "#2A2A2A",
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
					"fill": "#2A2A2A",
					"stroke": "#2A2A2A",
					"cursor": "pointer"
				});
				KBGraphic.panBoxControls[1][1].attr({
					"fill": "#2A2A2A",
					"stroke": "#2A2A2A",
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
					"fill": "#2A2A2A",
					"stroke": "#2A2A2A",
					"cursor": "pointer"
				});
				KBGraphic.panBoxControls[1][1].attr({
					"fill": "#2A2A2A",
					"stroke": "#2A2A2A",
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
		// Pan Controls
		var idPanControls = this.idPaper + '_pan_controls';
		$('<div id="' + idPanControls + '"></div>').appendTo('#' + this.idControlBox); // adds the div with pan controls
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
		$('<div id="' + idZoomControls + '"></div>').appendTo('#' + this.idControlBox); // adds the div with zoom controls
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
		$('<div id="' + idRadar + '"></div>').appendTo('#' + this.idControlBox); // adds the div with radar
		$('#' + idRadar).css('margin-top', '30px');
		$('#' + idRadar).css('border', '1px #A2A2A2 dashed');
		$('#' + idRadar).css('width', targetWidth + 'px');
		$('#' + idRadar).css('height', targetHeight + 'px');
		$('<div id="' + idRadarTarget + '">&nbsp;</div>').appendTo('#' + idRadar); // adds the div with radar
		$('#' + idRadarTarget).css('border', '1px #2A2A2A solid');
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