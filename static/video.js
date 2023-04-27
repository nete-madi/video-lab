// video.js: Handles all of the JavaScript and initializes the Vue application
// TODO: Hook up text generation button.

// This is for the dragging to work
let isDragging = false;

// Global vars for shape position that are populated in the mousedown function
// and later passed to the editing payload.
var shapeTop;
var shapeLeft;
var shapeToRender;
var shapeType;
var scale;
var duration;
var start_pos;
var text;


// Activate Bootstrap tooltips on the page.
$(document).ready(function () {
	$("#shapebtn").popover({
		html: true,
		placement: 'top',
		sanitize: false, // https://stackoverflow.com/questions/56264280/html-form-inside-bootstrap-popover-not-working
		template: '<div class="shapepopover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
		content: function () {
			return $('#shapepop').html();
		}
	});
	$("#textbtn").popover({
		html: true,
		placement: 'top',
		sanitize: false, // https://stackoverflow.com/questions/56264280/html-form-inside-bootstrap-popover-not-working
		template: '<div class="textpopover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
		content: function () {
			return $('#textpop').html();
		}
	});
	$("#trimbtn").popover({
		html: true,
		placement: 'top',
		sanitize: false, // https://stackoverflow.com/questions/56264280/html-form-inside-bootstrap-popover-not-working
		template: '<div class="trimpopover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
		content: function () {
			return $('#trimpop').html();
		}
	});
});

// Load the import video modal on page load.
$(document).ready(function () {
	$("#importModal").modal('show');
});

// Vue.js - main editing pipeline
var app = new Vue({
	el: '#app',
	data: {
		originalvideos: [],  //original video clips added by user
		videos: [],  //current clips being edited
	},
	delimiters: ['[[', ']]'],
	methods: {

		addVideo: function () {
			this.originalvideos.push({});
			this.videos.push({});
		},

		setRenderVideo: function (videoID) {
			$("#render").attr('src', window.location.href + this.videos[videoID].file);
		},

		reloadOriginalVideo: function (videoID) {
			this.videos[videoID] = { name: this.originalvideos[videoID].name, file: this.originalvideos[videoID].file };
			app.setRenderVideo(videoID);
		},

		removeVideo: function (videoID) {
			// permanently removes the video
			this.videos.splice(videoID, 1);
			this.originalvideos.splice(videoID, 1);
			$("#render").attr('src', "");
		},

		uploadVideoFile: function () {

			let filedata = document.getElementById('fileinput').files[0];
			if (!filedata) {
				console.log("File is empty!");
				return;
			}

			let clipname = $("#clipname").val();
			if (clipname == "") {
				clipname = filedata.name;
			}

			const config = {
				onUploadProgress: function (progressEvent) {
					var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)

				}
			}

			let data = new FormData()
			data.append('videofile', filedata);

			axios.post('/editing/upload', data, config)
				.then(res => {
					console.log(res);

					this.originalvideos.push({ name: clipname, file: res.data });
					this.videos.push({ name: clipname, file: res.data });
					console.log("videos in list: ", this.videos.length);
					console.log('Video uploaded!');

					app.setRenderVideo(this.videos.length - 1);

				})
				.catch(err => console.log(err))
		},

		buttonChecker: function (videos, videoID, actiontype) {

			if (videos.length == 0) {
				alert("You must upload a video first before performing this action.");
			}
			else {
				this.editVideoSubmit(videoID, actiontype);
			}
		},

		editVideoSubmit: function (videoID, actiontype, buttoncheck) {
			console.log("editVideoSubmit return value: ", videoID);
			setLoader(true);

			let video = this.videos[videoID].file;

			if (video === undefined) {
				console.log("Video is empty!");
				return;
			}

			let editor_payload = {};

			if (actiontype == "trim") {
			    let start = $('.trimpopover').find('#start_trim').val();
			    let end = $('.trimpopover').find('#end_trim').val();
				editor_payload = {
					trim_start: start,
					trim_end: end
				}
			}
			else if (actiontype == "image") {
				if (shapeType != "circle_lg") {
					// correct numbers for circle_sm, ar_right, ar_left
					shapeTop = shapeTop * 3.1;
				}
				else {
					shapeTop = shapeTop * 3;
				}
				shapeLeft = shapeLeft * 3;

				if (shapeType != "highlight") {
					scale = 1.51;
				}
				else {
					scale = 3.2;
				}

				console.log("x_new: " + shapeLeft);
				console.log("y_new: " + shapeTop);
				editor_payload = {
					start_time: start_pos,
					duration: duration,
					x_pos: shapeLeft,
					y_pos: shapeTop,
					img_src: shapeToRender,
					text: text,
					scale: scale
				}
			}

			else if (actiontype == "text") {
				shapeLeft = shapeLeft * 3;
				shapeTop = shapeTop * 3.1;
				console.log("x_new: " + shapeLeft);
				console.log("y_new: " + shapeTop);
				editor_payload = {
					start_time: 0,
					duration: duration,
					x_pos: shapeLeft,
					y_pos: shapeTop,
					title: $('.textpopover').find('#textToGenerate').val(),
					text: text
				}
			}

			editor_payload.videofile = video;
			console.log("editor_payload", editor_payload);
			// send edit request to backend and render the preview returned by server
			$.post(window.location.href + "/edit_video/" + actiontype, editor_payload, function (res) {
				setLoader(false);
				if (res.status == "success") {
					app.videos[videoID].file = res.edited_video_path;
					app.setRenderVideo(videoID);
					console.log(res.message);
				}
				else {
					console.log(res.message);
				}
			});
		},

		setStartAndDuration: function (index, button_id) {
			// get id of clicked button
			duration = button_id;
			let actiontype = 'image';
			if (button_id == 18) {
				start_pos = 0;
			}
			else {
				start_pos = document.getElementById("start_pos").value;
			}
			$("#durationModal").modal("hide");
			if (text == true) {
				actiontype = 'text';
			}
			console.log("duration is: " + duration);
			console.log("start position is: " + start_pos);
			this.editVideoSubmit(index, actiontype);
		},

		finalrender: function () {
			setLoader(true);

			let requestobj = { videoscount: this.videos.length }
			for (let i = 0; i < this.videos.length; i++) {
				requestobj['video' + i] = this.videos[i].file;
			}

			console.log("requestobj", requestobj);

			$.post(window.location.href + "/merged_render", requestobj, function (res) {
				console.log(res);

				if (res.status == "success") {
					console.log("Final render success!");
					$("#render").attr('src', window.location.href + res.final_render_video_path);
				}
				else {
					console.log("Final render ERROR: " + res.message);
				}

				setLoader(false);
			});
		}
	},
})

