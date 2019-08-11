// var map = new kakao.maps.Map(document.getElementById('map'), { // 지도를 표시할 div
// 	center : new kakao.maps.LatLng(37.0989864650266,128.916106214053), // 지도의 중심좌표
// 	level : 5 // 지도의 확대 레벨
// });
//
// var marker = new kakao.maps.Marker({
//     map: map,
//     position: new kakao.maps.LatLng(37.0989864650266,128.916106214053)
// });
//
var map = new kakao.maps.Map(document.getElementById('map'), { // 지도를 표시할 div
    center : new kakao.maps.LatLng(36.2683, 127.6358), // 지도의 중심좌표
    level : 14 // 지도의 확대 레벨
});

// 마커 클러스터러를 생성합니다
var clusterer = new kakao.maps.MarkerClusterer({
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
    minLevel: 10 // 클러스터 할 최소 지도 레벨
});

// 데이터를 가져오기 위해 jQuery를 사용합니다
// 데이터를 가져와 마커를 생성하고 클러스터러 객체에 넘겨줍니다
$.get("static/data/data.json", function(data) {
    // 데이터에서 좌표 값을 가지고 마커를 표시합니다
    // 마커 클러스터러로 관리할 마커 객체는 생성할 때 지도 객체를 설정하지 않습니다
    var markers = $(data.positions).map(function(i, position) {
        return new kakao.maps.Marker({
            position : new kakao.maps.LatLng(position.lat, position.lng)
        });
    });

    // 클러스터러에 마커들을 추가합니다
    clusterer.addMarkers(markers);
});






// var mapContainer = document.getElementById('map'), // 지도를 표시할 div
//     mapOption = {
//         center: new kakao.maps.LatLng(37.0989864650266,128.916106214053), // 지도의 중심좌표
//         level: 3 // 지도의 확대 레벨
//     };
//
// var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
//
// // 마커를 표시할 위치와 title 객체 배열입니다
// var positions = [
//     {
//         title: '카카오',
//         latlng: new kakao.maps.LatLng(37.0989864650266,128.916106214053)
//     },
//     {
//         title: '생태연못',
//         latlng: new kakao.maps.LatLng(37.161284623798,128.918047321808)
//     },
//     {
//         title: '텃밭',
//         latlng: new kakao.maps.LatLng(33.450879, 126.569940)
//     },
//     {
//         title: '근린공원',
//         latlng: new kakao.maps.LatLng(33.451393, 126.570738)
//     }
// ];
//
//
// for (var i = 0; i < positions.length; i ++) {
//
//     // 마커 이미지의 이미지 크기 입니다
//     var imageSize = new kakao.maps.Size(24, 35);
//
//     // 마커 이미지를 생성합니다
//
//     // 마커를 생성합니다
//     var marker = new kakao.maps.Marker({
//         map: map, // 마커를 표시할 지도
//         position: positions[i].latlng, // 마커를 표시할 위치
//         title : positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
//
//     });
// }










//
// var map = new kakao.maps.Map(document.getElementById('map'), { // 지도를 표시할 div
// 	center : new kakao.maps.LatLng(37.0989864650266,128.916106214053), // 지도의 중심좌표
// 	level : 14 // 지도의 확대 레벨
// });
// //마커를 표시할 위치와 내용을 가지고 있는 객체 배열입니다
// var positions = [
//     {
//         content: '산',
//         latlng: new kakao.maps.LatLng(37.0989864650266,128.916106214053),
//         removable : true
//     },
//     {
//         content: '산1',
//         latlng: new kakao.maps.LatLng(37.161284623798,128.918047321808),
//         removable : true
//     },
//     {
//         content: '산2',
//         latlng: new kakao.maps.LatLng(37.1261565442647,128.859899454114),
//         removable : true
//     }
// ];



