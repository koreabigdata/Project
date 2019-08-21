var markers=[];
function showsido(first) {
    var valname = first.options[first.selectedIndex].text;
    ps.keywordSearch(valname + ' 산', placesSearchCB);
}

function showsigungu(sigun) {

    var first = document.getElementById('selOne');
    var valname = first.options[first.selectedIndex].text;
    var sigun = sigun.options[sigun.selectedIndex].text;
    ps.keywordSearch(valname + sigun + ' 산', placesSearchCB);
}


var infowindow = new kakao.maps.InfoWindow({zIndex: 1});

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
var globaldata = [];
function placesSearchCB(data, status,pagination) {


    if (status === kakao.maps.services.Status.OK) {

        //기존 마커를 삭제
        removeMarker();
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        var bounds = new kakao.maps.LatLngBounds();


        for (var i = 0; i < data.length; i++) {
            if (data[i].category_name.indexOf('산') != -1) {
                globaldata.push(data[i]);
                displayMarker(data[i]);
                bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
            }
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
        console.log(data.length);

    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

        alert('검색 결과가 존재하지 않습니다.');
        return;

    } else if (status === kakao.maps.services.Status.ERROR) {

        alert('검색 결과 중 오류가 발생했습니다.');
        return;

    }
    console.log(data.length);
}
function removeMarker() {
    for ( var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }
    markers = [];
}
// 지도에 마커를 표시하는 함수입니다
function displayMarker(place) {

    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
        // map: map,
        position: new kakao.maps.LatLng(place.y, place.x)
    });

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function () {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
        infowindow.open(map, marker);
    });

    marker.setMap(map);
    markers.push(marker);
}



var nameList = "";
function  displayList(name){

    var name_ul = document.getElementById(name);


    if(nameList != 0){
        console.log("aaa");
        //
        // while(name_ul.firstChild == null){
        //     name_ul.removeChild(name_ul.firstChild);
        //     console.log(name_ul.firstChild);
        // }

        console.log(name_ul);

        for (var i = 0; i < globaldata.length; i++) {
            nameList += "<li>" + globaldata[i].place_name + "</li>";
            document.getElementById("name_ul").innerHTML = nameList;
        }

    }else if(nameList == 0){
        console.log('ddd');
        for (var i = 0; i < globaldata.length; i++) {
            nameList += "<li>" + globaldata[i].place_name + "</li>";
            document.getElementById("name_ul").innerHTML = nameList;
        }
    }
}


///