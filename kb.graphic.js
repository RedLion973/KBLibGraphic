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
	this.paper;
	this.width;
	this.height;
	this.idPaper;
	this.elements;
	this.links;
	this.zpd;
	
	this.init = function(id, w, h) {
		this.height = h;
		this.width = w;
		this.idPaper = id + "_graph";
		$("#" + id).addClass("kb_visual");
		$("#" + this.idPaper).addClass("kb_visual_graph");
		this.elements = new Array();
		this.links = new Array();
		this.paper = Raphael(this.idPaper, this.width, this.height).initZoom();
		$('<div style="clear: both;">&nbsp;</div>').insertAfter("#" + this.idPaper);
		this.zpd = new RaphaelZPD(this.paper, {zoom: false, pan: false, drag: false});
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

	this.setZoomer = function(idZoomer) {
		var canvas = this.zpd;
		var svg = this.paper;
		$('<div id="' + idZoomer + '_vpan"></div>').insertBefore("#" + this.idPaper);
		$('<div id="' + idZoomer + '_hpan"></div>').insertAfter("#" + this.idPaper);
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
		});
	};
	
	this.zoom = function(zoom) {
		this.paper.setZoom(zoom / 100);
	}
};
