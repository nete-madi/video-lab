let isDragging = false;

// Global vars for shape position that are populated in the mousedown function
// and later passed to the editing payload.
var shapeTop;
var shapeLeft;
var shapeToRender;

// https://hashnode.com/post/whats-the-best-way-to-generate-image-from-text-using-javascript-and-html5-apis-cik6k8rbj01izxy53619llzzp
// Produces an image from text entered by the user

function generate(){
	$("#generate").on('click', function(ev) {
  	    ev.preventDefault();
        var msg = $("#textToGenerate").val();

        var canvas = document.getElementById("generatedText");
        var ctx = canvas.getContext("2d");
        ctx.font = "40px Arial";
        ctx.fillText(msg,0,40);
    });
}(jQuery);

function download(){
	$("#download").on("click", function(){
  	var canvas = document.getElementById("generatedText");
    var fullQuality = canvas.toDataURL("image/png", 1.0);
    window.open(fullQuality);
  });
}(jQuery);


// Activate Bootstrap tooltips on the page.
$(document).ready(function(){
 $("[data-toggle=popover]").popover({
        html: true,
        content: function() {
              return $('#popover-content').html();
            }
    });
});

// Logic for dragging and dropping a shape anywhere on the viewport.
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

        if( ((Left1 + Width1) >= Left2)
        && (Left1 <= (Left2 + Width2))
        && ((Top1 + Height1) >= Top2)
        && (Top1 <= (Top2 + Height2))) {
            console.log("in bounds");
            if ($(dragElement).attr("id") == "generatedText") {
                console.log("canvas");
                shapeToRender = document.getElementById('generatedText').toDataURL();
            }
            else {
                shapeToRender = $(dragElement).attr("src");
            }
        }
        else {
            console.log("not in bounds");
        }
    };
}); // https://javascript.info/mouse-drag-and-drop

// Logic for video upload progress bar.
function updateProgressBar(percent) {
	$("#uploadprogress").css('width', percent + "%");
	$("#uploadprogress").html(percent + "%");

	if (percent == 100) {
		setTimeout(function () {
			updateProgressBar(0);
		}, 2000);
	}
}

// Modal that appears while video is rendering.
function setLoader(status = true) {
	if (status) $("#loaderModal").modal("show");
	else $("#loaderModal").modal("hide");
}

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
			updateProgressBar(0);

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
					updateProgressBar(percentCompleted);

				}
			}

			let data = new FormData()
			data.append('videofile', filedata);

			axios.post('/editing/upload', data, config)
				.then(res => {
					console.log(res);

					this.originalvideos.push({ name: clipname, file: res.data });
					this.videos.push({ name: clipname, file: res.data });
					console.log("videos", this.videos);
					console.log('Video uploaded!');

					app.setRenderVideo(this.videos.length - 1);

				})
				.catch(err => console.log(err))
		},

		editVideoSubmit: function (videoID, actiontype) {
			console.log("editVideoSubmit", videoID);
			setLoader(true);

			let video = this.videos[videoID].file;

			if (video === undefined) {
				console.log("Video is empty!");
				return;
			}

			let editor_payload = {};

			if (actiontype == "trim") {
				editor_payload = {
					trim_start: $("#trim_start" + videoID).val(),
					trim_end: $("#trim_end" + videoID).val()
				}
			}
			else if(actiontype == "image"){
			        shapeLeft = shapeLeft * 3;
			        shapeTop = shapeTop * 4.5;
			        console.log("x_new: " + shapeLeft);
                    console.log("y_new: " + shapeTop);
					editor_payload = {
						start_time: 0,
						duration: 10,
						x_pos:shapeLeft,
						y_pos:shapeTop,
						img_src:shapeToRender
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

