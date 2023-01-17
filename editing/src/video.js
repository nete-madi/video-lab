let isDragging = false;
var shapeTop;
var shapeLeft;
document.addEventListener('mousedown', function (event) {

    let dragElement = event.target.closest('.draggable');
    var editingArea = document.querySelector("#editArea");
    var circle = document.querySelector("#circle");

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
        const shapeArea = circle.getBoundingClientRect();
        const edArea = editingArea.getBoundingClientRect();

        // Calculate the top and left positions
        shapeTop = shapeArea.top - edArea.top;
        shapeLeft = shapeArea.left - edArea.left;

        console.log("top: " + shapeTop);
        console.log("left: " + shapeLeft);

        /*

        let Left1 = editingArea.offsetLeft; // undefined
        let Left2 = circle.offsetLeft;
        let Width1 = $("#editArea").outerWidth();
        let Width2 = $("#circle").width();
        let Top1 = editingArea.offsetTop; // undefined
        let Top2 = circle.offsetTop;
        let Height1 = $("#editArea").outerHeight();
        let Height2 = $("#circle").height();


        console.log("left1: " + Left1);
        console.log("left2: " + Left2);
        console.log("width1: " + Width1);
        console.log("Width2: " + Width2);
        console.log("Top1: " + Top1);
        console.log("Top2: " + Top2);
        console.log("Height1: " + Height1);
        console.log("Height2: " + Height2);


        if( ((Left1 + Width1) >= Left2)
        && (Left1 <= (Left2 + Width2))
        && ((Top1 + Height1) >= Top2)
        && (Top1 <= (Top2 + Height2))) {
            console.log("in bounds");
        }
        else {
            console.log("not in bounds");
        }
        */
    };
}); // https://javascript.info/mouse-drag-and-drop


function updateProgressBar(percent) {
	$("#uploadprogress").css('width', percent + "%");
	$("#uploadprogress").html(percent + "%");

	if (percent == 100) {
		setTimeout(function () {
			updateProgressBar(0);
		}, 2000);
	}
}

function setLoader(status = true) {
	if (status) $("#loaderModal").modal("show");
	else $("#loaderModal").modal("hide");
}

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
					editor_payload = {
						start_time: 0,
						//$("#start_stamp"+videoID).val(),
						duration: 10,
						x_pos:shapeLeft,
						y_pos:shapeTop
						//$("#duration"+videoID).val(),
						//x_pos: event.clientX,
						//y_pos: event.clientY,
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

