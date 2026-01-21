/*

Troop - In-browser avatar generator
Copyright (C) 2014 tombazza

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function ($) {
	'use strict';

	let layerData;
	const bodyCanvasWidth = 91;
	const layerMargin = 10;
	const layerAllowMany = {
		body: false,
		hair: true,
		hats: true,
		pants: false,
		bottoms: false,
		tops: true,
		shoes: false,
		extras: false
	};

	function load() {
		$(window).resize(onResize);
		$('#generator #body .clear').click(clearLayers);
		$('#generator #body .save').click(saveImage);
		onResize();
		getLayerData();
	}

	function clearLayers(e) {
		$('#generator #body .layer').html('');
		$('#viewer .section .layer').removeClass('selected');
		e.preventDefault();
	}

	function saveImage() {
		const imageStack = [];
		let loadRemains = 0;
		let stackPosition = 0;
		const buffer = document.createElement('canvas');
		buffer.width = 91;
		buffer.height = 139;
		const context = buffer.getContext('2d');
		const toLoad = [];

		toLoad[0] = {
			url: 'assets/skeleton.gif',
			posn: [0, 0]
		};

		const items = $('#generator #body .item');

		items.each(function (key) {
			stackPosition = stackPosition + 1;
			const curImgPosn = stackPosition;
			const posn = $(this).css('background-position').replace(/px/g, '').split(' ');
			const imgUrl = $(this).attr('itemurl');

			toLoad[curImgPosn] = {
				url: imgUrl,
				posn: posn
			};
		});

		processQueue();

		function processQueue() {
			for (let i = 0; i < toLoad.length; i++) {
				loadRemains = loadRemains + 1;
				const curImg = toLoad[i];
				console.log(curImg);
				imageStack[i] = {
					image: new Image(),
					posn: curImg.posn
				};
				imageStack[i].image.onload = function () {
					loadRemains = loadRemains - 1;
					renderImage();
				};
				imageStack[i].image.src = curImg.url;
			}
		}

		function renderImage() {
			if (loadRemains === 0) {
				console.log(imageStack);
				$.each(imageStack, function (key, item) {
					context.drawImage(item.image, item.posn[0], item.posn[1]);
				});
				const d = new Date();
				const dateString = '' + d.getDate() + (d.getMonth() + 1) + d.getFullYear() + d.getHours() + d.getMinutes() + d.getSeconds();
				buffer.toBlob(function (blob) {
					saveAs(blob, 'avatar_' + dateString + '.png');
				});
			}
		}
	}

	function getLayerData() {
		$.getJSON("wardrobe.json", function (data) {
			layerData = data;
			generateLayers();
		});
	}

	function generateLayers() {
		const tabs = $('#generator ul.tabs');
		const viewer = $('#viewer');
		for (const name in layerData) {
			tabs.append($('<li id="tab_' + name + '">' + ucfirst(name) + '</li>'));
			const images = layerData[name];
			let viewerHtml = '<div class="section" id="section_' + name + '" style="width: ' + (images.length * (layerMargin + bodyCanvasWidth)) + 'px">';
			$.each(images, function (i, image) {
				const url = 'assets/' + name + '/' + image;
				try {
					const posn = image.split('-')[1].replace('.gif', '').split('x');
					viewerHtml += '<div class="layer" style="background-image:url(' + url + ');background-position:' + posn[0] + 'px ' + posn[1] + 'px" rel="' + image + '"></div>';
				} catch (err) {}
			});
			viewerHtml += '</div>';
			viewer.append($(viewerHtml));
		}
		$('#generator ul.tabs li').click(tabClick);
		$('#generator #viewer .section:first').show();
		$('#generator ul.tabs li:first').addClass('selected');
		$('#generator #viewer .layer').click(clickLayer);
	}

	function tabClick(e) {
		const id = $(this).attr('id').replace('tab_', '');
		$('#generator #viewer .section').hide();
		$('#generator ul.tabs li').removeClass('selected');
		$('#section_' + id).show();
		$(this).addClass('selected');
		e.preventDefault();
	}

	function clickLayer(e) {
		const image = $(this).attr('rel');
		const parent = $(this).parent('.section').attr('id').replace('section_', '');
		// add layer to body image
		const selector = '#generator #body #layer_' + parent;
		const url = 'assets/' + parent + '/' + image;

		// determine if we are allowed multiple on this layer
		const itemId = clean('layer_item_' + parent + '_' + image);
		if ($('#' + itemId).length) {
			$('#' + itemId).remove();
			$(this).removeClass('selected');
		} else {
			if (!layerAllowMany[parent]) {
				$(selector).html('');
				$('#section_' + parent + ' .layer').removeClass('selected');
			}
			$(selector).append($('<div id="' + itemId + '" class="item" style="background-image:url(' + url + ');background-position:' + $(this).css('background-position') + '" itemurl="' + url + '"></div>'));
			$(this).addClass('selected');
		}
	}

	function onResize() {
		setViewerWidth();
	}

	function setViewerWidth() {
		const freeSpace = ($('#generator').width() - 115);
		$('#viewer').width(freeSpace);
	}

	function ucfirst(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function clean(string) {
		const response = string.replace('.', '');
		const output = response.replace('-', '');
		return output;
	}

	$(document).ready(load);

})(jQuery);
