function showUVShiftDialog() {
	if (!selected.length) return;
	var dialog = new Dialog({
		title: tl('dialog.shift_uv.title'),
		draggable: true,
		width: 387,
		lines: [
			'<div class="dialog_bar" style="height: auto; padding-bottom: 20px;">'+
				tl('dialog.shift_uv.message')+
			'</div>',
			'<div class="dialog_bar">'+
				'<label class="inline_label" style="width: 120px;">'+tl('dialog.shift_uv.horizontal')+': </label>'+
				'<input type="text" class="dark_bordered" id="shift_uv_horizontal">'+
			'</div>',
			'<div class="dialog_bar">'+
				'<label class="inline_label" style="width: 120px;">'+tl('dialog.shift_uv.vertical')+': </label>'+
				'<input type="text" class="dark_bordered" id="shift_uv_vertical">'+
			'</div>'
		],
		id: 'uv_shift_dialog',
		fadeTime: 100,
		onConfirm: function() {
			Undo.initEdit({cubes: elements, uv_only: true})
			dialog.hide()
			var h = $(dialog.object).find('#shift_uv_horizontal').val()
			if (h.length > 0) {
				var add;
				if (h.substr(0,1) === '+') {
					h = h.substr(1).trim()
					add = true
				}
				h = eval(h)
				elements.forEach(function(obj) {
					if (add) {
						obj.uv_offset[0] += h
					} else {
						obj.uv_offset[0] *= h
					}
				})
			}
			var v = $(dialog.object).find('#shift_uv_vertical').val()
			if (v.length > 0) {
				var add;
				if (v.substr(0,1) === '+') {
					v = v.substr(1).trim()
					add = true
				}
				v = eval(v)
				elements.forEach(function(obj) {
					if (add) {
						obj.uv_offset[1] += v
					} else {
						obj.uv_offset[1] *= v
					}
					Canvas.updateUV(obj)
				})
			}
			main_uv.loadData()
			Undo.finishEdit('uv_shift')
		},
		onCancel: function() {
			dialog.hide()
		}
	}).show()
}
class UVEditor {
	constructor(id, headline, toolbar) {
		this.face = 'north';
		this.size = 320;
		this.zoom = 1;
		this.grid = 16;
		this.id = id
		this.autoGrid = true;
		this.texture = false;
		this.headline = headline
		this.jquery = {}
		this.uuid = guid()

		uv_dialog.all_editors.push(this)

		this.buildDom(toolbar)
	}
	buildDom(toolbar) {
		var scope = this
		if (this.jquery.main) {
			this.jquery.main.detach()
		}
		this.jquery.main = $('<div class="UVEditor" id="UVEditor_'+scope.id+'"></div>')
		if (this.headline) {
			this.jquery.main.append('<div class="uv_headline"><div class="uv_title">'+capitalizeFirstLetter(scope.id)+'</div><div class="tool"><i class="material-icons">fullscreen</i><div class="tooltip">Fullscreen</div></div></div>')
			this.jquery.main.find('div.uv_headline > .tool').click(function() {
				uv_dialog.openTab(scope.id)
			})
			this.jquery.main.find('div.uv_headline').click(function(event) {
				event.stopPropagation()
				uv_dialog.select(scope.id, event)
			})
		}
		this.jquery.viewport = $('<div id="uv_viewport"></div>')
		this.jquery.transform_info = $('<div class="uv_transform_info"></div>')
		this.jquery.main.append(this.jquery.transform_info)
		this.jquery.main.append(this.jquery.viewport)

		this.jquery.frame = $('<div id="uv_frame" style="background-repeat: no-repeat;"><div id="uv_size"><div class="uv_size_handle"></div></div></div>')
		this.jquery.size  = this.jquery.frame.find('div#uv_size')
		this.jquery.viewport.append(this.jquery.frame)
		this.jquery.frame.css('background-repeat', 'no-repeat')
		if (Blockbench.browser === 'firefox') {
			this.jquery.frame.css('image-rendering', '-moz-crisp-edges')
		}
		if (Toolbox.selected.paintTool) {
			this.jquery.size.hide()
		}

		this.jquery.sliders = $('<div class="bar" style="margin-left: 2px;"></div>')

		this.jquery.main.append(this.jquery.sliders)
		var onBefore = function() {
			Undo.initEdit({cubes: selected})
		}
		var onAfter = function() {
			Undo.finishEdit('edit UV')
			if (Blockbench.entity_mode) {
				scope.displayAllMappingOverlays()
			}
		}
		var getInterval = function(event) {
			return Blockbench.entity_mode
				? 1 
				: 16/scope.grid;
		}
		this.sliders = {
			pos_x: new NumSlider({
				id: 'uv_slider_pos_x',
				private: true,
				condition: function() {return true},
				get: function() {
					if (Blockbench.entity_mode && selected[0]) {
						return trimFloatNumber(selected[0].uv_offset[0])
					} else {
						var face_uv = selected[0].faces[scope.face].uv
						if (face_uv) {
							return trimFloatNumber(face_uv[0])
						}
					}
					return 0
				},
				change: function(value, fixed) {
					scope.slidePos(value, fixed, 0)
				},
				getInterval: getInterval,
				onBefore: onBefore,
				onAfter: onAfter
			}).toElement(this.jquery.sliders),

			pos_y: new NumSlider({
				id: 'uv_slider_pos_y',
				private: true,
				condition: function() {return true},
				get: function() {
					if (Blockbench.entity_mode && selected[0]) {
						return trimFloatNumber(selected[0].uv_offset[1])
					} else {
						var face_uv = selected[0].faces[scope.face].uv
						if (face_uv) {
							return trimFloatNumber(face_uv[1])
						}
					}
					return 0
				},
				change: function(value, fixed) {
					scope.slidePos(value, fixed, 1)
				},
				getInterval: getInterval,
				onBefore: onBefore,
				onAfter: onAfter
			}).toElement(this.jquery.sliders),

			size_x: new NumSlider({
				id: 'uv_slider_size_x',
				private: true,
				condition: function() {return !Blockbench.entity_mode},
				get: function() {
					if (!Blockbench.entity_mode && selected[0]) {
						var face_uv = selected[0].faces[scope.face].uv
						if (face_uv) {
							return trimFloatNumber(face_uv[2] - face_uv[0])
						}
					}
					return 0
				},
				getInterval: function(event) {
					return Blockbench.entity_mode
						? 1 
						: 16/scope.grid;
				},
				change: function(value, fixed) {
					scope.slideSize(value, fixed, 0)
				},
				getInterval: getInterval,
				onBefore: onBefore,
				onAfter: onAfter
			}).toElement(this.jquery.sliders),

			size_y: new NumSlider({
				id: 'uv_slider_size_y',
				private: true,
				condition: function() {return !Blockbench.entity_mode},
				get: function() {
					if (!Blockbench.entity_mode && selected[0]) {
						var face_uv = selected[0].faces[scope.face].uv
						if (face_uv) {
							return trimFloatNumber(face_uv[3] - face_uv[1])
						}
					}
					return 0
				},
				change: function(value, fixed) {
					scope.slideSize(value, fixed, 1)
				},
				getInterval: getInterval,
				onBefore: onBefore,
				onAfter: onAfter

			}).toElement(this.jquery.sliders)
		}
			


		if (toolbar) {
			this.jquery.bar = $(Toolbars.main_uv.node)
			this.jquery.main.append(this.jquery.bar)
		} else {
			this.jquery.bar = $('')
		}

		var dragging_not_clicking = false;
		this.jquery.size.resizable({
			handles: "all",
			maxHeight: 320,
			maxWidth: 320,
			containment: 'parent',
			start: function(event, ui) {
				Undo.initEdit({cubes: selected, uv_only: true})
			},
			resize: function(event, ui) {



				//ui.size.width = ui.originalSize.width + (ui.size.width - ui.originalSize.width) / scope.zoom
				//ui.size.height = ui.originalSize.height + (ui.size.height - ui.originalSize.height) / scope.zoom
				/*
				ui.size.width = ui.size.width - ui.size.width % (scope.size/scope.grid) + (scope.size/scope.grid)/2;
				ui.size.height = ui.size.height - ui.size.height % (scope.size/scope.grid) + (scope.size/scope.grid)/2;
				*/
				//var size = main_uv.height / main_uv.grid * main_uv.zoom

				scope.save()
				scope.displaySliders()
			},
			stop: function(event, ui) {
				dragging_not_clicking = true;
				Undo.finishEdit('uv_change')
				scope.disableAutoUV()
				scope.updateDragHandle(ui.position)
			}
		})

		this.jquery.size.draggable({
			start: function(event, ui) {
				Undo.initEdit({cubes: selected, uv_only: true})
			},
			drag: function( event, ui ) {
				var p = ui.position;
				var o = ui.originalPosition

				p.left = o.left + (p.left - o.left)
				p.top = o.top + (p.top - o.top)

				p.left = limitNumber(p.left, 0, scope.inner_size-scope.jquery.size.width()+1)
				p.top = limitNumber(p.top, 0, scope.inner_size-scope.jquery.size.height()+1)
				
				p.left = p.left - p.left % (scope.inner_size/scope.grid);
				p.top = p.top - p.top % (scope.inner_size/scope.grid);

				scope.save()
				scope.displaySliders()
			},
			stop: function(event, ui) {
				scope.save()
				Undo.finishEdit('uv_change')
				scope.disableAutoUV()
				scope.updateDragHandle(ui.position)
				if (Blockbench.entity_mode) {
					scope.displayAllMappingOverlays()
					if (scope.jquery.size.is(':hover')) {
						scope.displayMappingOverlay()
					}
				}
			}
		})

		this.jquery.frame.droppable({
			accept: 'li.texture',
			tolerance: 'pointer',
			drop: function(event, ui) {
				if (selected.length == 0) {
					return
				}
				var id = $(ui.helper).attr('texid')
				scope.applyTexture(id)
			}
		})

		this.jquery.size.mouseenter(function() {
			scope.displayMappingOverlay()
		})
		this.jquery.size.mouseleave(function() {
			$(this).find('.uv_mapping_overlay').remove()
		})

		this.jquery.frame.click(function(event) {
			if (!dragging_not_clicking) {
				scope.reverseSelect(event)
			}
			dragging_not_clicking = false;
		})

		this.jquery.viewport.contextmenu(function(event) {
			scope.contextMenu()
		})

		this.jquery.viewport.mousedown(function(event) {
			if (Toolbox.selected.paintTool && event.which === 1) {
				scope.startBrush(event)
			}
		})
		this.jquery.viewport.on('mousewheel', function(e) {
			if (e.ctrlKey) {
				var n = (event.deltaY < 0) ? 0.1 : -0.1;
				n *= scope.zoom
				var number = limitNumber(scope.zoom + n, 1.0, 4.0)
				if (Math.abs(number - scope.zoom) > 0.001) {
					this.scrollLeft += (scope.inner_size * n / 2) * (event.offsetX / scope.jquery.frame.width());
					this.scrollTop  += (scope.inner_size * n / 2) * (event.offsetY / scope.jquery.frame.height());
				}
				scope.setZoom(number)
				event.preventDefault()
				e.preventDefault()
				return false;
			}
		})
		var dMWCoords = {x: 0, y: 0}
		function dragMouseWheel(e) {
			e.currentTarget.scrollLeft -= (e.pageX - dMWCoords.x)
			e.currentTarget.scrollTop -= (e.pageY - dMWCoords.y)
			dMWCoords = {x: e.pageX, y: e.pageY}
		}
		function dragMouseWheelStop(e) {
			scope.jquery.viewport.off('mousemove', dragMouseWheel)
			document.removeEventListener('mouseup', dragMouseWheelStop)
		}
		scope.jquery.viewport.on('mousedown', function(e) {
			if (e.which === 2) {
				scope.jquery.viewport.on('mousemove', dragMouseWheel)
				document.addEventListener('mouseup', dragMouseWheelStop)
				dMWCoords = {x: e.pageX, y: e.pageY}
				e.preventDefault();
				return false;
			}
		})
		this.setSize(this.size)
		return this;
	}
	message(msg, vars) {
		msg = tl(msg, vars)
		var box = $('<div class="uv_message_box">' + msg + '</div>')
		this.jquery.frame.append(box)
		setTimeout(function() {
			box.fadeOut(200)
			setTimeout(function() {
				box.remove()
			}, 300)
		}, 1000)
	}
	//Brush
	getBrushCoordinates(event, tex) {
		var scope = this;
		var multiplier = (Blockbench.entity_mode && tex) ? tex.res/Project.texture_width : 1
		var pixel_size = scope.inner_size / tex.res
		return {
			x: Math.floor(event.offsetX/scope.getPixelSize()*multiplier),
			y: Math.floor(event.offsetY/scope.getPixelSize()*multiplier)
		}
	}
	startBrush(event) {
		var scope = this;
		Painter.active_uv_editor = scope;

		var texture = scope.getTexture()
		if (texture) {
			Painter.current.x = Painter.current.y = 0
			var coords = scope.getBrushCoordinates(event, texture)
			Painter.startBrush(texture, coords.x, coords.y, undefined, event)
		}
		if (Toolbox.selected.id !== 'color_picker' && texture) {
			scope.jquery.frame.get(0).addEventListener('mousemove', scope.moveBrush, false );
			document.addEventListener('mouseup', scope.stopBrush, false );
		}
	}
	moveBrush(event) {
		var scope = Painter.active_uv_editor;
		var texture = scope.getTexture()
		if (!texture) {
			Blockbench.showQuickMessage('message.untextured')
		} else {
			var x, y, new_face;
			var end_x = x = scope.getBrushCoordinates(event, texture).x
			var end_y = y = scope.getBrushCoordinates(event, texture).y


			if (x === Painter.current.x && y === Painter.current.y) {
				//return
			}
			if (Painter.current.face !== scope.face) {
				Painter.current.x = x
				Painter.current.y = y
				Painter.current.face = scope.face
				new_face = true
			}
			var diff = {
				x: x - (Painter.current.x||x),
				y: y - (Painter.current.y||y),
			}
			var length = Math.sqrt(diff.x*diff.x + diff.y*diff.y)
			if (new_face && !length) {
				length = 1
			}
			var i = 0;
			while (i < length) {
				x = end_x - diff.x / length * i
				y = end_y - diff.y / length * i
				Painter.useBrush(texture, x, y, undefined, i < length-1)
				i++;
			}
			Painter.current.x = end_x
			Painter.current.y = end_y
		}
	}
	stopBrush(event) {
		var scope = Painter.active_uv_editor;
		scope.jquery.frame.get(0).removeEventListener( 'mousemove', scope.moveBrush, false );
		document.removeEventListener( 'mouseup', scope.stopBrush, false );
		Painter.stopBrush()
	}
	//Get
	get inner_size() {
		return this.size*this.zoom;
	}
	get inner_height() {
		return this.height*this.zoom;
	}
	getPixelSize() {
		if (Blockbench.entity_mode) {
			this.grid = Project.texture_width
			return this.inner_size/this.grid
		} else {
			return this.inner_size/ (
				(typeof this.texture === 'object' && this.texture.res)
					? this.texture.res
					: this.grid
			)
		}
	}
	getFaces(event) {
		if (event && event.shiftKey) {
			return ['north', 'east', 'south', 'west', 'up', 'down']
		} else {
			return [this.face]
		}
	}
	getUVTag(obj) {
		if (!obj) obj = selected[0]
		if (Blockbench.entity_mode) {
			return [obj.uv_offset[0], obj.uv_offset[1], 0, 0];
		} else {
			return obj.faces[this.face].uv;
		}
	}
	getTexture() {
		return selected[0].faces[this.face].getTexture()
	}
	reverseSelect(event) {
		var scope = this;
		if (!event.target.classList.contains('uv_size_handle') && !event.target.id === 'uv_frame') {
			return this;
		}
		var matches = [];
		var face_match;
		var u = event.offsetX / main_uv.inner_size * 16;
		var v = event.offsetY / main_uv.inner_height * 16;
		elements.forEach(cube => {
			for (var face in cube.faces) {
				var uv = cube.faces[face].uv
				if (uv && Math.isBetween(u, uv[0], uv[2]) && Math.isBetween(v, uv[1], uv[3]) && cube.faces[face].getTexture() === scope.texture) {
					matches.safePush(cube)
					if (!face_match) {
						face_match = face
					}
					break;
				}
			}
		})
		if (matches.length) {
			if (!Blockbench.entity_mode) {
				main_uv.setFace(face_match)
			}
			if (!event.ctrlKey && !event.shiftKey) {
				selected.empty();
			}
			matches.forEach(s => {
				selected.safePush(s)
			})
			updateSelection()
			scope.displayMappingOverlay()
		}
		return this;
	}
	forCubes(cb) {
		var i = 0;
		while (i < selected.length) {
			cb(selected[i])
			i++;
		}
	}
	//Set
	setSize(input_size, cancel_load) {
		var old_size = this.size;
		var size = input_size - (input_size % 16);
		this.size = size;
		this.jquery.frame.width(this.inner_size);
		this.jquery.viewport.width(size+8);
		this.jquery.main.width(size+8);

		if (Blockbench.entity_mode) {
			this.height = size / (Project.texture_width/Project.texture_height)
			this.jquery.frame.height(this.inner_height)
			this.jquery.viewport.height(this.height+8)
			$('.panel#textures').css('top', 133+(size / (Project.texture_width/Project.texture_height))+'px')
			if (old_size !== size) {
				this.displayAllMappingOverlays(true)
			}
		} else {
			this.height = size
			this.jquery.frame.height(this.inner_size)
			this.jquery.viewport.height(size+8)

			this.jquery.size.resizable('option', 'maxHeight', this.inner_size)
			this.jquery.size.resizable('option', 'maxWidth', this.inner_size)
			this.jquery.size.resizable('option', 'grid', [this.inner_size/this.grid, this.inner_size/this.grid])
		}
		for (var id in this.sliders) {
			this.sliders[id].setWidth(size/(Blockbench.entity_mode?2:4)-1)
		}
		if (!cancel_load) {
			this.loadData()
		}
		return this;
	}
	setZoom(zoom) {
		var zoomed_size = this.size * zoom;
		var size = zoomed_size - (zoomed_size % 16);
		this.zoom = size/this.size

		this.jquery.frame.width(this.inner_size);

		if (Blockbench.entity_mode) {
			this.jquery.frame.height(this.inner_height)
			this.displayAllMappingOverlays(true)
		} else {
			this.jquery.frame.height(this.inner_size)
			this.jquery.size.resizable('option', 'maxHeight', this.inner_size)
			this.jquery.size.resizable('option', 'maxWidth', this.inner_size)
			this.jquery.size.resizable('option', 'grid', [this.inner_size/this.grid, this.inner_size/this.grid])
		}
		if (this.zoom > 1) {
			this.jquery.viewport.css('overflow', 'scroll scroll')
		} else {
			this.jquery.viewport.css('overflow', 'hidden')
		}
		this.loadData()
		return this;
	}
	setGrid(grid, load) {
		if (Blockbench.entity_mode) {
			this.autoGrid = false;
			grid = Project.texture_width
		} else if (grid === undefined || grid === 'dialog') {
			this.autoGrid = false;
			grid = BarItems.uv_grid.get()
			if (grid === 'auto') {
				if (this.texture) {
					grid = this.texture.res
				} else {
					grid = 16
				}
				this.autoGrid = true
			} else if (grid === 'none') {
				grid = 512
			} else {
				grid = parseInt(grid)
			}
		}
		this.grid = grid
		var pixels = this.inner_size / this.grid;
		if (Blockbench.entity_mode === false) {
			this.jquery.size.resizable('option', 'grid', [pixels, pixels])
		}
		if (load !== false) this.loadData()
	}
	setFace(face, update) {
		this.face = face
		if (this.id === 'main_uv') {
			$('input#'+face+'_radio').prop("checked", true)
		}
		if (update !== false) {
			this.loadData()
		}
		return this;
	}
	setFrameColor(black) {
		this.jquery.size.toggleClass('dark_frame', black === true)
	}
	setToMainSlot() {
		var scope = this;
		$('.panel#uv').append(this.jquery.main)
		this.jquery.main.on('mousewheel', function(e) {

			if (!Blockbench.entity_mode && !e.ctrlKey) {
				var faceIDs = {'north': 0, 'south': 1, 'west': 2, 'east': 3, 'up': 4, 'down': 5}
				var id = faceIDs[scope.face]
				event.deltaY > 0 ? id++ : id--;
				if (id === 6) id = 0
				if (id === -1) id = 5
				$('input#'+getKeyByValue(faceIDs, id)+'_radio').prop("checked", true)
				scope.loadSelectedFace()
				e.preventDefault()
			}
		})
		this.jquery.frame.on('dblclick', function() {
			uv_dialog.openFull()
		})
		return this;
	}
	appendTo(selector) {
		$(selector).append(this.jquery.main)
		return this;
	}
	//Load
	loadSelectedFace() {
		this.face = $('#texture_bar input:checked').attr('id').replace('_radio', '')
		this.loadData()
		return false;
	}
	loadData() {
		if (selected.length === 0) return;
		var face = selected[0].faces[this.face]
		
		//Set Rotation
		BarItems.uv_rotation.set(face.rotation||0)

		this.displayTexture(face)
		this.displayFrame()//and transform info
		this.displayTools()
		this.displaySliders()
		this.updateDragHandle()
		if (Blockbench.entity_mode) {
			this.displayAllMappingOverlays()
		}
		if (this.id !== 'main_uv') {
			this.displayTools()
		}
		if (this !== main_uv && this.face === main_uv.face) {
			main_uv.loadData()
		}
	}
	save() {
		var scope = this;
		//Save UV from Frame to object

		if (Blockbench.entity_mode) {

			selected.forEach(function(obj) {
				obj.uv_offset = [
					Math.round(scope.jquery.size.position().left / (scope.inner_size/Project.texture_width) * 8) / 8,
					Math.round(scope.jquery.size.position().top  / (scope.inner_size/Project.texture_width) * 8) / 8
				]
				Canvas.updateUV(obj)
			})

		} else {
			var trim = v => Math.round(v*1000+0.3)/1000;
			var pixelSize = this.inner_size/16

			var position = this.jquery.size.position()
			var left = trim( position.left / pixelSize);
			var top  = trim( position.top / pixelSize * (Project.texture_width/Project.texture_height));
			var left2= Math.clamp(trim( (this.jquery.size.width() + position.left) / pixelSize), 0, 16);
			var top2 = Math.clamp(trim( (this.jquery.size.height() + position.top) / pixelSize), 0, 16);

			var uvTag = this.getUVTag()

			if (uvTag[0] > uvTag[2]) {
				left2 = [left, left = left2][0];
			}
			if (uvTag[1] > uvTag[3]) {
				top2 = [top, top = top2][0];
			}
			var uvArr = [left, top, left2, top2]

			selected.forEach(function(obj) {
				obj.faces[scope.face].uv = uvArr.slice()
				Canvas.updateUV(obj)
			})
		}

		if (this !== main_uv && this.face === main_uv.face) {
			main_uv.loadData()
		}
	}
	applyTexture(uuid) {
		var scope = this;
		Undo.initEdit({cubes: selected, uv_only: true})
		this.forCubes(obj => {
			obj.faces[scope.face].texture = uuid
		})
		this.loadData()
		Canvas.updateSelectedFaces()
		Undo.finishEdit('apply_texture')
	}
	displayTexture(face) {
		var tex = face.getTexture()
		if (!tex || typeof tex !== 'object' || tex.error) {
			this.jquery.frame.css('background-color', 'var(--color-back)').css('background-image', 'none')
			this.texture = false;
			this.setFrameColor()
			if (this.autoGrid || Blockbench.entity_mode) {
				this.setGrid(16, false)
			}
		} else {
			this.setFrameColor(tex.dark_box)
			var css = 'url("'+tex.source.split('\\').join('\\\\').replace(/ /g, '%20')+'")'
			this.jquery.frame.css('background-image', css)
			if (Blockbench.entity_mode) {
				this.jquery.frame.css('background-size', 'contain')
			} else {
				this.jquery.frame.css('background-size', 'cover')
			}
			this.texture = tex;
			if (this.autoGrid || Blockbench.entity_mode) {
				this.setGrid(tex.res, false)
			}
		}
		if (!tex || typeof tex !== 'object') {
			unselectTextures()
		} else {
			tex.select()
		}
		if (Blockbench.entity_mode) {
			this.setSize(this.size, true)
		}
	}
	displayTransformInfo() {
		var ref = selected[0].faces[this.face]
		this.jquery.transform_info.text('')
		if (Blockbench.entity_mode) return;

		if (ref.uv[0] > ref.uv[2]) {
			this.jquery.transform_info.append('<b>X</b>')
		}
		if (ref.uv[1] > ref.uv[3]) {
			this.jquery.transform_info.append('<b>Y</b>')
		}
		if (ref.rotation) {
			this.jquery.transform_info.append('<b>'+ref.rotation+'</b>')
		}
	}
	displayFrame() {
		var scope = this;
		if (Blockbench.entity_mode) {
			var uvTag = this.getUVTag(selected[0])

			var size_tag = selected[0].size(undefined, true)

			var width = (size_tag[0] + size_tag[2])*2
				width = limitNumber(width, 0, Project.texture_width)
				width = width/Project.texture_width*scope.inner_size

			var x = limitNumber(uvTag[0], 0, Project.texture_width)
				x *= scope.inner_size/Project.texture_width

			this.jquery.size.width(width)
			this.jquery.size.css('left', x+'px')


			var height = size_tag[2] + size_tag[1]
				height = limitNumber(height, 0, Project.texture_height)
				height = height/Project.texture_height*scope.inner_size
				height *= Project.texture_height/Project.texture_width

			var y = limitNumber(uvTag[1], 0, Project.texture_height)
				y *= scope.inner_size/Project.texture_height
				y *= Project.texture_height/Project.texture_width

			this.jquery.size.height(height)
			this.jquery.size.css('top', y+'px')
		} else {

			var uvTag = this.getUVTag(selected[0])
			var pixels = this.inner_size/16

			//X
			var width = limitNumber(uvTag[2]-uvTag[0], -16, 16)
			var x = limitNumber(uvTag[0], 0, 16)
			if (width < 0) {
				width *= -1
				x = x - width
			}
			this.jquery.size.width(width * pixels)
			this.jquery.size.css('left', x*pixels+'px')

			//Y
			var height = limitNumber(uvTag[3]-uvTag[1], -16, 16)
			var y = limitNumber(uvTag[1], 0, 16)
			if (height < 0) {
				height *= -1
				y = y - height
			}
			this.jquery.size.height(height * pixels)
			this.jquery.size.css('top', y*pixels+'px')
		}
		this.updateDragHandle()
		this.displayTransformInfo()
	}
	//Overlay
	displayMappingOverlay() {
		if (!Blockbench.entity_mode) return this;
		var scope = this;
		var sides = this.getMappingOverlay()

		$(scope.jquery.size).find('.mapping_overlay_cube').remove()
		scope.jquery.size.append(sides)

		return this;
	}
	getMappingOverlay(cube, absolute) {
		var scope = this;
		var sides = $('<div class="mapping_overlay_cube"></div>')
		var pixels = scope.getPixelSize()
		if (!cube) cube = selected[0]
		function addElement(x, y, width, height, n, color) {
			if (absolute) {
				x += cube.uv_offset[0];
				y += cube.uv_offset[1];
			}
			x *= pixels;
			y *= pixels;
			width  = limitNumber(width *pixels + x, 0, scope.inner_size)  - x;
			height = limitNumber(height*pixels + y, 0, scope.inner_height)- y;

			sides.append($(`<div class="uv_mapping_overlay"
				style="left: ${x}px; top: ${y}px;
				height: ${height}px; width: ${width}px;
				background: ${color};"></div>`))
		}
		var size = cube.size(undefined, true)

		sides.attr('size_hash', `${cube.uv_offset[0]}_${cube.uv_offset[1]}_${size[0]}_${size[1]}_${size[2]}`)

		addElement(size[2], 0, size[0], size[2],				'#b4d4e1', '#ecf8fd')
		addElement(size[2]+size[0], 0, size[0], size[2],		'#536174', '#6e788c')
		addElement(0, size[2], size[2], size[1],				'#43e88d', '#7BFFA3')
		addElement(size[2], size[2], size[0], size[1],		  '#5bbcf4', '#7BD4FF')
		addElement(size[2]+size[0], size[2], size[2], size[1],  '#f48686', '#FFA7A4')
		addElement(2*size[2]+size[0], size[2], size[0], size[1],'#f8dd72', '#FFF899')

		return sides;
	}
	displayAllMappingOverlays(force_reload) {
		var scope = this;
		var cycle = bbuid(4)
		if (this.showing_overlays) {
			elements.forEach(cube => {
				var size = cube.size(undefined, true)
				var hash = `${cube.uv_offset[0]}_${cube.uv_offset[1]}_${size[0]}_${size[1]}_${size[2]}`
				var c = scope.jquery.frame.find(`> .mapping_overlay_cube:not(.${cycle})[size_hash="${hash}"]`).first()
				if (force_reload || !c.length) {
					var sides = scope.getMappingOverlay(cube, true)
					sides.addClass(cycle)
					scope.jquery.frame.append(sides)
				} else {
					c.addClass(cycle)
				}
			})
			$(`.mapping_overlay_cube:not(.${cycle})`).remove()
			$('.mapping_overlay_cube').removeClass(cycle)
		} else {
			$(scope.jquery.frame).find('.mapping_overlay_cube').remove()
		}
	}
	//UI
	displaySliders() {
		this.sliders.pos_x.update()
		this.sliders.pos_y.update()
		this.sliders.size_x.update()
		this.sliders.size_y.update()
	}
	displayTools() {
		//Cullface
		var face = selected[0].faces[this.face]
		BarItems.cullface.set(face.cullface||'off')
		BarItems.face_tint.setIcon(face.tint ? 'check_box' : 'check_box_outline_blank')
	}
	updateDragHandle() {
		var pos = this.jquery.size.position()
		var handle = this.jquery.size.find('div.uv_size_handle')
		handle.css('top', -pos.top+'px')
		handle.css('left', -pos.left+'px')
		handle.width(this.size)
		handle.height(this.height?this.height:this.size)
	}
	updateInterface() {
		for (var key in this.sliders) {
			var slider = this.sliders[key]
			$(slider.node).css('display', BARS.condition(slider.condition)?'block':'none')
		}
		this.jquery.size.resizable('option', 'disabled', Blockbench.entity_mode)
	}
	contextMenu() {
		var scope = this;
		//if (Blockbench.entity_mode) return;
		this.reference_face = selected[0].faces[scope.face]
		this.menu.open(event, this)
		return this;
	}
	slidePos(difference, fixed, axis) {
		var scope = this
		selected.forEach(function(obj) {
			if (Blockbench.entity_mode === false) {
				var uvTag = scope.getUVTag(obj)
				var size = uvTag[axis + 2] - uvTag[axis]
				if (!fixed) {
					difference += uvTag[axis]
				}
				difference = limitNumber(difference, 0, 16)
				difference = limitNumber(difference + size, 0, 16) - size

				uvTag[axis] = difference
				uvTag[axis+2] = difference + size
			} else {
				if (axis === 0) {
					var size = (obj.size(0) + obj.size(2))*2
					var limit = Project.texture_width
				} else {
					var size = obj.size(2) + obj.size(1)
					var limit = Project.texture_height
				}
				if (!fixed) {
					difference += obj.uv_offset[axis]
				}
				difference = limitNumber(difference, 0, limit)
				difference = limitNumber(difference + size, 0, limit) - size
				obj.uv_offset[axis] = difference
			}
			Canvas.updateUV(obj)
		})
		this.displaySliders()
		this.displayFrame()
		this.disableAutoUV()
	}
	slideSize(difference, fixed, axis) {
		var scope = this
		selected.forEach(function(obj) {
			if (Blockbench.entity_mode === false) {

				var uvTag = scope.getUVTag(obj)
				if (fixed) {
					difference += uvTag[axis]
				} else {
					difference += uvTag[axis+2]
				}
				uvTag[axis+2] = limitNumber(difference, 0, 16)
				Canvas.updateUV(obj)
			}
		})
		this.displaySliders()
		this.displayFrame()
		this.disableAutoUV()
	}

