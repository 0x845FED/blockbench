if(!self.define){let e,s={};const i=(i,r)=>(i=new URL(i+".js",r).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,a)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let f={};const b=e=>i(e,c),d={module:{uri:c},exports:f,require:b};s[c]=Promise.all(r.map((e=>d[e]||b(e)))).then((e=>(a(...e),f)))}}define(["./workbox-2d118ab0"],(function(e){"use strict";e.setCacheNameDetails({prefix:"blockbench"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"index.html",revision:"0de5c305518cca3f1a8bb2c997466333"},{url:"favicon.png",revision:"bb17c5c284076fc17e3399860df472d7"},{url:"js/animations/animation.js",revision:"732bc43ee65221d6bf260f6ce4d46f01"},{url:"js/animations/keyframe.js",revision:"9291f84c5a2e85f5971f128f89ed2625"},{url:"js/animations/timeline_animators.js",revision:"5109f184306b57893008fb6c1ce80d6b"},{url:"js/animations/timeline.js",revision:"e49975a9fce1f9cf58bca934f64ffdd0"},{url:"js/api.js",revision:"9578b5ef1848277625c5030497eb1af3"},{url:"js/boot_loader.js",revision:"eafeb6105b00d6b04521f6d3af957c43"},{url:"js/copy_paste.js",revision:"8808fed3722b29d0de32a0d6f27c7b4a"},{url:"js/desktop.js",revision:"06b17b4551c3cc233408ea2464dded10"},{url:"js/display_mode.js",revision:"0838fc8d4c4a6adc5391505af14a3dc0"},{url:"js/edit_sessions.js",revision:"70aa9690398113e40238cb9f859a561f"},{url:"js/file_system.js",revision:"266c7a7f4f1017299bbf97a8996b46a2"},{url:"js/globals.js",revision:"cccd5027e28ac5729607a75eb2dc81a3"},{url:"js/interface/about.js",revision:"a81c9f4739be0cbf4b3bfedbdd961cc2"},{url:"js/interface/action_control.js",revision:"676ce169fbe1c7bfada00088c0d4d70d"},{url:"js/interface/actions.js",revision:"a3b7c7d023fb74251617cc08375e77e9"},{url:"js/interface/dialog.js",revision:"c92584fc002b8cf4a33e32edf1f0fe2e"},{url:"js/interface/interface.js",revision:"b454af8f3fe14572b8f3b7e7bd3d3f38"},{url:"js/interface/keyboard.js",revision:"ae9d44a9e074c44520299ce5a3f627a4"},{url:"js/interface/menu_bar.js",revision:"4dcf88b2b36eab98aec594a5c222c08c"},{url:"js/interface/menu.js",revision:"f57db50cc29a460c2613b1e731499aaf"},{url:"js/interface/panels.js",revision:"e2ec2bc34d9fe39b1bf6e290123d1e0f"},{url:"js/interface/settings.js",revision:"4c408db6d003243d9d49530d19bcf9f4"},{url:"js/interface/start_screen.js",revision:"8fe4b0844d1fc80681da617f27f2aff0"},{url:"js/interface/themes.js",revision:"e37f1c69595409c2113d3dc942fe8d82"},{url:"js/interface/vue_components.js",revision:"335b270e873f405832fad0fe2f58f5fb"},{url:"js/io/codec.js",revision:"112e59ffaa2b162a9153f0182c06cad5"},{url:"js/io/format.js",revision:"c5b8debee0b9343eb74b947df34bc7b4"},{url:"js/io/formats/bbmodel.js",revision:"4adc34a0c9099871b950b622ce55c74a"},{url:"js/io/formats/bedrock_old.js",revision:"23b4cd21f981cd96d765abbe830fa4a9"},{url:"js/io/formats/bedrock.js",revision:"bc20050af76644c9c92f641303f656e4"},{url:"js/io/formats/collada.js",revision:"227cc5156ae194927d7313e159b745cf"},{url:"js/io/formats/fbx.js",revision:"bad1981a2dfde9b6285a237001716c17"},{url:"js/io/formats/generic.js",revision:"7064ced3120d1345c09d9830571bb5e5"},{url:"js/io/formats/gltf.js",revision:"776e9a79aafa0e60c599b892601a8a3f"},{url:"js/io/formats/image.js",revision:"771e284d07a53f5fec0848c1ed83fb1c"},{url:"js/io/formats/java_block.js",revision:"3131e6cf64c3cc1bd46365d5eedd5cd5"},{url:"js/io/formats/modded_entity.js",revision:"c699772b82dac072c9c15078604d7ab9"},{url:"js/io/formats/obj.js",revision:"eab7e11dbcaf00858bda75e3a32c9815"},{url:"js/io/formats/optifine_jem.js",revision:"551a69bdffecb0edfbbf0f38f5d75dfc"},{url:"js/io/formats/optifine_jpm.js",revision:"7902a08955db9db9df5499c03e71b9a7"},{url:"js/io/formats/skin.js",revision:"7c013bda0c47444e9739204a39aa1df8"},{url:"js/io/io.js",revision:"e50f2fd95bb715903136f97bddc5f01e"},{url:"js/io/project.js",revision:"2cbb7d8e0c035f08731a575aeba15e20"},{url:"js/misc.js",revision:"9364579bae02428dd1b7f3eca48e2db9"},{url:"js/modeling/mesh_editing.js",revision:"de05526c19c889202d6c11f93ef31947"},{url:"js/modeling/transform_gizmo.js",revision:"cbecc43e5d7bae9c1f0d6d0455d7a052"},{url:"js/modeling/transform.js",revision:"144473a21b9f81aa8978eb4629f35732"},{url:"js/modes.js",revision:"4f915adbee874f1670217acac4b733c9"},{url:"js/outliner/cube.js",revision:"4d0c1f5896e9311bebb0f3287318471b"},{url:"js/outliner/group.js",revision:"5e8063bb8b1e8f3b25e3bbb253b14098"},{url:"js/outliner/locator.js",revision:"14eaeb93c0b3ca70b06177ffa20b3359"},{url:"js/outliner/mesh.js",revision:"e9e1cec3e596c876481b75848cb40167"},{url:"js/outliner/null_object.js",revision:"0b1322f43d9ec489297dbb8e8318d081"},{url:"js/outliner/outliner.js",revision:"5baa48535a8c2685da3a713ea739b8a7"},{url:"js/outliner/texture_mesh.js",revision:"bfe065ed37b1e721e6c4235b2ad56ca8"},{url:"js/plugin_loader.js",revision:"13bfc37360bfa5933c7cfba3a314a36e"},{url:"js/predicate_editor.js",revision:"8e4095a027c1e0c8891a9c944f42623e"},{url:"js/preview/canvas.js",revision:"b9eb9779dee63d520c171cd73cabd591"},{url:"js/preview/OrbitControls.js",revision:"dd7b1ef87804a39503ec74ceead17fb1"},{url:"js/preview/preview_scenes.js",revision:"d769f67f3d495808e053e634803b1eee"},{url:"js/preview/preview.js",revision:"6ee8ae4cb402ab9c054601dd1a8aa4ab"},{url:"js/preview/screenshot.js",revision:"5fffe89ce6ef68b47cef1c1e068af17c"},{url:"js/property.js",revision:"dd4390b66720181370a3196484652caa"},{url:"js/texturing/color.js",revision:"3da75d3da967d1252f8d73b6259627b1"},{url:"js/texturing/edit_texture.js",revision:"4ac17956bc6a9f2390921de1ffe629e5"},{url:"js/texturing/painter.js",revision:"500c69e260b7d998e9617bcbd9654347"},{url:"js/texturing/texture_generator.js",revision:"f44ae042028ac47651b765774bafc032"},{url:"js/texturing/textures.js",revision:"cbdb38eddbb866702419bc5582da675f"},{url:"js/texturing/uv.js",revision:"3a70d23608abefa327a41e55140c8880"},{url:"js/undo.js",revision:"b4cce1cebd5fe7f9dc7459dcd90214f1"},{url:"js/util.js",revision:"6f540a61a72338f771b838ac183a23c6"},{url:"js/validator.js",revision:"278ea9acea506dbbe166d1be6d77347a"},{url:"js/web.js",revision:"59e7913ace0afe980f1b3612fb02ff0b"},{url:"js/webpack/bundle.js",revision:"9fabaf1a53e2eb7e6132839c36a74d3b"},{url:"lib/CanvasFrame.js",revision:"af677de11b513f6c8c8ff96e31e59acd"},{url:"lib/color-picker.min.js",revision:"1725de455ed2f45daafb69dd90413104"},{url:"lib/fik.min.js",revision:"9985a46a1107966f2375d0c61241c689"},{url:"lib/FileSaver.js",revision:"547422b2d7a739f14eefa1fc1c59c658"},{url:"lib/gif.js",revision:"6760f4c06414ceb8b3d30e14d3a59c69"},{url:"lib/gif.worker.js",revision:"d8cc71ca8334b5002e4481497802c2ac"},{url:"lib/GLTFExporter.js",revision:"761d87878a43c46d12376baa31a9cf6f"},{url:"lib/jimp.min.js",revision:"44fc5c9cee92b9d0d7738f21353297b9"},{url:"lib/jquery-ui.min.js",revision:"f7275ece7d6dea2aec3c23457415695c"},{url:"lib/jquery.js",revision:"3e4bb227fb55271bfe9c9d4a09147bd8"},{url:"lib/jszip.min.js",revision:"9927b911fee8d35162919d3790c7d492"},{url:"lib/lzutf8.js",revision:"37d1ff3b0710ba8961bcdc2c560baa17"},{url:"lib/marked.min.js",revision:"589a61c766b709a5767f76b05176459a"},{url:"lib/molang-prism-syntax.js",revision:"b0f1fa782ca08a1dfc4c4ee43ee3e88b"},{url:"lib/molang.umd.js",revision:"88616524bd08e635e45860d674ff8f61"},{url:"lib/peer.min.js",revision:"da4b6c59e67068a4da26ebfc6b52f7c5"},{url:"lib/prism.js",revision:"f60031ca28963cd4f765111f42cbf615"},{url:"lib/spectrum.js",revision:"a2be6576c3b44bdb4ffce313816e5a65"},{url:"lib/targa.js",revision:"17c5ce65af686baa97294748f929541e"},{url:"lib/three_custom.js",revision:"461c26c501bb7415ed90c370cd09cf43"},{url:"lib/three.min.js",revision:"0a8a3113f4c503210e9a8de577025ff4"},{url:"lib/vue_sortable.js",revision:"87cfedd91d600fb8d44668a0e83d4101"},{url:"lib/vue.min.js",revision:"0a9a4681294d8c5f476687eea6e74842"},{url:"lib/VuePrismEditor.min.js",revision:"5c1566c30c628a99734ca9c6d89861a7"},{url:"lib/wintersky.umd.js",revision:"66f47f36fd1ff5398514600f38c5fda3"},{url:"css/dialogs.css",revision:"ec890a7aa2072f4cac89c0c8cd00cd80"},{url:"css/fontawesome.css",revision:"1cd088b35b0d3fac7265a75875471484"},{url:"css/general.css",revision:"bcb4fc1e845b182bfbb7a920032574d3"},{url:"css/jquery-ui.min.css",revision:"db778110650dea1e4533cd09f75533a2"},{url:"css/panels.css",revision:"1242ff0b0460e59a9f4ffca9f3d3490b"},{url:"css/prism.css",revision:"e684e60c0c17182e96a7d96b6c1a71d3"},{url:"css/setup.css",revision:"56bbc8f6165ac75bc99507c34d0ecc38"},{url:"css/spectrum.css",revision:"f28ec14a773962b92665392c52e967bf"},{url:"css/start_screen.css",revision:"4be7ef14ddecc7b5a484eec61fcb9892"},{url:"css/w3.css",revision:"04db708c100ea3937a3a5bf138cfcbf3"},{url:"css/window.css",revision:"0e834df8366afa9806d22a5cbbdc4d2d"},{url:"assets/armor_stand.png",revision:"d936b2d5fe33f45fc3b67ebace503bf6"},{url:"assets/brush.png",revision:"b6a28bb79f9dea063d7a2ac620a3236a"},{url:"assets/hud.png",revision:"049320fa871e4fbe54978dd6043acd8c"},{url:"assets/inventory_full.png",revision:"430fc3c0627f04302d457eead5e1fa16"},{url:"assets/inventory_nine.png",revision:"28cc307e3f2ee4570532fe6ee01a6131"},{url:"assets/item_frame.png",revision:"08eaa797bfb1ceb3784b6fa04ce77387"},{url:"assets/locator.png",revision:"8448be12d087adfc0aea285af26ecbe8"},{url:"assets/logo_cutout.svg",revision:"1a2b2e5db76846d910af304e87605aee"},{url:"assets/logo_text_white.svg",revision:"021abc358f6fd915b2ad77d548bb1954"},{url:"assets/missing_blend.png",revision:"5d055c1476e74bcdfd987ab62045b8a6"},{url:"assets/missing.png",revision:"462b3d598e49c3bbd453bb01d88ac6aa"},{url:"assets/north.png",revision:"d6c44f75fe7a6dd16927b9b8d8d0e9c2"},{url:"assets/null_object.png",revision:"298d80b3ba99198a3688e8c558dda065"},{url:"assets/player_skin.png",revision:"bd60891dc6eacb8f038556dfdb1dadcc"},{url:"assets/poses/aiming.svg",revision:"99cc4acebde8bf10e5578a6ff0c4d418"},{url:"assets/poses/crouching.svg",revision:"ea45f7a8485078ac9fc50bf6cf032542"},{url:"assets/poses/jumping.svg",revision:"268a1a6966abb5b8eef0fc783017b980"},{url:"assets/poses/natural.svg",revision:"1bc79dd4c044a9fd330745699db6d721"},{url:"assets/poses/none.svg",revision:"38929100bfd2f391c3650fdde20b0e03"},{url:"assets/poses/sitting.svg",revision:"23eab940f7e9729a6e24438487553e7d"},{url:"assets/poses/walking.svg",revision:"eee91b6c25b42f5901961d39d35854d5"},{url:"assets/preview_scenes/mc_end.png",revision:"1406cfcc761cdeab183d76a7ca7f72a2"},{url:"assets/preview_scenes/mc_nether.png",revision:"8610f68e5e0cf57d99370b29d04f6772"},{url:"assets/preview_scenes/mc_overworld.png",revision:"c3b21121a345ade4dab50cc987fd6863"},{url:"assets/preview_scenes/studio.png",revision:"116be6e8296015a2653fe5a8c6e23ffe"},{url:"assets/rotate_cursor.png",revision:"092b9000c5901c27d4bee37236f6407c"},{url:"assets/splash_art.png",revision:"18e5c1de88ad11a8468c35a9295e7366"},{url:"assets/start_screen/generic.png",revision:"28a4c9e9d39b3ffb49d351846ce6f94c"},{url:"assets/uv_preview.png",revision:"dc46b13a7544fe5b4381ef8295c72c8b"},{url:"assets/vertex.png",revision:"6b314afc9e5a153db6798cf8c0a93918"},{url:"assets/zombie.png",revision:"a5fd9124b9eab1bc7880fea5f1b26e4c"},{url:"font/Assistant-Bold.ttf",revision:"d582391da9a68daf10a2ed2514c33826"},{url:"font/Assistant-ExtraBold.ttf",revision:"f2bbc6bae2ee3ce641adc1bb1a655371"},{url:"font/Assistant-ExtraLight.ttf",revision:"5e4d348ae3eca48143c0274a3124a9c0"},{url:"font/Assistant-Light.ttf",revision:"5415f395c1567a5c19efc1dc2892927a"},{url:"font/Assistant-Regular.ttf",revision:"e2b46dd69f54e57767ceef1d5fc8e688"},{url:"font/Assistant-SemiBold.ttf",revision:"d6759edb35ac7f29a029caa1192c010d"},{url:"font/fa-brands-400.woff2",revision:"a9afdb72826cde196ddf29eb8f9d0f8f"},{url:"font/fa-regular-400.woff2",revision:"f817938f131b0cabee81e59a96f9c2a6"},{url:"font/fa-solid-900.woff2",revision:"297973a488f688271dd223d542ba2697"},{url:"font/icomoon.ttf",revision:"71a1c33725b00940ff9182e61ad115f1"},{url:"font/icomoon.woff",revision:"b88ea13d3f23aedd32ed9816f7694b25"},{url:"font/MaterialIcons-Regular.ttf",revision:"74535251e17acfdf74c0ce531fa7d39a"}],{})}));
