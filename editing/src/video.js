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
						x_pos:100,
						y_pos:100
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