	//Events
	disableAutoUV() {
		this.forCubes(obj => {
			obj.autouv = 0
		})
	}
	toggleUV() {
		var scope = this
		var state = selected[0].faces[this.face].enabled === false
		this.forCubes(obj => {
			obj.faces[scope.face].enabled = state
		})
	}
	maximize(event) {
		var scope = this;
		this.forCubes(obj => {
			scope.getFaces(event).forEach(function(side) {
				obj.faces[side].uv = [0, 0, 16, 16]
			})
			obj.autouv = 0
			Canvas.updateUV(obj)
		})
		this.message('uv_editor.maximized')
		this.loadData()
	}
	setAutoSize(event) {
		var scope = this;
		var top, left, top2, left2;

		this.forCubes(obj => {
			scope.getFaces(event).forEach(function(side) {
				left = top = 0;
				if (side == 'north' || side == 'south') {
					left2 = limitNumber(obj.size('0'), 0, 16)
					top2 = limitNumber(obj.size('1'), 0, 16)
				} else if (side == 'east' || side == 'west') {
					left2 = limitNumber(obj.size('2'), 0, 16)
					top2 = limitNumber(obj.size('1'), 0, 16)
				} else if (side == 'up' || side == 'down') {
					left2 = limitNumber(obj.size('0'), 0, 16)
					top2 = limitNumber(obj.size('2'), 0, 16)
				}
				obj.faces[side].uv = [left, top, left2, top2]
			})
			obj.autouv = 0
			Canvas.updateUV(obj)
		})
		this.message('uv_editor.autouv')
		this.loadData()
	}
	setRelativeAutoSize(event) {
		var scope = this;
		this.forCubes(obj => {
			scope.getFaces(event).forEach(function(side) {
				var uv = obj.faces[side].uv
				switch (side) {
					case 'north':
					uv = [
						16 - obj.to[0],
						16 - obj.to[1],
						16 - obj.from[0],
						16 - obj.from[1],
					];
					break;
					case 'south':
					uv = [
						obj.from[0],
						16 - obj.to[1],
						obj.to[0],
						16 - obj.from[1],
					];
					break;
					case 'west':
					uv = [
						obj.from[2],
						16 - obj.to[1],
						obj.to[2],
						16 - obj.from[1],
					];
					break;
					case 'east':
					uv = [
						16 - obj.to[2],
						16 - obj.to[1],
						16 - obj.from[2],
						16 - obj.from[1],
					];
					break;
					case 'up':
					uv = [
						obj.from[0],
						obj.from[2],
						obj.to[0],
						obj.to[2],
					];
					break;
					case 'down':
					uv = [
						obj.from[0],
						16 - obj.to[2],
						obj.to[0],
						16 - obj.from[2],
					];
					break;
				}
				uv.forEach(function(s, uvi) {
					uv[uvi] = limitNumber(s, 0, 16)
				})
				obj.faces[side].uv = uv
			})
			obj.autouv = 0
			Canvas.updateUV(obj)
		})
		this.message('uv_editor.autouv')
		this.loadData()
	}
	mirrorX(event) {
		var scope = this;
		this.forCubes(obj => {
			scope.getFaces(event).forEach(function(side) {
				var proxy = obj.faces[side].uv[0]
				obj.faces[side].uv[0] = obj.faces[side].uv[2]
				obj.faces[side].uv[2] = proxy
			})
			obj.autouv = 0
			Canvas.updateUV(obj)
		})
		this.message('uv_editor.mirrored')
		this.loadData()
	}
	mirrorY(event) {
		var scope = this;
		this.forCubes(obj => {
			scope.getFaces(event).forEach(function(side) {
				var proxy = obj.faces[side].uv[1]
				obj.faces[side].uv[1] = obj.faces[side].uv[3]
				obj.faces[side].uv[3] = proxy
			})
			obj.autouv = 0
			Canvas.updateUV(obj)
		})
		this.message('uv_editor.mirrored')
		this.loadData()
	}
	applyAll(event) {
		var scope = this;
		this.forCubes(obj => {
			uv_dialog.allFaces.forEach(function(side) {
				$.extend(true, obj.faces[side], obj.faces[scope.face]) 
			})
			obj.autouv = 0
		})
		Canvas.updateSelectedFaces()
		this.message('uv_editor.to_all')
		this.loadData()
	}
	clear(event) {
		var scope = this;
		Undo.initEdit({cubes: selected, uv_only: true})
		this.forCubes(obj => {
			scope.getFaces(event).forEach(function(side) {
				obj.faces[side].uv = [0, 0, 0, 0]
				obj.faces[side].texture = null;
			})
			Canvas.adaptObjectFaces(obj)
		})
		this.loadData()
		this.message('uv_editor.transparent')
		Undo.finishEdit('uv_clear')
		Canvas.updateSelectedFaces()
	}
	switchCullface(event) {
		var scope = this;
		Undo.initEdit({cubes: selected, uv_only: true})
		var val = BarItems.cullface.get()
		if (val === 'off') val = false
		this.forCubes(obj => {
			if (val) {
				obj.faces[scope.face].cullface = val
			} else {
				delete obj.faces[scope.face].cullface
			}
		})
		if (val) {
			this.message('uv_editor.cullface_on')
		} else {
			this.message('uv_editor.cullface_off')
		}
		Undo.finishEdit('set_cullface')
	}
	switchTint(event) {
		var scope = this;
		var val = !selected[0].faces[scope.face].tint

		if (event === true || event === false) val = event
		this.forCubes(obj => {
			obj.faces[scope.face].tint = val
		})
		if (val) {
			this.message('uv_editor.tint_on')
		} else {
			this.message('uv_editor.tint_off')
		}
		this.displayTools()
	}
	rotate() {
		var scope = this;
		var value = parseInt(BarItems.uv_rotation.get())
		this.forCubes(obj => {
			obj.faces[scope.face].rotation = value
			Canvas.updateUV(obj)
		})
		this.displayTransformInfo()
		this.message('uv_editor.rotated')
	}
	setRotation(value) {
		var scope = this;
		value = parseInt(value)
		this.forCubes(obj => {
			obj.faces[scope.face].rotation = value
			Canvas.updateUV(obj)
		})
		this.loadData()
		this.message('uv_editor.rotated')
	}
	selectGridSize(event) {
	}
	autoCullface(event) {
		var scope = this;
		this.forCubes(obj => {
			scope.getFaces(event).forEach(function(side) {
				obj.faces[side].cullface = side
			})
		})
		this.loadData()
		this.message('uv_editor.auto_cull')
	}
	copy(event) {
		this.select()
		if (selected.length === 0) return;

		var scope = this;
		uv_dialog.clipboard = []

		if (Blockbench.entity_mode) {
			var new_tag = {
				uv: selected[0].uv_offset
			}
			uv_dialog.clipboard.push(new_tag)
			this.message('uv_editor.copied')
			return;
		}

		function addToClipboard(face) {
			if (Blockbench.entity_mode) {
				var new_tag = {
					uv: selected[0].uv_offset
				}
				uv_dialog.clipboard.push(new_tag)
				return;
			}
			var tag = selected[0].faces[face]
			var new_tag = new Face(face, tag)
			uv_dialog.clipboard.push(new_tag)
		}
		if (event.shiftKey) {
			uv_dialog.allFaces.forEach(function(s) {
				addToClipboard(s)
			})
		} else {
			addToClipboard(this.face)
		}
		this.message('uv_editor.copied_x', [uv_dialog.clipboard.length])
	}
	paste(event) {
		this.select()
		if (uv_dialog.clipboard === null || selected.length === 0) return;

		Undo.initEdit({cubes: selected, uv_only: true})
		if (Blockbench.entity_mode) {
			selected.forEach(function(obj) {
				obj.uv_offset = uv_dialog.clipboard[0].uv.slice()
				Canvas.updateUV(obj)
			})
			this.loadData()
			Undo.finishEdit('uv paste')
			return;
		}

		function applyFace(tag, face) {
			if (!face) face = tag.face
			selected.forEach(function(obj) {
				obj.faces[face].extend(tag)
				Canvas.updateUV(obj)
			})
		}

		if (this.id === 'main_uv' && event) {
			if (event.shiftKey) {
				uv_dialog.allFaces.forEach(function(s) {
					applyFace(uv_dialog.clipboard[0], s)
				})
			} else {
				if (uv_dialog.clipboard.length === 1) {
					applyFace(uv_dialog.clipboard[0], main_uv.face)
				} else {
					uv_dialog.clipboard.forEach(function(s) {
						applyFace(s, s.direction)
					})
				}
			}
		} else {
			if (uv_dialog.selection.length === 1) {
				applyFace(uv_dialog.clipboard[0], uv_dialog.selection[0])
			} else {
				if (uv_dialog.clipboard.length === 1) {
					uv_dialog.selection.forEach(function(s) {
						applyFace(uv_dialog.clipboard[0], s)
					})
				} else {
					uv_dialog.clipboard.forEach(function(s) {
						if (uv_dialog.selection.includes(s.face)) {
							applyFace(s)
						}
					})
				}
			}
		}
		this.loadData()
		Canvas.updateSelectedFaces()
		this.message('uv_editor.pasted')
		Undo.finishEdit('uv paste')
	}
	reset(event) {
		var scope = this;
		this.forCubes(obj => {
			scope.getFaces(event).forEach(function(side) {
				obj.faces[side].reset()
			})
			Canvas.adaptObjectFaces(obj)
		})
		this.loadData()
		this.message('uv_editor.reset')
	}
	select() {
		if (uv_dialog.allFaces.includes(this.id) === false) return;
		uv_dialog.selection = [this.id]
		uv_dialog.updateSelection()
	}
}
	UVEditor.prototype.menu = new Menu([
		{name: 'menu.view.zoom', id: 'zoom', condition: isApp, icon: 'search', children: [
			'zoom_in',
			'zoom_out',
			'zoom_reset'
		]},
		'_',
		'copy',
		'paste',
		/*
		{icon: 'content_copy', name: 'menu.uv.copy', click: function(editor) {
			editor.copy(event)
		}},
		{icon: 'content_paste', name: 'menu.uv.paste', click: function(editor) {
			Undo.initEdit({cubes: selected, uv_only: true})
			editor.paste(event)
			Undo.finishEdit('uv_paste')
		}},*/
		{icon: 'photo_size_select_large', name: 'menu.uv.mapping', condition: () => !Blockbench.entity_mode, children: function(editor) { return [
			{icon: editor.reference_face.enabled!==false ? 'check_box' : 'check_box_outline_blank', name: 'menu.uv.mapping.export', click: function(editor) {
				Undo.initEdit({cubes: selected, uv_only: true})
				editor.toggleUV(event)
				Undo.finishEdit('uv_toggle')
			}},
			'uv_maximize',
			'uv_auto',
			'uv_rel_auto',
			{icon: 'rotate_90_degrees_ccw', name: 'menu.uv.mapping.rotation', children: function() {
				var off = 'radio_button_unchecked'
				var on = 'radio_button_checked'
				return [
					{icon: (!editor.reference_face.rotation ? on : off), name: '0&deg;', click: function(editor) {
						Undo.initEdit({cubes: selected, uv_only: true})
						editor.setRotation(0)
						Undo.finishEdit('uv_rotate')
					}},
					{icon: (editor.reference_face.rotation === 90 ? on : off), name: '90&deg;', click: function(editor) {
						Undo.initEdit({cubes: selected, uv_only: true})
						editor.setRotation(90)
						Undo.finishEdit('uv_rotate')
					}},
					{icon: (editor.reference_face.rotation === 180 ? on : off), name: '180&deg;', click: function(editor) {
						Undo.initEdit({cubes: selected, uv_only: true})
						editor.setRotation(180)
						Undo.finishEdit('uv_rotate')
					}},
					{icon: (editor.reference_face.rotation === 270 ? on : off), name: '270&deg;', click: function(editor) {
						Undo.initEdit({cubes: selected, uv_only: true})
						editor.setRotation(270)
						Undo.finishEdit('uv_rotate')
					}}
				]
			}},
			{
				icon: (editor.reference_face.uv[0] > editor.reference_face.uv[2] ? 'check_box' : 'check_box_outline_blank'),
				name: 'menu.uv.mapping.mirror_x',
				click: function(editor) {
					Undo.initEdit({cubes: selected, uv_only: true})
					editor.mirrorX(event)
					Undo.finishEdit('uv_mirror')
				}
			},
			{
				icon: (editor.reference_face.uv[1] > editor.reference_face.uv[3] ? 'check_box' : 'check_box_outline_blank'),
				name: 'menu.uv.mapping.mirror_y',
				click: function(editor) {
					Undo.initEdit({cubes: selected, uv_only: true})
					editor.mirrorY(event)
					Undo.finishEdit('uv_mirror')
				}
			},
		]}},
		{
			icon: (editor) => (editor.reference_face.tint ? 'check_box' : 'check_box_outline_blank'),
			condition: () => !Blockbench.entity_mode,
			name: 'menu.uv.tint', click: function(editor) {
				Undo.initEdit({cubes: selected, uv_only: true})
				editor.switchTint(selected[0].faces[editor.face].tint)
				Undo.finishEdit('face_tint')
			}
		},
		{icon: 'collections', name: 'menu.uv.texture', condition: () => !Blockbench.entity_mode, children: function() {
			var arr = [
				{icon: 'crop_square', name: 'menu.cube.texture.blank', click: function(editor, event) {
					Undo.initEdit({cubes: selected})
					selected.forEach((obj) => {
						editor.getFaces(event).forEach(function(side) {
							delete obj.faces[side].texture;
						})
						Canvas.adaptObjectFaces(obj)
					})
					editor.loadData()
					editor.message('uv_editor.reset')
					Undo.initEdit('texture blank')
				}},
				{icon: 'clear', name: 'menu.cube.texture.transparent', click: function(editor) {editor.clear(event)}},
			]
			textures.forEach(function(t) {
				arr.push({
					name: t.name,
					icon: (t.mode === 'link' ? t.img : t.source),
					click: function(editor) {editor.applyTexture(t.uuid)}
				})
			})
			return arr;
		}}
	])


