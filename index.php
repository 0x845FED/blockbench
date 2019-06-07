<!DOCTYPE html>
<html>
<head>
	<title>Blockbench</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="theme-color" content="#3e90ff">
	<meta name="robots" content="noindex">
	<link rel="shortcut icon" href="favicon.png" type="image/x-icon" />
	<link rel="stylesheet" href="css/w3.css">
	<link rel="stylesheet" href="css/jquery-ui.min.css">
	<link rel="stylesheet" href="css/font-awesome.min.css">
	<link rel="stylesheet" href="css/spectrum.css">
	<link rel="stylesheet" href="css/style.css">
	<style type="text/css" id="bbstyle"></style>
</head>
<body spellcheck="false">
	<div id="loading_error_message" style="display: none;">An error occurred while loading Blockbench
		<button onclick="Blockbench.reload()" class="large" style="display: block; margin-right: auto; margin-left: auto;">Reload</button>
	</div>
	<script>
		if (typeof module === 'object') {window.module = module; module = undefined;}//jQuery Fix
		const isApp = typeof require !== 'undefined';
		const appVersion = '2.6.7';
	</script>
		<script src="lib/vue.min.js"></script>
		<script src="lib/vue_sortable.js"></script>
		<script src="js/tree.vue.js"></script>
		<script src="lib/jquery.js"></script>
		<script src="lib/jquery-ui.min.js"></script>
		<script src="lib/targa.js"></script>
		<script src="lib/jimp.min.js"></script>
		<script src="lib/jszip.min.js"></script>
		<script src="lib/gif.js"></script>
		<script src="lib/peer.min.js"></script>
		<script src="lib/spectrum.js"></script>
		<script src="lib/three.js"></script>
		<script src="lib/three_custom.js"></script>
		<script src="js/OrbitControls.js"></script>
		<script src="js/OBJExporter.js"></script>
		
		<script src="js/language.js"></script>
		<script src="js/util.js"></script>
		<script src="js/actions.js"></script>
		<script src="js/blockbench.js"></script>
		<script src="js/keyboard.js"></script>
		<script src="js/settings.js"></script>
		<script src="js/undo.js"></script>
		<script src="js/edit_sessions.js"></script>

		<script type="text/javascript">
			if (isApp === true) {
				document.write("<script src='js/app.js'><\/script>");
			} else {
				document.write("<script src='js/web.js'><\/script>");
			}
		</script>

		<script src="js/api.js"></script>
		<script src="js/io.js"></script>
		<script src="js/element.js"></script>
		<script src="js/preview.js"></script>
		<script src="js/TransformControls.js"></script>
		<script src="js/transform.js"></script>
		<script src="js/textures.js"></script>
		<script src="js/uv.js"></script>
		<script src="js/interface.js"></script>
		<script src="js/painter.js"></script>
		<script src="js/display.js"></script>
		<script src="js/animations.js"></script>
		<script src="js/molang.js"></script>
		<script src="js/plugin_loader.js"></script>
		<script>if (window.module) module = window.module;</script>
		
	<div id="post_model" class="web_only post_data" hidden><?php
		if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {
			$model = $_POST['model'];
			if ($model != "text") {
				echo $model;
			}
		}
	?></div>
	<div id="post_textures" class="web_only post_data" hidden><?php
		if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {
			$textures = $_POST['textures'];
			if ($textures != "text") {
				echo $textures;
			}
		}
	?></div>
	<div style="display: none;"></div>


	<div id="blackout" onclick="$('.dialog#'+open_dialog).find('.cancel_btn:not([disabled])').click()"></div>

	<div id="overlay_message_box" style="display: none;">
		<div>
			<h3><i class="material-icons">keyboard</i><span class="tl">keybindings.recording</span></h3>
			<p class="tl">keybindings.press</p>
			<button class="large tl" onclick="Keybinds.recording.stopRecording()">dialog.cancel</button>
			<button class="large tl" onclick="Keybinds.recording.clear().stopRecording()">keybindings.clear</button>
			<div id="keybind_input_box" contenteditable="true" style="font-size: 0"></div>
		</div>
	</div>

	<div class="dialog draggable" id="welcome_screen">
		<div id="welcome_content"></div>
		<button type="button" class="large cancel_btn hidden tl" onclick="hideDialog()">dialog.cancel</button>
		<div id="dialog_close_button" onclick="$('.dialog#'+open_dialog).find('.cancel_btn:not([disabled])').click()"><i class="material-icons">clear</i></div>
	</div>

	<div class="dialog draggable paddinged" id="updater">
		<h2 class="dialog_handle tl">dialog.update.title</h2>
		<h1></h1>

		<div id="updater_content"></div>

		<div class="progress_bar" id="update_bar">
			<div class="progress_bar_inner"></div>
		</div>
		<div class="dialog_bar">
			<button type="button" class="large cancel_btn confirm_btn uc_btn tl" onclick="hideDialog()">dialog.close</button>
		</div>
		<div id="dialog_close_button" onclick="$('.dialog#'+open_dialog).find('.cancel_btn:not([disabled])').click()"><i class="material-icons">clear</i></div>
	</div>

	<div class="dialog draggable paddinged" id="plugins">
		<h2 class="dialog_handle tl">dialog.plugins.title</h2>

		<div class="bar next_to_title" id="plugins_header_bar"></div>

		<div class="bar">
			<div class="tab open tl" onclick="switchPluginTabs(true)" id="installed_plugins">dialog.plugins.installed</div>
			<div class="tab tl" onclick="switchPluginTabs(false)" id="all_plugins">dialog.plugins.available</div>
			<div class="search_bar">
				<input type="text" class="dark_bordered" id="plugin_search_bar" oninput="Plugins.updateSearch()">
				<i class="material-icons" id="plugin_search_bar_icon">search</i>
			</div>
		</div>
		<ul class="list" id="plugin_list">
			<li v-for="plugin in plugin_search" v-bind:plugin="plugin.id" v-bind:class="{testing: plugin.fromFile, expanded: plugin.expanded}">
				<div class="title" v-on:click="plugin.toggleInfo()">
					<i v-if="plugin.icon.substr(0,3) !== 'fa-' " class="material-icons plugin_icon">{{ plugin.icon }}</i>
					<i v-else class="fa fa_big plugin_icon" v-bind:class="plugin.icon"></i>

					<i v-if="plugin.expanded" class="material-icons plugin_expand_icon">expand_less</i>
					<i v-else class="material-icons plugin_expand_icon">expand_more</i>
					{{ plugin.title }}
				</div>
				<div class="button_bar" v-if="plugin.isInstallable()">
					<button type="button" class="" v-on:click="plugin.uninstall()" v-if="plugin.installed"><i class="material-icons">delete</i><span class="tl">dialog.plugins.uninstall</span></button>
					<button type="button" class="" v-on:click="plugin.download(true)" v-else><i class="material-icons">add</i><span class="tl">dialog.plugins.install</span></button>
					<button type="button" class="local_only" v-on:click="plugin.reload()" v-if="plugin.installed && plugin.fromFile && isApp"><i class="material-icons">refresh</i><span class="tl">dialog.plugins.reload</span></button>
				</div>
				<div class="button_bar tiny tl" v-else>{{ checkIfInstallable(plugin) }}</div>

				<div class="author">{{ tl('dialog.plugins.author', [plugin.author]) }}</div>
				<div class="description">{{ plugin.description }}</div>
				<div v-if="plugin.expanded" class="about" v-html="plugin.about"><button>a</button></div>
				<div v-if="plugin.expanded" class="tl" v-on:click="plugin.toggleInfo()" style="text-decoration: underline;">dialog.plugins.show_less</div>
			</li>
			<div class="no_plugin_message tl" v-if="plugin_search.length < 1 && showAll === false">dialog.plugins.none_installed</div>
			<div class="no_plugin_message tl" v-if="plugin_search.length < 1 && showAll === true" id="plugin_available_empty">dialog.plugins.none_available</div>
		</ul>

		<div class="dialog_bar">
			<button type="button" class="large cancel_btn confirm_btn uc_btn tl" onclick="saveInstalledPlugins();hideDialog();">dialog.close</button>
		</div>
		<div id="dialog_close_button" onclick="$('.dialog#'+open_dialog).find('.cancel_btn:not([disabled])').click()"><i class="material-icons">clear</i></div>
	</div>

	<div class="dialog draggable paddinged" id="edit_sessions">
		<h2 class="dialog_handle tl">dialog.edit_session.title</h2>

		<div class="dialog_bar">
			<label class="name_space_left tl">edit_session.username</label>
			<input type="text" class="dark_bordered half" id="edit_session_username">
		</div>
		<div class="dialog_bar">
			<label class="name_space_left tl">edit_session.token</label>
			<input type="text" class="dark_bordered half f_left" id="edit_session_token">
			<div id="edit_session_copy_button" class="tool" onclick="EditSession.copyToken()"><div class="tooltip tl">action.paste</div><i class="fa fa_big fa-clipboard"></i></div>
		</div>
		<div class="edit_session_inactive">
			<p class="tl">edit_session.about</p>
			<p>This feature is in BETA. Bugs may occur while using it.</p>
		</div>
		<div class="edit_session_active hidden">
			<p><b class="tl">edit_session.status</b>: <span class="tl" id="edit_session_status">edit_session.connected</span></p>
		</div>

		<div class="dialog_bar">
			<button type="button" class="edit_session_inactive confirm_btn tl" onclick="EditSession.join();">edit_session.join</button>
			<button type="button" class="edit_session_inactive tl" onclick="EditSession.start();">edit_session.create</button>
			<button type="button" class="edit_session_active tl" onclick="EditSession.quit();">edit_session.quit</button>
			<button type="button" class="cancel_btn tl" onclick="hideDialog();">dialog.cancel</button>
		</div>
		<div id="dialog_close_button" onclick="$('.dialog#'+open_dialog).find('.cancel_btn:not([disabled])').click()"><i class="material-icons">clear</i></div>
	</div>

	<div class="dialog draggable paddinged" id="toolbar_edit">
		<h2 class="dialog_handle tl">dialog.toolbar_edit.title</h2>

		<ul class="bar" id="bar_items_current" v-sortable="{onChoose: choose, onUpdate: sort, onEnd: drop, animation: 160 }">
			<li v-for="item in currentBar" v-bind:title="item.name" :key="item.id||item">
				<div v-if="typeof item === 'string'" class="toolbar_separator"></div>
				<div v-else class="tool">
					<div class="tooltip">{{item.name + (BARS.condition(item.condition) ? '' : ' (' + tl('dialog.toolbar_edit.hidden') + ')' )}}</div>
					<span class="icon_wrapper" v-bind:style="{opacity: BARS.condition(item.condition) ? 1 : 0.4}" v-html="Blockbench.getIconNode(item.icon, item.color).outerHTML"></span>
				</div>
			</li> 
		</ul>

		<div class="bar">
			<div class="search_bar">
				<input type="text" class="dark_bordered" id="action_search_bar" oninput="BARS.list.updateSearch()">
				<i class="material-icons" id="plugin_search_bar_icon">search</i>
			</div>
		</div>

		<ul class="list" id="bar_item_list">
			<li v-for="item in searchedBarItems" v-on:click="addItem(item)">
				<div class="icon_wrapper normal" v-html="Blockbench.getIconNode(item.icon, item.color).outerHTML"></div>
				<div class="icon_wrapper add"><i class="material-icons">add</i></div>
				{{ item.name }}
			</li>
		</ul>

		<div class="dialog_bar">
			<button type="button" class="large cancel_btn confirm_btn uc_btn tl" onclick="saveInstalledPlugins();hideDialog();">dialog.close</button>
		</div>
		<div id="dialog_close_button" onclick="$('.dialog#'+open_dialog).find('.cancel_btn:not([disabled])').click()"><i class="material-icons">clear</i></div>
	</div>

	<div class="dialog draggable paddinged" id="entity_import">
		<h2 class="dialog_handle tl">dialog.entitylist.title</h2>
		<div class="dialog_bar narrow tl">dialog.entitylist.text</div>
			<div class="search_bar">
				<input type="text" class="dark_bordered" id="pe_search_bar" oninput="pe_list._data.search_text = $(this).val().toUpperCase()">
				<i class="material-icons" id="plugin_search_bar_icon">search</i>
			</div>
		<ul id="pe_list" class="list">
			<li v-for="item in searched" v-bind:class="{ selected: item.selected }" v-on:click="selectE(item, $event)" ondblclick="loadEntityModel()">
				<img class="pe_icon" v-if="item.icon" v-bind:src="item.icon">
				<div class="pe_icon" v-else></div>
				<h4>{{ item.title }} <span>({{ item.name }})</span></h4>
				<p>{{ item.bonecount+' '+tl('dialog.entitylist.bones') }}, {{ item.cubecount+' '+tl('dialog.entitylist.cubes') }}</p>
			</li>
		</ul>

		<div class="dialog_bar">
			<button type="button" class="large tl confirm_btn" onclick="loadEntityModel()">dialog.import</button>
			<button type="button" class="large tl cancel_btn" onclick="hideDialog()">dialog.cancel</button>
		</div>
		<div id="dialog_close_button" onclick="$('.dialog#'+open_dialog).find('.cancel_btn:not([disabled])').click()"><i class="material-icons">clear</i></div>
	</div>

	<div class="dialog draggable paddinged" id="image_extruder">
		<h2 class="dialog_handle tl">dialog.extrude.title</h2>
		<h1></h1>

		<div class="dialog_bar">
			<label class="tl">dialog.extrude.mode</label>
			<select class="tool" id="scan_mode" name="scan_mode">
				<option class="tl" id="areas" selected>dialog.extrude.mode.areas</option>
				<option class="tl" id="lines">dialog.extrude.mode.lines</option>
				<option class="tl" id="columns">dialog.extrude.mode.columns</option>
				<option class="tl" id="pixels">dialog.extrude.mode.pixels</option>
			</select>
		</div>

		<div class="dialog_bar">
			<label class="tl">dialog.extrude.opacity</label>
			<input class="tool" type="range" id="scan_tolerance" value="255" min="1" max="255">
			<label id="scan_tolerance_label">255</label>
		</div>

		<canvas height="256" width="256" id="extrusion_canvas"></canvas>

		<div class="dialog_bar">
			<button type="button" class="large tl confirm_btn" onclick="Extruder.startConversion()">Scan and Import</button>
		</div>
	</div>

	<div class="dialog draggable paddinged" id="texture_edit">
		<h2 class="dialog_handle tl" id="te_title">dialog.texture.title</h2>

		<div id="texture_menu_thumbnail"></div>

		<div class="bar">
			<div class="tool link_only" onclick="textures.selected.reopen()"><div class="tooltip tl">menu.texture.change</div><i class="material-icons">file_upload</i></div>
			<div class="tool link_only" onclick="textures.selected.refresh(true)"><div class="tooltip tl">menu.texture.refresh</div><i class="material-icons">refresh</i></div>
			<div class="tool link_only" onclick="textures.selected.openFolder()"><div class="tooltip tl">menu.texture.folder</div><i class="material-icons">folder</i></div>
			<div class="tool" onclick="textures.selected.remove()"><div class="tooltip tl">generic.delete</div><i class="material-icons">delete</i></div>
		</div>

		<p class="multiline_text" id="te_path">path</p>

		<div class="dialog_bar narrow bitmap_only"><label class="tl">dialog.texture.name</label> </div>
		<div class="dialog_bar bitmap_only">
			<input type="text" class="input_wide dark_bordered" id="te_name">
		</div>

		<div class="dialog_bar narrow"><label class="tl">dialog.texture.variable</label> </div>
		<div class="dialog_bar">
			<input type="text" class="input_wide dark_bordered" id="te_variable">
		</div>

		<div class="dialog_bar narrow"><label class="tl">dialog.texture.folder</label> </div>
		<div class="dialog_bar">
			<input type="text" class="input_wide dark_bordered" id="te_folder">
		</div>

		<div class="dialog_bar narrow"><label class="tl">dialog.texture.namespace</label> </div>
		<div class="dialog_bar">
			<input type="text" class="input_wide dark_bordered" id="te_namespace">
		</div>

		<div class="dialog_bar">
			<button type="button" class="large confirm_btn cancel_btn" onclick="saveTextureMenu()">Close</button>
		</div>
		<div id="dialog_close_button" onclick="$('.dialog#'+open_dialog).find('.cancel_btn:not([disabled])').click()"><i class="material-icons">clear</i></div>
	</div>

	<div class="dialog draggable paddinged" id="scaling">
		<h2 class="dialog_handle tl">dialog.scale.title</h2>

		<label class="tl">dialog.scale.axis</label>

		<div class="dialog_bar" style="height: 32px;">
			<input type="checkbox" class="toggle_panel" id="model_scale_x_axis" onchange="scaleAll()" checked>
			<label class="toggle_panel" for="model_scale_x_axis">X</label>
			<input type="checkbox" class="toggle_panel" id="model_scale_y_axis" onchange="scaleAll()" checked>
			<label class="toggle_panel" for="model_scale_y_axis">Y</label>
			<input type="checkbox" class="toggle_panel" id="model_scale_z_axis" onchange="scaleAll()" checked>
			<label class="toggle_panel" for="model_scale_z_axis">Z</label>
		</div>

		<label class="tl">data.origin</label>
		<div class="dialog_bar">
			<label for="scaling_origin_x" class="inline_label tl">X</label>
			<input type="number" id="scaling_origin_x" class="dark_bordered mediun_width" oninput="scaleAll()">
			<label for="scaling_origin_y" class="inline_label tl">Y</label>
			<input type="number" id="scaling_origin_y" class="dark_bordered mediun_width" oninput="scaleAll()">
			<label for="scaling_origin_z" class="inline_label tl">Z</label>
			<input type="number" id="scaling_origin_z" class="dark_bordered mediun_width" oninput="scaleAll()">
		</div>

		<label class="tl">dialog.scale.scale</label>
		<div class="dialog_bar" style="height: 32px;">
			<input type="range" id="model_scale_range" value="1" min="0" max="4" step="0.02" oninput="modelScaleSync()">
			<input type="number" class="f_left" id="model_scale_label" min="0" max="4" step="0.02" value="1" oninput="modelScaleSync(true)">
		</div>

		<div class="dialog_bar narrow" id="scaling_clipping_warning"></div>

		<div class="dialog_bar">
			<button type="button" onclick="scaleAll(true)" class="confirm_btn tl">dialog.scale.confirm</button>
			<button type="button" class="cancel_btn tl" onclick="cancelScaleAll()">dialog.cancel</button>
			<button type="button" class="minor hidden tl" id="scale_overflow_btn" onclick="scaleAllSelectOverflow()">dialog.scale.select_overflow</button>
		</div>
		<div id="dialog_close_button" onclick="$('.dialog#'+open_dialog).find('.cancel_btn:not([disabled])').click()"><i class="material-icons">clear</i></div>
	</div>

	<div class="dialog draggable paddinged" id="create_preset">
		<h2 class="dialog_handle tl">dialog.display_preset.title</h2>
		<div class="dialog_bar tl">dialog.display_preset.message</div>
		<div class="dialog_bar">
			<input type="checkbox" id="thirdperson_righthand_save" checked>
			<label for="thirdperson_righthand_save" class="tl">display.slot.third_right</label>
		</div>
		<div class="dialog_bar">
			<input type="checkbox" id="thirdperson_lefthand_save" checked>
			<label for="thirdperson_lefthand_save" class="tl">display.slot.third_left</label>
		</div>
		<div class="dialog_bar">
			<input type="checkbox" id="firstperson_righthand_save" checked>
			<label for="firstperson_righthand_save" class="tl">display.slot.first_right</label>
		</div>
		<div class="dialog_bar">
			<input type="checkbox" id="firstperson_lefthand_save" checked>
			<label for="firstperson_lefthand_save" class="tl">display.slot.first_left</label>
		</div>
		<div class="dialog_bar">
			<input type="checkbox" id="head_save" checked>
			<label for="head_save" class="tl">display.slot.head</label>
		</div>
		<div class="dialog_bar">
			<input type="checkbox" id="ground_save" checked>
			<label for="ground_save" class="tl">display.slot.ground</label>
		</div>
		<div class="dialog_bar">
			<input type="checkbox" id="fixed_save" checked>
			<label for="fixed_save" class="tl">display.slot.frame</label>
		</div>
		<div class="dialog_bar">
			<input type="checkbox" id="gui_save" checked>
			<label for="gui_save" class="tl">display.slot.gui</label>
		</div>
		<div class="dialog_bar narrow">
			<label class="tl">display.presetname</label>
		</div>
		<div class="dialog_bar">
			<input type="text" id="preset_name" class="input_wide" id="new preset">
		</div>
		<div class="dialog_bar">
			<button type="button" class="large tl confirm_btn" onclick="DisplayMode.createPreset()">dialog.display_preset.create</button>
			<button type="button" class="large tl cancel_btn" onclick="hideDialog()">dialog.cancel</button>
		</div>
		<div id="dialog_close_button" onclick="$('.dialog#'+open_dialog).find('.cancel_btn:not([disabled])').click()"><i class="material-icons">clear</i></div>
	</div>

	<div class="dialog draggable paddinged" id="selection_creator">
		<h2 class="dialog_handle tl">dialog.select.title</h2>

		<div class="dialog_bar">
			<input type="checkbox" id="selgen_new" checked>
			<label class="name_space_left tl" for="selgen_new">dialog.select.new</label>
		</div>

		<div class="dialog_bar">
			<input type="checkbox" id="selgen_group">
			<label class="name_space_left tl" for="selgen_group">dialog.select.group</label>
		</div>

		<div class="dialog_bar">
			<label class="name_space_left tl">dialog.select.name</label>
			<input type="text" class="dark_bordered half" id="selgen_name">
		</div>

		<div class="dialog_bar">
			<label class="name_space_left tl">dialog.select.random</label>
			<input type="range" min="0" max="100" step="1" value="100" class="tool half" id="selgen_random">
		</div>

		<div class="dialog_bar">
			<button type="button" class="large tl confirm_btn" onclick="createSelection()">dialog.select.select</button>
			<button type="button" class="large tl cancel_btn" onclick="hideDialog()">dialog.cancel</button>
		</div>
		<div id="dialog_close_button" onclick="$('.dialog#'+open_dialog).find('.cancel_btn:not([disabled])').click()"><i class="material-icons">clear</i></div>
	</div>

	<div class="dialog draggable paddinged" id="project_settings">
		<h2 class="dialog_handle tl">dialog.project.title</h2>

		<div class="dialog_bar narrow">
			<label for="project_name" class="tl">dialog.project.name</label>
		</div>
		<div class="dialog_bar">
			<input v-model="Project.name" type="text" id="project_name" v-on:focusout="syncGeometry()" class="dark_bordered input_wide">
		</div>

		<div class="dialog_bar narrow">
			<label for="project_parent" class="tl">dialog.project.parent</label>
		</div>
		<div class="dialog_bar">
			<input v-model="Project.parent" type="text" id="project_parent" class="dark_bordered input_wide">
			<!--div v-if="Blockbench.entity_mode === false && Project.parent.length" class="tl">dialog.project.openparent</div-->
		</div>

		<div class="dialog_bar" class="name_space_left block_mode_only">
			<label for="project_ambientocclusion" class="name_space_left tl">dialog.project.ao</label>
			<input v-model="Project.ambientocclusion" type="checkbox" id="project_ambientocclusion">
		</div>

		<div class="dialog_bar narrow">
			<label class="tl">dialog.project.texture_size</label>
		</div>
		<div class="dialog_bar">
			<label for="project_texsize_x" class="inline_label tl">dialog.project.width</label>
			<input v-model="Project.texture_width" type="number" id="project_texsize_x" class="dark_bordered mediun_width" min="1" value="64">
			<label for="project_texsize_y" class="inline_label tl">dialog.project.height</label>
			<input v-model="Project.texture_height" type="number" id="project_texsize_y" class="dark_bordered mediun_width" min="1" value="32">
		</div>

		<div class="dialog_bar">
			<button type="button" class="tl confirm_btn cancel_btn" onclick="saveProjectSettings();hideDialog();">dialog.confirm</button>
			<button type="button" class="minor tl" id="entity_mode_convert" onclick="entityMode.convert()">dialog.project.to_entitymodel</button>
		</div>
		<div id="dialog_close_button" onclick="$('.dialog#'+open_dialog).find('.cancel_btn:not([disabled])').click()"><i class="material-icons">clear</i></div>
	</div>

	<div class="dialog paddinged" id="settings">
		<div class="dialog_bar borderless" id="settings_tab_bar">
			<div class="tl tab open" id="setting" onclick="setSettingsTab('setting')">dialog.settings.settings</div>
			<div class="tl tab" id="keybindings" onclick="setSettingsTab('keybindings')">dialog.settings.keybinds</div>
			<div class="tl tab" id="layout_settings" onclick="setSettingsTab('layout_settings')">dialog.settings.layout</div>
			<div class="tl tab" id="credits" onclick="setSettingsTab('credits')">dialog.settings.about</div>
		</div>

		<div id="setting" class="tab_content">
			<h2 class="tl i_b">dialog.settings.settings</h2>
			<ul id="settingslist">

				<li v-for="category in structure">
					<h3 v-on:click="toggleCategory(category)">
						<i class="material-icons">{{ category.open ? 'expand_more' : 'navigate_next' }}</i>
						{{ category.name }}
					</h3>
					<ul v-if="category.open">

						<li v-for="(setting, key) in category.items" v-if="Condition(setting.condition)" v-on="setting.click ? {click: setting.click} : {}">
							<template v-if="setting.type === 'number'">
								<div class="setting_element"><input type="number" v-model.number="setting.value" v-on:input="saveSettings()"></div>
							</template>
							<template v-else-if="setting.type === 'click'">
								<div class="setting_element" v-html="Blockbench.getIconNode(setting.icon).outerHTML"></div>
							</template>
							<template v-else-if="!setting.type"><!--TOGGLE-->
								<div class="setting_element"><input type="checkbox" v-model="setting.value" v-bind:id="'setting_'+key" v-on:click="saveSettings()"></div>
							</template>

							<label class="setting_label" v-bind:for="'setting_'+key">
								<div class="setting_name">{{ tl('settings.'+key) }}</div>
								<div class="setting_description">{{ tl('settings.'+key+'.desc') }}</div>
							</label>

							<template v-if="setting.type === 'text'">
								<input type="text" class="dark_bordered" style="width: 96%" v-model="setting.value" v-on:input="saveSettings()">
							</template>
							<template v-else-if="setting.type === 'select'">
								<div class="bar_select">
									<select v-model="setting.value">
										<option v-for="(text, id) in setting.options" v-bind:value="id">{{ text }}</option>
									</select>
								</div>
							</template>
						</li>
					</ul>
				</li>
			</ul>
		</div>

		<div id="keybindings" class="hidden tab_content">
			<h2 class="tl i_b">dialog.settings.keybinds</h2>
			<div class="bar next_to_title" id="keybinds_title_bar"></div>
			<ul id="keybindlist">
				<li v-for="category in structure">
					<h3 v-on:click="toggleCategory(category)"><i class="material-icons">{{ category.open ? 'expand_more' : 'navigate_next' }}</i>{{ category.name }}</h3>
					<ul v-if="category.open">
						<li v-for="action in category.actions">
							<div>{{action.name}}</div>
							<div class="keybindslot" v-on:click.stop="record(action)">{{ action.keybind ? action.keybind.label : '' }}</div>
							<div class="tool" v-on:click="reset(action)">
								<div class="tooltip tl">keybindings.reset</div>
								<i class="material-icons">replay</i>
							</div>
							<div class="tool" v-on:click="clear(action)">
								<div class="tooltip tl">keybindings.clear</div>
								<i class="material-icons">clear</i>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>

		<div id="layout_settings" class="hidden tab_content">
			<h2 class="tl i_b">dialog.settings.layout</h2>
			<div class="bar next_to_title" id="layout_title_bar"></div>
			<div id="color_wrapper">
				<div class="color_field">
					<input type="color" class="color_input" id="color_ui" oninput="changeUIColor(event)" onclick="initUIColor(event)">
					<label for="color_ui" style="background-color: var(--color-ui)" class="color_input"></label>
					<div class="desc">
						<h4 class="tl">layout.color.ui</h4>
						<p class="tl">layout.color.ui.desc</p>
					</div>
				</div>
				<div class="color_field">
					<input type="color" class="color_input" id="color_bright_ui" oninput="changeUIColor(event)" onclick="initUIColor(event)">
					<label for="color_bright_ui" style="background-color: var(--color-bright_ui)" class="color_input"></label>
					<div class="desc">
						<h4 class="tl">layout.color.bright_ui</h4>
						<p class="tl">layout.color.bright_ui.desc</p>
					</div>
				</div>
				<div class="color_field">
					<input type="color" class="color_input" id="color_back" oninput="changeUIColor(event)" onclick="initUIColor(event)">
					<label for="color_back" style="background-color: var(--color-back)" class="color_input"></label>
					<div class="desc">
						<h4 class="tl">layout.color.back</h4>
						<p class="tl">layout.color.back.desc</p>
					</div>
				</div>
				<div class="color_field">
					<input type="color" class="color_input" id="color_dark" oninput="changeUIColor(event)" onclick="initUIColor(event)">
					<label for="color_dark" style="background-color: var(--color-dark)" class="color_input"></label>
					<div class="desc">
						<h4 class="tl">layout.color.dark</h4>
						<p class="tl">layout.color.dark.desc</p>
					</div>
				</div>
				<!--Button-->
				<div class="color_field">
					<input type="color" class="color_input" id="color_button" oninput="changeUIColor(event)" onclick="initUIColor(event)">
					<label for="color_button" style="background-color: var(--color-button)" class="color_input"></label>
					<div class="desc">
						<h4 class="tl">layout.color.button</h4>
						<p class="tl">layout.color.button.desc</p>
					</div>
				</div>
				<div class="color_field">
					<input type="color" class="color_input" id="color_selected" oninput="changeUIColor(event)" onclick="initUIColor(event)">
					<label for="color_selected" style="background-color: var(--color-selected)" class="color_input"></label>
					<div class="desc">
						<h4 class="tl">layout.color.selected</h4>
						<p class="tl">layout.color.selected.desc</p>
					</div>
				</div>
				<div class="color_field">
					<input type="color" class="color_input" id="color_border" oninput="changeUIColor(event)" onclick="initUIColor(event)">
					<label for="color_border" style="background-color: var(--color-border)" class="color_input"></label>
					<div class="desc">
						<h4 class="tl">layout.color.border</h4>
						<p class="tl">layout.color.border.desc</p>
					</div>
				</div>
				<div class="color_field">
					<input type="color" class="color_input" id="color_accent" oninput="changeUIColor(event)" onclick="initUIColor(event)">
					<label for="color_accent" style="background-color: var(--color-accent)" class="color_input"></label>
					<div class="desc">
						<h4 class="tl">layout.color.accent</h4>
						<p class="tl">layout.color.accent.desc</p>
					</div>
				</div>
				<div class="color_field">
					<input type="color" class="color_input" id="color_text" oninput="changeUIColor(event)" onclick="initUIColor(event)">
					<label for="color_text" style="background-color: var(--color-text)" class="color_input"></label>
					<div class="desc">
						<h4 class="tl">layout.color.text</h4>
						<p class="tl">layout.color.text.desc</p>
					</div>
				</div>
				<div class="color_field">
					<input type="color" class="color_input" id="color_light" oninput="changeUIColor(event)" onclick="initUIColor(event)">
					<label for="color_light" style="background-color: var(--color-light)" class="color_input"></label>
					<div class="desc">
						<h4 class="tl">layout.color.light</h4>
						<p class="tl">layout.color.light.desc</p>
					</div>
				</div>
				<div class="color_field">
					<input type="color" class="color_input" id="color_text_acc" oninput="changeUIColor(event)" onclick="initUIColor(event)">
					<label for="color_text_acc" style="background-color: var(--color-text_acc)" class="color_input"></label>
					<div class="desc">
						<h4 class="tl">layout.color.accent_text</h4>
						<p class="tl">layout.color.accent_text.desc</p>
					</div>
				</div>
				<div class="color_field">
					<input type="color" class="color_input" id="color_grid" oninput="changeUIColor(event)" onclick="initUIColor(event)">
					<label for="color_grid" style="background-color: var(--color-grid)" class="color_input"></label>
					<div class="desc">
						<h4 class="tl">layout.color.grid</h4>
						<p class="tl">layout.color.grid.desc</p>
					</div>
				</div>
				<div class="color_field">
					<input type="color" class="color_input" id="color_wireframe" oninput="changeUIColor(event)" onclick="initUIColor(event)">
					<label for="color_wireframe" style="background-color: var(--color-wireframe)" class="color_input"></label>
					<div class="desc">
						<h4 class="tl">layout.color.wireframe</h4>
						<p class="tl">layout.color.wireframe.desc</p>
					</div>
				</div>
			</div>

			<div class="dialog_bar">
				<label class="name_space_left tl" for="layout_font_main">layout.font.main</label>
				<input type="text" class="half dark_bordered" id="layout_font_main" oninput="changeUIFont('main')">
			</div>

			<div class="dialog_bar">
				<label class="name_space_left tl" for="layout_font_headline">layout.font.headline</label>
				<input type="text" class="half dark_bordered" id="layout_font_headline" oninput="changeUIFont('headline')">
			</div>

		</div>
		<div id="credits" class="hidden tab_content">
			<h2 class="tl i_b">dialog.settings.about</h2>
			<p><b class="tl">about.version</b> <span id="version_tag"><script>
				$('#version_tag').text(appVersion)
			</script></span></p>
			<p><b class="tl">about.creator</b> JannisX11</p>
			<p><b class="tl">about.website</b> <a class="open-in-browser" href="http://blockbench.net">blockbench.net</a></p>
			<p><b class="tl">about.bugtracker</b> <a class="open-in-browser" href="https://github.com/JannisX11/blockbench/issues">github.com/JannisX11/blockbench</a></p>
			<p class="local_only tl">about.electron</p>
			<p class="tl">about.vertex_snap</p>
			<p><b class="tl">about.icons</b> <a href="https://material.io/icons/" class="open-in-browser">material.io/icons</a> &amp; <a href="http://fontawesome.io/icons/" class="open-in-browser">fontawesome</a></p>
			<p><b class="tl">about.libraries</b>
				<a class="open-in-browser" href="https://jquery.com">jQuery</a>,
				<a class="open-in-browser" href="https://jqueryui.com">jQuery UI</a>,
				<a class="open-in-browser" href="http://touchpunch.furf.com">jQuery UI Touch Punch</a>,
				<a class="open-in-browser" href="https://vuejs.org">VueJS</a>,
				<a class="open-in-browser" href="https://github.com/weibangtuo/vue-tree">Vue Tree</a>,
				<a class="open-in-browser" href="https://github.com/sagalbot/vue-sortable">Vue Sortable</a>,
				<a class="open-in-browser" href="https://threejs.org">ThreeJS</a>,
				<a class="open-in-browser" href="https://github.com/oliver-moran/jimp">Jimp</a>,
				<a class="open-in-browser" href="https://bgrins.github.io/spectrum">Spectrum</a>,
				<a class="open-in-browser" href="https://github.com/jnordberg/gif.js">gif.js</a>
				<a class="open-in-browser" href="https://stuk.github.io/jszip/">JSZip</a>				
			</p>
		</div>

		<div class="dialog_bar">
			<button type="button" class="large confirm_btn cancel_btn tl" onclick="saveSettings()">dialog.close</button>
		</div>
		<div id="dialog_close_button" onclick="$('.dialog#'+open_dialog).find('.cancel_btn:not([disabled])').click()"><i class="material-icons">clear</i></div>
	</div>

	<div class="dialog draggable" id="uv_dialog">
		<div class="dialog_bar borderless dialog_handle block_mode_only" id="uv_tab_bar">
			<div onclick="uv_dialog.openTab('all')" id="all" class="tab open tl">uv_editor.all_faces</div>
			<div onclick="uv_dialog.openTab('north')" id="north" class="tab tl">face.north</div>
			<div onclick="uv_dialog.openTab('south')" id="south" class="tab tl">face.south</div>
			<div onclick="uv_dialog.openTab('west')" id="west" class="tab tl">face.west</div>
			<div onclick="uv_dialog.openTab('east')" id="east" class="tab tl">face.east</div>
			<div onclick="uv_dialog.openTab('up')" id="up" class="tab tl">face.up</div>
			<div onclick="uv_dialog.openTab('down')" id="down" class="tab tl">face.down</div>
		</div>
		<h2 class="dialog_handle entity_mode_only">UV Editor</h2>
		<div id="uv_dialog_all" class="uv_dialog_content uv_dialog_all_only">
			
		</div>
		<div id="uv_dialog_single" class="uv_dialog_content">
			
		</div>
		<div class="bar block_mode_only" id="uv_dialog_toolbar">

			<div class="toolbar_wrapper uv_dialog"></div>

		</div>
		<button type="button" onclick="hideDialog()" class="large confirm_btn cancel_btn hidden">dialog.close</button>
		
		<div id="dialog_close_button" onclick="$('.dialog#'+open_dialog).find('.cancel_btn:not([disabled])').click()"><i class="material-icons">clear</i></div>
	</div>

	<div class="dialog draggable paddinged" id="text_input">
		<h2 class="dialog_handle tl">dialog.input.title</h2>

		<div class="dialog_bar">
			<input type="text" id="text_input_field" class="dark_bordered input_wide">
		</div>

		<div class="dialog_bar">
			<button type="button" class="large confirm_btn tl" onclick="hideDialog()">dialog.confirm</button>
			<button type="button" class="large cancel_btn tl" onclick="hideDialog()">dialog.cancel</button>
		</div>
		<div id="dialog_close_button" onclick="$('.dialog#'+open_dialog).find('.cancel_btn:not([disabled])').click()"><i class="material-icons">clear</i></div>
	</div>

	<div id="plugin_dialog_wrapper"></div>

	<div id="action_selector" v-if="open">
		<input type="text" v-model="search_input">
		<i class="material-icons" id="action_search_bar_icon">search</i>
		<div>
			<ul>
				<li v-for="(item, i) in actions" v-on:click="ActionControl.click(item, $event)" v-bind:class="{selected: i === index}" v-on:mouseenter="index = i">
					<div class="icon_wrapper normal" v-html="Blockbench.getIconNode(item.icon, item.color).outerHTML"></div>
					{{ item.name }}
				</li>
			</ul>
			<div class="small_text" v-if="actions[index]">{{ Pressing.alt ? actions[index].keybind.label : actions[index].description }}</div>
		</div>
	</div>

	<header>
		<div id="title">
			<span>Blockbench</span>
			<i class="icon-blockbench_inverted"></i>
		</div>
		<ul id="menu_bar"></ul>
		<div class="toolbar_wrapper narrow tools"></div>
		<div class="toolbar_wrapper narrow tool_options"></div>
		<div id="mode_selector">
			<li
				v-for="mode in options"
				v-if="Condition(mode.condition)"
				v-bind:class="{selected: mode.selected}"
				v-on:click="mode.select()"
			>{{ mode.name }}</li>
		</div>
	</header>
	<div id="left_bar" class="sidebar">
		<div id="uv" class="panel selection_only">
			<div class="bar next_to_title" id="uv_title_bar"></div>
			<div id="texture_bar" onclick="main_uv.loadSelectedFace()" class="bar tabs_small block_mode_only">

				<input type="radio" name="side" id="north_radio" checked>
				<label class="tl" for="north_radio">face.north</label>

				<input type="radio" name="side" id="south_radio">
				<label class="tl" for="south_radio">face.south</label>
				
				<input type="radio" name="side" id="west_radio">
				<label class="tl" for="west_radio">face.west</label>

				<input type="radio" name="side" id="east_radio">
				<label class="tl" for="east_radio">face.east</label>

				<input type="radio" name="side" id="up_radio">
				<label class="tl" for="up_radio">face.up</label>

				<input type="radio" name="side" id="down_radio">
				<label class="tl" for="down_radio">face.down</label>
			</div>
		</div>
		<div id="display" class="panel">
			<div class="toolbar_wrapper display"></div>
			<p class="tl">display.slot</p>
			<div id="display_bar" class="bar tabs_small">
				<input class="hidden" type="radio" name="display" id="thirdperson_righthand" checked>
				<label class="tool" for="thirdperson_righthand" onclick="DisplayMode.loadThirdRight()"><div class="tooltip tl">display.slot.third_right</div><i class="material-icons">accessibility</i></label>
				<input class="hidden" type="radio" name="display" id="thirdperson_lefthand">
				<label class="tool" for="thirdperson_lefthand" onclick="DisplayMode.loadThirdLeft()"><div class="tooltip tl">display.slot.third_left</div><i class="material-icons">accessibility</i></label>

				<input class="hidden" type="radio" name="display" id="firstperson_righthand">
				<label class="tool" for="firstperson_righthand" onclick="DisplayMode.loadFirstRight()"><div class="tooltip tl">display.slot.first_right</div><i class="material-icons">person</i></label>
				<input class="hidden" type="radio" name="display" id="firstperson_lefthand">
				<label class="tool" for="firstperson_lefthand" onclick="DisplayMode.loadFirstLeft()"><div class="tooltip tl">display.slot.first_left</div><i class="material-icons">person</i></label>

				<input class="hidden" type="radio" name="display" id="head">
				<label class="tool" for="head" onclick="DisplayMode.loadHead()"><div class="tooltip tl">display.slot.head</div><i class="material-icons">sentiment_satisfied</i></label>

				<input class="hidden" type="radio" name="display" id="ground">
				<label class="tool" for="ground" onclick="DisplayMode.loadGround()"><div class="tooltip tl">display.slot.ground</div><i class="icon-ground"></i></label>

				<input class="hidden" type="radio" name="display" id="fixed">
				<label class="tool" for="fixed" onclick="DisplayMode.loadFixed()"><div class="tooltip tl">display.slot.frame</div><i class="material-icons">filter_frames</i></label>

				<input class="hidden" type="radio" name="display" id="gui">
				<label class="tool" for="gui" onclick="DisplayMode.loadGUI()"><div class="tooltip tl">display.slot.gui</div><i class="material-icons">border_style</i></label>
			</div>
			<p class="reference_model_bar tl">display.reference</p>
			<div id="display_ref_bar" class="bar tabs_small reference_model_bar">
			</div>

			<div id="display_sliders">
				
				<p class="tl">display.rotation</p><div class="tool head_right" v-on:click="resetChannel('rotation')"><i class="material-icons">replay</i></div>
				<div class="bar" v-for="axis in [0, 1, 2]">
					<input type="range" class="tool disp_range" v-model.number="slot.rotation[axis]" v-bind:trigger_type="'rotation.'+axis" min="-180" max="180" step="1" value="0" @input="change" @input="change(axis, 'rotation')" @mousedown="start" @change="save">
					<input type="number" class="tool disp_text" v-model.number="slot.rotation[axis]" min="-180" max="180" step="0.5" value="0" @input="change(axis, 'rotation');save()" @mousedown="start">
				</div>
				
				<p class="tl">display.translation</p><div class="tool head_right" v-on:click="resetChannel('translation')"><i class="material-icons">replay</i></div>
				<div class="bar" v-for="axis in [0, 1, 2]">
					<input type="range" class="tool disp_range" v-model.number="slot.translation[axis]" v-bind:trigger_type="'translation.'+axis"
						v-bind:min="Math.abs(slot.translation[axis]) < 10 ? -20 : (slot.translation[axis] > 0 ? -70*3+10 : -80)"
						v-bind:max="Math.abs(slot.translation[axis]) < 10 ?  20 : (slot.translation[axis] < 0 ? 70*3-10 : 80)"
						v-bind:step="Math.abs(slot.translation[axis]) < 10 ? 0.25 : 1"
						value="0" @input="change(axis, 'translation')" @mousedown="start" @change="save">
					<input type="number" class="tool disp_text" v-model.number="slot.translation[axis]" min="-80" max="80" step="0.5" value="0" @input="change(axis, 'translation');save()" @mousedown="start">
				</div>

				<p class="tl">display.scale</p><div class="tool head_right" v-on:click="resetChannel('scale')"><i class="material-icons">replay</i></div>
				<div class="bar" v-for="axis in [0, 1, 2]">
					<div class="tool display_scale_invert" v-on:click="invert(axis)">
						<div class="tooltip tl">display.mirror</div>
						<i class="material-icons">{{ slot.mirror[axis] ? 'check_box' : 'check_box_outline_blank' }}</i>
					</div>
					<input type="range" class="tool disp_range scaleRange" v-model.number="slot.scale[axis]" v-bind:trigger_type="'scale.'+axis" v-bind:id="'scale_range_'+axis"
						v-bind:min="slot.scale[axis] > 1 ? -2 : 0"
						v-bind:max="slot.scale[axis] > 1 ? 4 : 2"
						step="0.01"
						value="0" @input="change(axis, 'scale')" @mousedown="start" @change="save">
					<input type="number" class="tool disp_text" v-model.number="slot.scale[axis]" min="0" max="4" step="0.01" value="0" @input="change(axis, 'scale');save()" @mousedown="start">
				</div>
			</div>
		</div>
		<div id="animations" class="panel">
			<div class="toolbar_wrapper animations"></div>
			<ul id="animations_list" class="list">
				<li v-for="animation in animations"></li>
				<li
					v-for="animation in animations"
					v-bind:class="{ selected: animation.selected }"
					v-bind:anim_id="animation.uuid"
					class="animation"
					v-on:click.stop="animation.select()"
					@contextmenu.prevent.stop="animation.showContextMenu($event)"
				>
					<i class="material-icons">movie</i>
					<input class="animation_name" v-model="animation.name" disabled="true">
				</li>
			</ul>
		</div>
		<div id="keyframe" class="panel">
			<div class="toolbar_wrapper keyframe"></div>
			<p class="tl" id="keyframe_type_label"></p>
			<div class="bar" id="keyframe_bar_x">
				<label>X</label>
				<input type="text" id="keyframe_x" class="dark_bordered code keyframe_input" axis="x" oninput="updateKeyframeValue(this)">
			</div>
			<div class="bar" id="keyframe_bar_y">
				<label>Y</label>
				<input type="text" id="keyframe_y" class="dark_bordered code keyframe_input" axis="y" oninput="updateKeyframeValue(this)">
			</div>
			<div class="bar" id="keyframe_bar_z">
				<label>Z</label>
				<input type="text" id="keyframe_z" class="dark_bordered code keyframe_input" axis="z" oninput="updateKeyframeValue(this)">
			</div>
			<div class="bar" id="keyframe_bar_w">
				<label>W</label>
				<input type="text" id="keyframe_w" class="dark_bordered code keyframe_input" axis="w" oninput="updateKeyframeValue(this)">
			</div>
		</div>
		<div id="variable_placeholders" class="panel grow">
			<p class="tl">panel.variable_placeholders.info</p>
			<textarea id="var_placeholder_area" class="code" style="flex-grow: 1;" onkeyup="Animator.preview()"></textarea>
		</div>
		<div id="textures" class="panel grow">
			<div class="toolbar_wrapper texturelist"></div>
			<ul id="texture_list" class="list">
				<li
					v-for="texture in textures"
					v-bind:class="{ selected: texture.selected, particle: texture.particle}"
					v-bind:texid="texture.uuid"
					class="texture"
					v-on:click.stop="texture.select($event)"
					v-on:dblclick="texture.openMenu($event)"
					@contextmenu.prevent.stop="texture.showContextMenu($event)"
				>
					<div class="texture_icon_wrapper">
						<img v-bind:texid="texture.id" v-bind:src="texture.source" class="texture_icon" width="48px" alt="[E]" v-if="texture.show_icon" />
						<i class="material-icons texture_error" v-bind:title="texture.getErrorMessage()" v-if="texture.error">error_outline</i>
						<i class="texture_movie fa fa_big fa-film" title="Animated Texture" v-if="texture.frameCount > 1"></i>
					</div>
					<i class="material-icons texture_save_icon" v-bind:class="{clickable: !texture.saved}" v-on:click="texture.save()">
						<template v-if="texture.saved">check_circle</template>
						<template v-else>save</template>
					</i>
					<i class="material-icons texture_particle_icon" v-if="texture.particle">bubble_chart</i>
					<div class="texture_name">{{ texture.name }}</div>
					<div class="texture_res">{{ texture.error ? texture.getErrorMessage() : (!Blockbench.entity_mode ? (texture.ratio == 1 ? texture.res + 'px' : (texture.res + 'px, ' + texture.frameCount+'f')) : (texture.res + ' x ' + texture.res*texture.ratio + 'px'))}}</div>
				</li>
			</ul>
		</div>
	</div>
	<div id="right_bar" class="sidebar">
		<div id="options" class="panel selection_only">
			<p class="tl">panel.options.angle</p>
			<div class="toolbar_wrapper rotation"></div>
			<p class="tl">data.origin</p>
			<div class="toolbar_wrapper origin"></div>
		</div>
		<div id="color" class="panel">
			<div id="main_colorpicker_preview"><div></div></div>
			<input id="main_colorpicker">
		</div>
		<div id="outliner" class="panel grow">
			<div class="toolbar_wrapper outliner"></div>
			<ul id="cubes_list" class="list">
				<vue-tree :option="option"></vue-tree>
			</ul>
		</div>
		<div id="chat" class="panel grow">
			<div class="bar next_to_title" id="chat_title_bar"></div>
			<ul id="chat_history" v-if="expanded">
				<li v-for="msg in history">
					<b v-if="msg.showAuthor()" v-bind:class="{self: msg.self}">{{ msg.author }}:</b>
					<span class="text" v-bind:style="{color: msg.hex || 'inherit'}">{{ msg.text }}</span>
					<span class="timestamp">{{ msg.timestamp }}</span>
				</li>
			</ul>
			<div id="chat_bar">
				<input type="text" id="chat_input" class="dark_bordered f_left" maxlength="512">
				<i class="material-icons" onclick="Chat.send()">send</i>
			</div>
		</div>
	</div>
	<div id="preview">
	</div>
	<div id="timeline">
		<div class="toolbar_wrapper timeline"></div>
		<div id="timeline_head">
			<div id="timeline_corner"></div>
			<div class="channel_head">
				<div class="text_button" onclick="Timeline.addKeyframe('rotation')"><i class="material-icons">add</i></div>
				<span class="tl">timeline.rotation</span>
			</div>
			<div class="channel_head">
				<div class="text_button" onclick="Timeline.addKeyframe('position')"><i class="material-icons">add</i></div>
				<span class="tl">timeline.position</span>
			</div>
			<div class="channel_head">
				<div class="text_button" onclick="Timeline.addKeyframe('scale')"><i class="material-icons">add</i></div>
				<span class="tl">timeline.scale</span>
			</div>
		</div>
		<div id="timeline_inner" @contextmenu.prevent="Timeline.showMenu(event)" v-on:click.stop="Timeline.unselect(event)">
			<div id="timeline_time" v-bind:style="{width: (size*length)+'px'}">
				<div v-for="t in timecodes" class="timeline_timecode" v-bind:style="{left: (t.time * size) + 'px'}">
					{{ t.text }}
				</div>
			</div>
			<div id="timeline_marker"
				v-bind:style="{left: (8 + marker * size) + 'px'}"
			></div>
			<div
				v-for="keyframe in keyframes"
				v-bind:style="{left: (8 + keyframe.time * size) + 'px', top: (34+keyframe.channel_index*31) + 'px'}"
				class="keyframe"
				v-bind:class="[keyframe.channel, keyframe.selected?'selected':'']"
				v-bind:id="keyframe.uuid"
				v-on:click.stop="keyframe.select($event)"
				v-on:dblclick="keyframe.callMarker()"
				:title="tl('timeline.'+keyframe.channel)"
				@contextmenu.prevent="keyframe.showContextMenu($event)"
			>
				<i class="material-icons">stop</i>
			</div>
			<div id="timeline_lines"></div>
		</div>
	</div>
	<div id="status_bar" @contextmenu="Interface.status_bar.menu.show(event);console.log(true);">
		<div id="status_saved">
			<i class="material-icons" v-if="Prop.project_saved" v-bind:title="tl('status_bar.saved')">check</i>
			<i class="material-icons" v-else v-bind:title="tl('status_bar.unsaved')">close</i>
		</div>
		<div id="status_name">
			{{ Prop.file_name }}
		</div>
		<div id="status_message" class="hidden"></div>
		<div class="f_right">
			{{ Prop.zoom }}%
		</div>
		<div class="f_right">
			{{ Prop.fps }} FPS
		</div>
		<div class="f_right" v-if="Prop.session">
			{{ Prop.connections }} Clients
		</div>
		<div id="status_progress" v-if="Prop.progress" v-bind:style="{width: Prop.progress*100+'%'}"></div>
	</div>
	<script>
		initCanvas()
		colorSettingsSetup()
		animate()
		initializeApp()
	</script>
	<script>
		if (!Blockbench || !Blockbench.setup_successful) {
			document.getElementById('loading_error_message').style.display = 'block'
			if (typeof require !== undefined) {
				require('electron').remote.getCurrentWindow().webContents.openDevTools()
			}
		}
	</script>
</body>
</html>