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
		line.bg && line.bg.attr({path: path});
		line.line.attr({path: path});
	} else {
		var color = typeof line == "string" ? line : "#000";
		return {
			bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
			line: this.path(path).attr({stroke: color, fill: "none"}),
			from: obj1,
			to: obj2
		};
	}
};

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
				links[i].animate({"fill": this.attr("fill")}, 500);
			}
		},
		move = function(dx, dy) {
			var tmp_cx = this.ox + dx; 
			var tmp_cy = this.oy + dy;
			
			if(tmp_cx < (this.getBBox().width / 2)) {
				tmp_cx = (this.getBBox().width / 2);
			}
			if(tmp_cx > this.paper.width - (this.getBBox().width / 2)) {
				tmp_cx = this.paper.width - (this.getBBox().width / 2);
			}
			if(tmp_cy < (this.getBBox().height / 2)) {
				tmp_cy = (this.getBBox().height / 2);
			}
			if(tmp_cy > this.paper.height - (this.getBBox().height / 2)) {
				tmp_cy = this.paper.height - (this.getBBox().height / 2);
			}
			
			this.setAttr({
				cx: tmp_cx, 
				cy: tmp_cy
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
	}
}

var KBGraphic = new function() {
	this.paper;
	this.width;
	this.height;
	this.div_id;
	this.elements;
	this.links;
	
	this.init = function(id, w, h) {
		this.height = h;
		this.width = w;
		this.div_id = id;
		this.elements = new Array();
		this.links = new Array();
		this.paper = Raphael(this.div_id, this.width, this.height).initZoom();
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
	};
	
	this.zoom = function(zoom) {
		this.paper.setZoom(zoom / 100);
	}
};