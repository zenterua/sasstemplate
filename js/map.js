jQuery(function( $ ) {

	var maps = [];

	var styles = [
		// Style 0 
		[{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}],
		}],
		// Style 1 
		[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]
	];

	function Map(id, mapOptions){
		this.map = new google.maps.Map(document.getElementById(id), mapOptions);
		this.markers = [];
		this.infowindows = [];
	}

	function addMarker(mapId,location,index,contentstr,image){
        maps[mapId].markers[index] = new google.maps.Marker({
            position: location,
            map: maps[mapId].map,
			icon: {
				url: image
			}
        });

		maps[mapId].infowindows[index] = new google.maps.InfoWindow({
			content:contentstr
		});
		
		google.maps.InfoWindow.prototype.opened = true;
		google.maps.event.addListener(maps[mapId].markers[index], 'click', function() {

			if(infoWindow.opened){
			   infoWindow.opened = false;
			   maps[mapId].infowindows[0].open(maps[mapId].map, maps[mapId].markers[index]);
			}
			else{
			   maps[mapId].infowindows[0].close();
			   infoWindow.opened = true;
			   maps[mapId].infowindows[0].open(maps[mapId].map, maps[mapId].markers[index]);
			}
		});

		google.maps.InfoWindow.prototype.opened = false;
		infoWindow = new google.maps.InfoWindow();


    }

	function initialize(mapInst) {

		var lat = mapInst.attr("data-lat"),
			lng = mapInst.attr("data-lng"),
			newLat,
			newLang,
			myLatlng = new google.maps.LatLng(lat,lng),
			setZoom = parseInt(mapInst.attr("data-zoom")),
			mapId = mapInst.attr('id');

		var mapStyle = styles[parseInt(mapInst.data('style'),10)];
		var styledMap = new google.maps.StyledMapType(mapStyle,{name: "styledmap"});

		var mapOptions = {
			zoom: setZoom,
			disableDefaultUI: true,
			scrollwheel: false,
			zoomControl: true,
			streetViewControl: true,
			center: myLatlng
		};

		maps[mapId] = new Map(mapId, mapOptions);

		maps[mapId].map.mapTypes.set('map_style', styledMap);
  		maps[mapId].map.setMapTypeId('map_style');

		var i = 0;

		$('.marker[data-rel="'+mapId+'"]').each(function(){
			var loc = new google.maps.LatLng($(this).data('lat'), $(this).data('lng')),
				text = $(this).data('string'),
				image = $(this).data('image');
			$(this).data('i', i).data('map',mapId);
			addMarker(mapId,loc,i,text,image);
			i++;
		});

		// Change map location
		$(".city1").on('click', function () {
			newLat = $(this).attr('data-lat');
			newLang = $(this).attr('data-lng');
			maps[mapId].map.setCenter({lat:+newLat, lng:+newLang});
		});
		$(".city2").on('click', function () {
			newLat = $(this).attr('data-lat');
			newLang = $(this).attr('data-lng');
			maps[mapId].map.setCenter({lat:+newLat, lng:+newLang});
		});
	 
	}

	$(window).load(function(){

		$('.map-wrapper').each(function(){
			initialize($(this));
		});

		var tempInfowindow;

		$('.marker').on('click', function(){
			var thisMapId = $(this).data('map'),
				thisIndex = $(this).data('i');
			if(tempInfowindow) tempInfowindow.close();
			tempInfowindow = maps[thisMapId].infowindows[thisIndex];
			maps[thisMapId].infowindows[thisIndex].open(maps[thisMapId].map, maps[thisMapId].markers[thisIndex]);
			maps[thisMapId].map.setCenter(new google.maps.LatLng($(this).data('lat'), $(this).data('lng')));

		});

	});

});