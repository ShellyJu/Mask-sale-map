var cityData = []; //儲存所有的藥局資料

// ************** Map預設畫面 引用自leaflet **********************
var map = L.map('map').setView([24.1616603,120.637713], 12); //經緯度&放大倍率

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// ************** 各縣市JSON資料讀取並帶入option **********************
var URL = "https://gist.githubusercontent.com/abc873693/2804e64324eaaf26515281710e1792df/raw/a1e1fc17d04b47c564bbd9dba0d59a6a325ec7c1/taiwan_districts.json";
$.getJSON( URL, function(city) {
    console.log(city); 
    for(var i=0; i<city.length; i++){
		var strHTML= '<option value="'+city[i].name+'">'+city[i].name+'</option>';
		$("#city").append(strHTML);
	}
});


// ************** Opendata + Map marker **********************
$(function(){
	//載入藥局資料
	$.ajax({
		type: "GET",
		url: "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json",
		dataType: "json",
		success: showdata,
		error: function(data){
			alert("get Opendata error");
		}
	});

	$(".scroll-list").css("overflow", "hide");
	// ************** 監聽縣市選單 **********************
	$("#city").bind("input propertychange", function(){
		console.log($(this).val());
		var	selectedCity = $(this).val(); //設變數儲存選取值(option value)
		var regionCity =[]; //預設為空值待存放資料

		cityData.forEach(function(item){
			if(item.properties.county === selectedCity){
				regionCity.push(item); //將option value = openData縣市的資料放入陣列存放
			}
			$(".scroll-list").css("overflow", "scroll");
		});
		console.log(regionCity); //僅會顯示該選取縣市藥局資料

		
        $("#pharmacyList").empty(); // 清空pharmacyList
        removeMarker(); //清空所有的marker

		//將迴圈移到此處用regionCity資料繪製地圖
		//已在下方function將cityData設置為data.features，regionCity = data.features (selected)
		for(var i=0; i<regionCity.length; i++){

			L.marker([regionCity[i].geometry.coordinates[1],regionCity[i].geometry.coordinates[0]]).addTo(map)
		    .bindPopup('<div class="card" style="width: 18rem;"><img class="card-img-top" src="https://picsum.photos/200/150" alt=""><div class="card-body"><h5 class="card-title">'+regionCity[i].properties.name+'</h5><h5 class="card-text">Address: '+regionCity[i].properties.address+'</h5><h5 class="card-text">Rest adult mask: '+regionCity[i].properties.mask_adult+' pcs</h5><h5 class="card-text">Rest child mask: '+regionCity[i].properties.mask_child+'pcs</h5><a href="#" class="btn btn-ifo text-white">Direction</a></div></div>');
			
			var pharmacyList = '<li class="list-group-item mb-2"><h4>'+regionCity[i].properties.name+'</h4><h6>Address: '+regionCity[i].properties.address+'</h6><h6>Adult mask: '+regionCity[i].properties.mask_adult+' pcs</h6><h6>Child mask: '+regionCity[i].properties.mask_child+' pcs</h6><h6>'+regionCity[i].properties.note+'</h6></li>';
			$("#pharmacyList").append(pharmacyList);
		}

		//將marker範圍移動至選取縣市
		panTo(regionCity[0].geometry.coordinates[1],regionCity[0].geometry.coordinates[0]);
	});
});


function showdata(data){
	// console.log(data);
	cityData = data.features; //將cityData內容設定為data.features
	console.log(cityData);

	// for(var i=0; i<50; i++){
	// 	// console.log(data.features[i].properties.name);

	// 	L.marker([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]]).addTo(map)
	//     .bindPopup('<div class="card" style="width: 18rem;"><img class="card-img-top" src="https://picsum.photos/200/150" alt=""><div class="card-body"><h5 class="card-title">'+data.features[i].properties.name+'</h5><h5 class="card-text">Address: '+data.features[i].properties.address+'</h5><h5 class="card-text">Rest adult mask: '+data.features[i].properties.mask_adult+' pcs</h5><h5 class="card-text">Rest child mask: '+data.features[i].properties.mask_child+'pcs</h5><a href="#" class="btn btn-ifo text-white">Direction</a></div></div>')		    
	//     .openPopup();
	// }	
}

//******************** 引用自leaflet ************************
//清除marker 
 function removeMarker(){
    map.eachLayer(function(layer){
      if(layer instanceof L.Marker){
        map.removeLayer(layer);
      }  
    });
  }

//將marker範圍移動至選取縣市
function panTo(Lat, Lng){
	map.panTo([Lat, Lng]);
}