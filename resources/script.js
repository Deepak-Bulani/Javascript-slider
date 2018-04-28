//Js Slider
var slider,
	slideItems,
	slideItemNumber,
	imageWidth,
	prev,
	next,
	autorotate,
	pause,
	play,
	modal,
	currentPostion = 0,
	currentImage = 1;


function init() {
	slider = document.getElementById('slider');
	slideItems = slider.children;
	slideItemNumber = slideItems.length;
	imageWidth = slideItems[0].children[0].offsetWidth;
	slider.style.width = parseInt(imageWidth * (slideItemNumber + 2)) + 'px';
	prev = document.getElementById("prev");
	next = document.getElementById("next");
	modal = document.getElementById("modal");
	pause = document.getElementById("pause");
	play = document.getElementById("close");
	sliceAppend = Array.prototype.slice.call(slideItems, 0, 1)[0].cloneNode(true);
	slicePrepend = Array.prototype.slice.call(slideItems, slideItemNumber - 1, slideItemNumber)[0].cloneNode(true);
	slider.appendChild(sliceAppend);
	slider.style.transitionDuration = '0s';
	slider.style.transform = 'translateX(-' + parseInt(imageWidth) + 'px)';
	slider.insertBefore(slicePrepend, slideItems[0]);
	if (autorotate) clearInterval(autorotate);
	autorotate = setInterval(onClickNext, 2000);
	prev.onclick = function () {
		onClickPrev();
	};
	next.onclick = function () {
		onClickNext();
	};
	swipedetect(slider, function (swipedir) {
		if (swipedir == 'left')
			onClickNext();
		if (swipedir == 'right')
			onClickPrev();
	})
	pause.onclick = function () {
		modal.style.display = "block";
		clearInterval(autorotate)
	};
	play.onclick = function () {
		modal.style.display = "none";
		autorotate = setInterval(onClickNext, 5000);
	}
}

function slideTo(nextImage) {
	var direction;
	direction = currentImage > nextImage ? 1 : -1;
	currentPostion = -1 * currentImage * imageWidth;
	slider.style.transitionDuration = '0.5s';
	slider.style.transform = 'translateX(' + parseInt(currentPostion + direction * imageWidth) + 'px)';
	currentImage = nextImage;
}

function onClickPrev() {
	slideTo(currentImage - 1);

	if (autorotate) clearInterval(autorotate);
	autorotate = setInterval(onClickNext, 2000);

	if (currentImage <= 0) {
		slider.style.transitionDuration = '0s';
		slider.style.transform = 'translateX(-' + (slideItems.length - 2) * imageWidth + 'px)';
		currentImage = slideItemNumber;
	}
}

function onClickNext() {
	slideTo(currentImage + 1);

	if (autorotate) clearInterval(autorotate);
	autorotate = setInterval(onClickNext, 2000);

	if (currentImage >= slideItemNumber + 1) {

		slider.style.transitionDuration = '0s';
		slider.style.transform = 'translateX(-' + imageWidth + 'px)';
		currentImage = 1;
	}
}

function swipedetect(el, callback) {

	var touchsurface = el,
		swipedir,
		startX,
		startY,
		distX,
		threshold = 150, //required min distance traveled to be considered swipe
		restraint = 100, // maximum distance allowed at the same time in perpendicular direction
		allowedTime = 300, // maximum time allowed to travel that distance
		elapsedTime,
		startTime,
		handleswipe = callback || function (swipedir) {}

	touchsurface.addEventListener('touchstart', function (e) {
		var touchobj = e.changedTouches[0]
		swipedir = 'none'
		dist = 0
		startX = touchobj.pageX
		startY = touchobj.pageY
		startTime = new Date().getTime()
	}, false)


	touchsurface.addEventListener('touchend', function (e) {
		var touchobj = e.changedTouches[0]
		distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface

		elapsedTime = new Date().getTime() - startTime // get time elapsed
		if (elapsedTime <= allowedTime) { // first condition for awipe met
			if (Math.abs(distX) >= threshold) { // 2nd condition for horizontal swipe met
				swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
			}
		}
		handleswipe(swipedir)
	})
}

window.onload = init;