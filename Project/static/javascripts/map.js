//지도를 띄워줍니다
var container = document.getElementById('map');
var options = {
    center: new kakao.maps.LatLng(128.916106214053,37.0989864650266),
    level: 3
};

var map = new kakao.maps.Map(container, options);


// 마커를 표시할 위치와 내용을 가지고 있는 객체 배열입니다
// var positions = [
//     {
//         content: '관악산',
//         latlng: new kakao.maps.LatLng(128.916106214053,37.0989864650266),
//         removable : true
//     }
// ];