const uv_dialog = {
	isSetup: false,
	single: false,
	clipboard: null,
	allFaces: ['north', 'south', 'west', 'east', 'up', 'down'],
	selection: [],
	selection_all: [],
	all_editors: [],
	hoveredSide: false,
	single_size: {},
	all_size: {},
	setup: function() {
		uv_dialog.editors = {
			single:new UVEditor('single').appendTo('#uv_dialog_single'),
			north: new UVEditor('north', true).appendTo('#uv_dialog_all'),
			south: new UVEditor('south', true).appendTo('#uv_dialog_all'),
			west:  new UVEditor('west', true).appendTo('#uv_dialog_all'),
			east:  new UVEditor('east', true).appendTo('#uv_dialog_all'),
			up:	new UVEditor('up', true).appendTo('#uv_dialog_all'),
			down:  new UVEditor('down', true).appendTo('#uv_dialog_all')
		}
		var size = $(window).height() - 200
		uv_dialog.editors.single.setSize(size)
		uv_dialog.editors.single.jquery.main.css('margin-left', 'auto').css('margin-right', 'auto')//.css('width', (size+10)+'px')
		uv_dialog.editors.up.jquery.main.css('margin-left', '276px').css('clear', 'both')
		uv_dialog.isSetup = true

		var single_size = size / 2 - 72
		single_size = limitNumber(single_size - (single_size % 16), 80, 256)
		for (var key in uv_dialog.editors) {
			if (uv_dialog.editors[key] && key !== 'single') {
				uv_dialog.editors[key].setFace(key, false)
				uv_dialog.editors[key].setSize(single_size)
				uv_dialog.editors[key].jquery.main.mouseenter(function(event) {
					uv_dialog.hoveredSide = $(this).attr('id').replace('UVEditor_', '')
				})
				uv_dialog.editors[key].jquery.main.mouseleave(function() {
					uv_dialog.hoveredSide = false
				})
			}
		}
		$('.dialog#uv_dialog').resizable({
			minWidth: 202,
			minHeight: 464,
			resize: function() {
				uv_dialog.updateSize()
			},
			containment: 'document',
			handles: 'all'
		})
		BARS.updateConditions()
	},
	select: function(id, event) {
		if (event.shiftKey) {
			uv_dialog.selection.push(id)
		} else {
			if (uv_dialog.selection.includes(id) && uv_dialog.selection.length === 1) {
				uv_dialog.selection = []
			} else {
				uv_dialog.selection = [id]
			}
		}
		uv_dialog.updateSelection()
	},
	selectAll: function() {
		if (uv_dialog.selection.length === 6) {
			uv_dialog.selection.empty()
		} else {
			uv_dialog.selection = uv_dialog.allFaces.slice()
		}
		uv_dialog.updateSelection()
	},
	selectNone: function() {
		uv_dialog.selection = []
		uv_dialog.updateSelection()
	},
	forSelection: function(cb, event) {
		if (open_dialog === false) {
			main_uv[cb](event)
		} else if (uv_dialog.single) {
			uv_dialog.editors.single[cb]()
		} else {
			if (uv_dialog.selection.length > 0) {
				uv_dialog.selection.forEach(function(s) {
					uv_dialog.editors[s][cb]()
				})
			} else {
				uv_dialog.allFaces.forEach(function(s) {
					uv_dialog.editors[s][cb]()
				})
			}
		}
	},
	updateSelection: function() {
		$('#uv_dialog_all .UVEditor .uv_headline').removeClass('selected')
		uv_dialog.selection.forEach(function(id) {
			$('#uv_dialog_all #UVEditor_'+id+' .uv_headline').addClass('selected')
		})
	},
	openDialog: function() {
		var obj = $('.dialog#uv_dialog')
		showDialog('uv_dialog')

		if (!uv_dialog.isSetup) uv_dialog.setup()
	},
	centerDialog: function() {
		var obj = $('.dialog#uv_dialog')
		obj.css('left', (($(window).width()-obj.width())/2) +'px')
		obj.css('top', (($(window).height() - obj.height()) / 2) + 'px')
	},
	openAll: function() {
		uv_dialog.openDialog()
		uv_dialog.openTab('all')
		uv_dialog.centerDialog()
	},
	openFull: function() {
		uv_dialog.openDialog()
		uv_dialog.openTab(main_uv.face)
		uv_dialog.centerDialog()
	},
	openTab: function(tab) {
		uv_dialog.saveSize()
		$('#uv_tab_bar .tab').removeClass('open')
		$('#uv_tab_bar .tab#'+tab).addClass('open')
		if (tab === 'all') {
			uv_dialog.single = false
			$('#uv_dialog_single').hide()
			$('.uv_dialog_all_only').show()
			for (var key in uv_dialog.editors) {
				if (uv_dialog.editors[key] && key !== 'single') {
					uv_dialog.editors[key].loadData()
				}
			}
			uv_dialog.selection = uv_dialog.selection_all.splice(0, 10)
			uv_dialog.updateSelection()

			BarItems.uv_grid.set(uv_dialog.editors.north.gridSelectOption)

			$('.dialog#uv_dialog').width(uv_dialog.all_size.x)
			$('.dialog#uv_dialog').height(uv_dialog.all_size.y)
		} else {
			uv_dialog.single = true
			$('#uv_dialog_single').show()
			$('.uv_dialog_all_only').hide()
			uv_dialog.editors.single.setFace(tab)
			uv_dialog.selection_all = uv_dialog.selection.splice(0, 10)
			uv_dialog.selection = [tab]
			BarItems.uv_grid.set(uv_dialog.editors.single.gridSelectOption)

			var max_size = $(window).height() - 200
			if (max_size < uv_dialog.editors.single.size ) {
				uv_dialog.editors.single.setSize(max_size)
				uv_dialog.editors.single.jquery.main.css('margin-left', 'auto').css('margin-right', 'auto').css('width', max_size+'px')
			}
			$('.dialog#uv_dialog').width(uv_dialog.single_size.x)
			$('.dialog#uv_dialog').height(uv_dialog.single_size.y)
		}
		uv_dialog.hoveredSide = false;
		uv_dialog.updateSize()
	},
	saveSize: function() {
		if (uv_dialog.single) {
			uv_dialog.single_size.x = $('.dialog#uv_dialog').width()
			uv_dialog.single_size.y = $('.dialog#uv_dialog').height()
		} else {
			uv_dialog.all_size.x = $('.dialog#uv_dialog').width()
			uv_dialog.all_size.y = $('.dialog#uv_dialog').height()
		}
	},
	updateSize: function() {
		var obj = $('.dialog#uv_dialog')
		var size = {
			x: obj.width(),
			y: obj.height()
		}
		if (uv_dialog.single) {
			var menu_gap = Blockbench.entity_mode ? 66 : 154
			var editor_size = size.x-16
			size.y = (size.y - menu_gap) * (Blockbench.entity_mode ? Project.texture_width/Project.texture_height : 1)
			if (size.x > size.y) {
				editor_size =  size.y
			}
			uv_dialog.editors.single.setSize(editor_size)

		} else {
			var centerUp = false
			if (size.x < size.y/1.2) {
				var editor_size = limitNumber(size.x / 2 - 35, 80, $(window).height()/3-120)
				editor_size = limitNumber(editor_size, 80, (size.y-64)/3-120)
			} else {
				//4 x 2
				var y_margin = 130
				var editor_size = limitNumber(size.x/4-25,  16,  size.y/2-y_margin)
				centerUp = true
			}
			editor_size = editor_size - (editor_size % 16)
			uv_dialog.setEditorSize(editor_size)
			if (centerUp) {
				uv_dialog.editors.up.jquery.main.css('margin-left', (editor_size+20)+'px').css('clear', 'both')
			}
		}
	},
	setEditorSize: function(size) {
		for (var key in uv_dialog.editors) {
			if (uv_dialog.editors[key] && key !== 'single') {
				uv_dialog.editors[key].jquery.main.css('margin-left', '0')
				uv_dialog.editors[key].setSize(size)
			}
		}
	},
	changeGrid: function(value) {
		if (uv_dialog.single) {
			uv_dialog.editors.single.setGrid('dialog')
			uv_dialog.editors.single.gridSelectOption = value
		} else {
			uv_dialog.allFaces.forEach(function(s) {
				uv_dialog.editors[s].setGrid('dialog')
			})
			uv_dialog.editors.north.gridSelectOption = value
		}
	},
	copy: function(event) {
		if (selected.length === 0) return;
		uv_dialog.clipboard = []

		function addToClipboard(face) {
			var tag = selected[0].faces[face]
			uv_dialog.clipboard.push(new Face(null, tag))
		}
		if (uv_dialog.hoveredSide) {
			addToClipboard(uv_dialog.hoveredSide)
			uv_dialog.editors[uv_dialog.hoveredSide].message('uv_editor.copied')

		} else if (uv_dialog.single) {
			addToClipboard(uv_dialog.editors.single.face)
			uv_dialog.editors.single.message('uv_editor.copied')

		} else if (uv_dialog.selection.length > 0) {
			uv_dialog.selection.forEach(function(s) {
				addToClipboard(s)
				uv_dialog.editors[s].message('uv_editor.copied')
			})
		} else {
			uv_dialog.allFaces.forEach(function(s) {
				addToClipboard(s)
				uv_dialog.editors[s].message('uv_editor.copied')
			})
		}
	},
	paste: function(event) {
		if (uv_dialog.clipboard === null || selected.length === 0) return;

		function applyFace(tag, face) {
			if (!face) face = tag.face
			selected.forEach(function(obj) {
				obj.faces[face].extend(tag)
				Canvas.updateUV(obj)
			})
		}

		if (uv_dialog.hoveredSide) {
			uv_dialog.editors[uv_dialog.hoveredSide].paste({shiftKey: false})

		} else if (uv_dialog.selection.length === 1) {
			applyFace(uv_dialog.clipboard[0], uv_dialog.selection[0])
			if (uv_dialog.single) {
				uv_dialog.editors.single.message('uv_editor.pasted')
			} else {
				uv_dialog.editors[uv_dialog.selection[0]].message('uv_editor.pasted')
			}
		} else {
			if (uv_dialog.clipboard.length === 1) {
				uv_dialog.selection.forEach(function(s) {
					applyFace(uv_dialog.clipboard[0], s)
					uv_dialog.editors[s].message('uv_editor.pasted')
				})
			} else {
				uv_dialog.clipboard.forEach(function(s) {
					if (uv_dialog.selection.includes(s.face)) {
						applyFace(s)
						uv_dialog.editors[s].message('uv_editor.pasted')
					}
				})
			}
		}

		for (var key in uv_dialog.editors) {
			if (uv_dialog.editors[key]) {
				uv_dialog.editors[key].loadData()
			}
		}
	}
}