// Logic for dragging and dropping a shape anywhere on the viewport.
function drag() {
	document.addEventListener('mousedown', function (event) {

		let dragElement = event.target.closest('.draggable');
		var editingArea = document.querySelector("#editArea");

		dragElement.ondragstart = function () {
			return false;
		};

		let shiftX = event.clientX - dragElement.getBoundingClientRect().left;
		let shiftY = event.clientY - dragElement.getBoundingClientRect().top;

		dragElement.style.position = 'absolute';
		dragElement.style.zIndex = 1000;
		document.body.append(dragElement);

		moveAt(event.pageX, event.pageY);

		// moves the dragElement at (pageX, pageY) coordinates
		// taking initial shifts into account
		function moveAt(pageX, pageY) {
			dragElement.style.left = pageX - shiftX + 'px';
			dragElement.style.top = pageY - shiftY + 'px';
		}

		function onMouseMove(event) {
			moveAt(event.pageX, event.pageY);
		}

		// move the dragElement on mousemove
		document.addEventListener('mousemove', onMouseMove);

		// drop the dragElement, remove unneeded handlers
		dragElement.onmouseup = function () {
			document.removeEventListener('mousemove', onMouseMove);
			dragElement.onmouseup = null;

			// Get the top, left coordinates of two elements
			const shapeArea = dragElement.getBoundingClientRect();
			const edArea = editingArea.getBoundingClientRect();

			// Calculate the top and left positions
			shapeTop = shapeArea.top - edArea.top;
			shapeLeft = shapeArea.left - edArea.left;

			console.log("x: " + shapeLeft);
			console.log("y: " + shapeTop);

			let Left1 = edArea.left + window.scrollX;
			let Left2 = shapeLeft;
			let Width1 = $(editingArea).width();
			let Width2 = $(dragElement).width();
			let Top1 = edArea.top + window.scrollY; // zero, this is incorrect
			let Top2 = shapeTop;
			let Height1 = $(editingArea).height();
			let Height2 = $(dragElement).height();

			if (((Left1 + Width1) >= Left2)
				&& (Left1 <= (Left2 + Width2))
				&& ((Top1 + Height1) >= Top2)
				&& (Top1 <= (Top2 + Height2))) {
				if ($(dragElement).attr("id") == "generatedText") {
					text = true;
				}
				else {
					text = false;
					shapeToRender = $(dragElement).attr("src");
					shapeType = $(dragElement).attr("id");
					console.log(shapeType);
				}
				// Show duration modal and hide all open popovers on shape drop
				$("#durationModal").modal("show");
				$("#shapebtn").popover('hide');
				$("#textbtn").popover('hide');
				$("#trimbtn").popover('hide');
			}
			else {
				console.log("not in bounds");
			}
		};
	}); // https://javascript.info/mouse-drag-and-drop

}

// Modal that appears while video is rendering.
function setLoader(status = true) {
	if (status) $("#loaderModal").modal("show");
	else $("#loaderModal").modal("hide");
}

// lets upload button work from inside modal
$(document).on("click", "#upload", function (event) {
	app.uploadVideoFile();
	$("#importModal").modal('hide');
});

$("#upnew").on("click", function () {
	$("#importModal").modal('show');
});

$(document).on("click", "#trimclip", function (event) {
	app.buttonChecker(app.$data.videos, 0, 'trim');
});

$(document).on("click", "#generate", function (event) {
    var msg = $('.textpopover').find('#textToGenerate').val();
	$('.textpopover').find('#generatedText').html(msg);
});

document.getElementById("1").onclick = function () {
	duration = 1;
	start_pos = document.getElementById("start_pos").value;
	$("#durationModal").modal("hide");
	console.log("duration is: " + duration);
	console.log("start position is: " + start_pos);
	// call setstartandduration
	app.setStartAndDuration(0,1);
}

document.getElementById("5").onclick = function () {
	duration = 5;
	start_pos = document.getElementById("start_pos").value;
	$("#durationModal").modal("hide");
	console.log("duration is: " + duration);
	console.log("start position is: " + start_pos);
	// call setstartandduration
	app.setStartAndDuration(0,5);
}

document.getElementById("10").onclick = function () {
	duration = 10;
	start_pos = document.getElementById("start_pos").value;
	$("#durationModal").modal("hide");
	console.log("duration is: " + duration);
	console.log("start position is: " + start_pos);
	// call setstartandduration
	app.setStartAndDuration(0,10);
}

document.getElementById("all").onclick = function () {
	duration = 18;
	start_pos = 0;
	$("#durationModal").modal("hide");
	console.log("duration is: " + duration);
	console.log("start position is: " + start_pos);
	// call setstartandduration
	app.setStartAndDuration(0,18);
}

