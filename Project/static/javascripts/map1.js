var map = new kakao.maps.Map(document.getElementById('map'), { // 지도를 표시할 div
	center : new kakao.maps.LatLng(37.0989864650266,128.916106214053), // 지도의 중심좌표
	level : 5 // 지도의 확대 레벨
});

var marker = new kakao.maps.Marker({
    map: map,
    position: new kakao.maps.LatLng(37.0989864650266,128.916106214053)
});


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



