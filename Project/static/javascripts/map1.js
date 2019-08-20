//==============================================================================
// 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
function showsido(first) {
    var valname = first.options[first.selectedIndex].text;
    ps.keywordSearch(valname +' 산', placesSearchCB);
}
function showsigungu(sigun) {
    var first = document.getElementById('selOne');
    var valname = first.options[first.selectedIndex].text;
    var sigun = sigun.options[sigun.selectedIndex].text;
    ps.keywordSearch(valname + sigun +' 산', placesSearchCB);
}


var infowindow = new kakao.maps.InfoWindow({zIndex:1});

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();

// 키워드로 장소를 검색합니다
ps.keywordSearch('서울시 강남구 산', placesSearchCB);


// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB (data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        var bounds = new kakao.maps.LatLngBounds();


        for (var i=0; i<data.length; i++) {
            if(data[i].category_name.indexOf('산') !=-1) {
                displayMarker(data[i]);
                bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
            }
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);

        console.log(data)
    }
}

// 지도에 마커를 표시하는 함수입니다
function displayMarker(place) {

    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x)
    });

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function() {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
        infowindow.open(map, marker);
    });
}
// var map = new kakao.maps.Map(document.getElementById('map'), { // 지도를 표시할 div
//     center : new kakao.maps.LatLng(37.27943075229118, 127.01763998406159), // 지도의 중심좌표
//     level : 14 // 지도의 확대 레벨
// });

// // 마커 클러스터러를 생성합니다
// var clusterer = new kakao.maps.MarkerClusterer({
//     map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
//     averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
//     minLevel: 10 // 클러스터 할 최소 지도 레벨
// });
//
// // 데이터를 가져오기 위해 jQuery를 사용합니다
// // 데이터를 가져와 마커를 생성하고 클러스터러 객체에 넘겨줍니다
// $.get("static/data/data.json", function(data) {
//     // 데이터에서 좌표 값을 가지고 마커를 표시합니다
//     // 마커 클러스터러로 관리할 마커 객체는 생성할 때 지도 객체를 설정하지 않습니다
//     var markers = $(data.positions).map(function(i, position) {
//         return new kakao.maps.Marker({
//             position : new kakao.maps.LatLng(position.lat, position.lng)
//         });
//     });
//
//     // 클러스터러에 마커들을 추가합니다
//     clusterer.addMarkers(markers);
// });
//
// var mapContainer = document.getElementById('map'), // 지도를 표시할 div
//     mapOption = {
//         center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
//         level: 3 // 지도의 확대 레벨
//     };
//
//
//
// // 지도에 클릭 이벤트를 등록합니다
// // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
// kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
//
//     // 클릭한 위도, 경도 정보를 가져옵니다
//     var latlng = mouseEvent.latLng;
//
//     var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
//     message += '경도는 ' + latlng.getLng() + ' 입니다';
//
//     var resultDiv = document.getElementById('result');
//     resultDiv.innerHTML = message;
//
// });

//--------------------------------------------
// 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
// var infowindow = new kakao.maps.InfoWindow({zIndex:1});
//
//
// // 장소 검색 객체를 생성합니다
// var ps = new kakao.maps.services.Places(map);
//
// // 카테고리로 산을 검색합니다.
// ps.categorySearch('AT4', placesSearchCB, {
//     // Map 객체를 지정하지 않았으므로 좌표객체를 생성하여 넘겨준다.
//     location: new kakao.maps.LatLng(37.496295, 127.061416),
//     // radius : 20000
//     // "x":"127.12487249641414","y":"37.70263763644767"
// });
// // 키워드 검색 완료 시 호출되는 콜백함수 입니다
// function placesSearchCB (data, status, pagination) {
//     console.log(data)
//     if (status === kakao.maps.services.Status.OK) {
//         console.log(data)
//         for (var i=0; i<data.length; i++) {
//             if(data[i].category_name.indexOf('산') !=-1){
//                 displayMarker(data[i]);
//
//             }
//
//         }
//     }
// }
//
// // 지도에 마커를 표시하는 함수입니다
// function displayMarker(place) {
//     // 마커를 생성하고 지도에 표시합니다
//     var marker = new kakao.maps.Marker({
//         map: map,
//         position: new kakao.maps.LatLng(place.y, place.x)
//     });
//
//     // 마커에 클릭이벤트를 등록합니다
//     kakao.maps.event.addListener(marker, 'click', function() {
//         // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
//         infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
//         infowindow.open(map, marker);
//     });
// }