BARS.defineActions(function() {
	new Action({
		id: 'uv_dialog',
		icon: 'view_module',
		category: 'blockbench',
		condition: ()=>!Blockbench.entity_mode && selected.length,
		click: function () {uv_dialog.openAll()}
	})
	new Action({
		id: 'uv_dialog_full',
		icon: 'web_asset',
		category: 'blockbench',
		click: function () {uv_dialog.openFull()}
	})

	new BarSlider({
		id: 'uv_rotation',
		category: 'uv',
		condition: () => !Blockbench.entity_mode && selected.length,
		min: 0, max: 270, step: 90, width: 80,
		onBefore: () => {
			Undo.initEdit({cubes: selected, uv_only: true})
		},
		onChange: function(slider) {
			uv_dialog.forSelection('rotate')
		},
		onAfter: () => {
			Undo.finishEdit('uv rotate')
		}
	})
	new BarSelect({
		id: 'uv_grid', 
		category: 'uv',
		condition: () => !Blockbench.entity_mode && selected.length,
		width: 60,
		value: 'auto',
		options: {
			auto: true,
			'16': '16x16',
			'32': '32x32',
			'64': '64x64',
			none: true,
		},
		onChange: function(slider) {
			if (open_dialog) {
				uv_dialog.changeGrid(slider.get())
			} else {
				main_uv.setGrid()
			}
		}
	})

	new Action({
		id: 'uv_select_all',
		icon: 'view_module',
		category: 'uv',
		condition: () => open_dialog === 'uv_dialog',
		click: uv_dialog.selectAll
	})

	new Action({
		id: 'uv_maximize',
		icon: 'zoom_out_map',
		category: 'uv',
		condition: () => !Blockbench.entity_mode && selected.length,
		click: function (event) { 
			Undo.initEdit({cubes: selected, uv_only: true})
			uv_dialog.forSelection('maximize', event)
			Undo.finishEdit('uv maximize')
		}
	})
	new Action({
		id: 'uv_auto',
		icon: 'brightness_auto',
		category: 'uv',
		condition: () => !Blockbench.entity_mode && selected.length,
		click: function (event) {
			Undo.initEdit({cubes: selected, uv_only: true})
			uv_dialog.forSelection('setAutoSize', event)
			Undo.finishEdit('auto uv')
		}
	})
	new Action({
		id: 'uv_rel_auto',
		icon: 'brightness_auto',
		category: 'uv',
		condition: () => !Blockbench.entity_mode && selected.length,
		click: function (event) {
			Undo.initEdit({cubes: selected, uv_only: true})
			uv_dialog.forSelection('setRelativeAutoSize', event)
			Undo.finishEdit('auto uv')
		}
	})
	new Action({
		id: 'uv_mirror_x',
		icon: 'icon-mirror_x',
		category: 'uv',
		condition: () => !Blockbench.entity_mode && selected.length,
		click: function (event) {
			Undo.initEdit({cubes: selected, uv_only: true})
			uv_dialog.forSelection('mirrorX', event)
			Undo.finishEdit('mirror uv')
		}
	})
	new Action({
		id: 'uv_mirror_y',
		icon: 'icon-mirror_y',
		category: 'uv',
		condition: () => !Blockbench.entity_mode && selected.length,
		click: function (event) {
			Undo.initEdit({cubes: selected, uv_only: true})
			uv_dialog.forSelection('mirrorY', event)
			Undo.finishEdit('mirror uv')
		}
	})
	new Action({
		id: 'uv_transparent',
		icon: 'clear',
		category: 'uv',
		condition: () => !Blockbench.entity_mode && selected.length,
		click: function (event) {
			uv_dialog.forSelection('clear', event)
		}
	})
	new Action({
		id: 'uv_reset',
		icon: 'replay',
		category: 'uv',
		condition: () => !Blockbench.entity_mode && selected.length,
		click: function (event) {
			Undo.initEdit({cubes: selected, uv_only: true})
			uv_dialog.forSelection('reset', event)
			Undo.finishEdit('reset uv')
		}
	})
	new Action({
		id: 'uv_apply_all',
		icon: 'format_color_fill',
		category: 'uv',
		condition: () => !Blockbench.entity_mode && selected.length,
		click: function (e) {
			Undo.initEdit({cubes: selected, uv_only: true})
			main_uv.applyAll(e)
			Undo.finishEdit('uv apply all')
		}
	})
	new BarSelect({
		id: 'cullface', 
		category: 'uv',
		condition: () => !Blockbench.entity_mode && selected.length,
		options: {
			off: tl('uv_editor.no_faces'),
			north: tl('face.north'),
			south: tl('face.south'),
			west: tl('face.west'),
			east: tl('face.east'),
			up: tl('face.up'),
			down: tl('face.down'),
		},
		onChange: function(sel, event) {
			Undo.initEdit({cubes: selected, uv_only: true})
			uv_dialog.forSelection('switchCullface')
			Undo.finishEdit('cullface')
		}
	})
	new Action({
		id: 'auto_cullface',
		icon: 'block',
		category: 'uv',
		condition: () => !Blockbench.entity_mode && selected.length,
		click: function (event) {
			Undo.initEdit({cubes: selected, uv_only: true})
			uv_dialog.forSelection('autoCullface', event)
			Undo.finishEdit('auto cullface')
		}
	})
	new Action({
		id: 'face_tint',
		category: 'uv',
		condition: () => !Blockbench.entity_mode && selected.length,
		click: function (event) {
			Undo.initEdit({cubes: selected, uv_only: true})
			uv_dialog.forSelection('switchTint', event)
			Undo.finishEdit('tint')
		}
	})
	new Action({
		id: 'uv_shift',
		condition: () => Blockbench.entity_mode,
		icon: 'photo_size_select_large',
		category: 'uv',
		click: function () {
			showUVShiftDialog()
		}
	})
	new Action({
		id: 'toggle_uv_overlay',
		condition: () => Blockbench.entity_mode,
		icon: 'crop_landscape',//'crop_landscape'
		category: 'uv',
		click: function () {
			main_uv.showing_overlays = !main_uv.showing_overlays
			BarItems.toggle_uv_overlay.setIcon(main_uv.showing_overlays ? 'view_quilt' : 'crop_landscape')
			main_uv.displayAllMappingOverlays()
		}
	})
})
