
// console.log(timestamp);
//
//
// "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+"내APIKEY";


// var lat = 37.544144;
// var lon = 127.207846;

// var appid = "67d8b1d584e1f82bb3207d448c26715c";
// var apiURI ="https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+appid;

// var apiURI ="https://api.openweathermap.org/data/2.5/forecast?lat=37.544144&lon=127.207846&appid=67d8b1d584e1f82bb3207d448c26715c";
var weatherdata=[];

function weather_func(lat, lon){
    var time =[];

    console.log(lat, lon);
    // var lat = 37.544144;
    // var lon = 127.207846;

    timestamp = new Date().getTime();
    var appid = "67d8b1d584e1f82bb3207d448c26715c";
    var apiURI ="https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+appid;
    $.ajax({
        url: apiURI,
        dataType: "json",
        type: "GET",
        async: "false",
        success: function (data) {

            var min = timestamp;
            var result;
            for (var i = 0; i < 40; i++) {

                time[i] = timestamp - data.list[i].dt;

                if (time[i] > 0 && min > time[i]) {
                    min = time[i];
                    result = i;
                }
            }
            // console.log((data.list[result].main.temp - 273.15));
            // console.log(data.list[result].city);
            // console.log(data.list[result]);

            if ((data.list[result].rain) == undefined) {
                data.list[result].rain = 0;
                // console.log(data.list[result].rain);
            } else if ((data.list[result].rain["1h"]) == undefined) {
                if (data.list[result].rain["3h"] == undefined) {
                    data.list[result].rain = 0;
                    // console.log(data.list[result].rain);
                } else {
                    data.list[result].rain = data.list[result].rain["3h"];
                    // console.log(data.list[result].rain);
                }
            }

            if ((data.list[result].snow) == undefined) {
                data.list[result].snow = 0;
                // console.log(data.list[result].snow);
            } else if ((data.list[result].snow["1h"]) == undefined) {
                if (data.list[result].snow["3h"] == undefined) {
                    data.list[result].snow = 0;
                    // console.log(data.list[result].snow);
                } else {
                    data.list[result].snow = data.list[result].snow["3h"];
                    // console.log(data.list[result].snow);
                }
            }
            //
            // console.log("습도 : "+ data.list[result].main.humidity);
            //
            // console.log("기온 : "+ (data.list[result].main.temp- 273.15));
            // console.log("강수량 : " +(data.list[result].rain));
            // console.log("풍속 : "+ data.list[result].wind.speed );
            // console.log("습도 : "+ data.list[result].main.humidity);
            // console.log("적설량 : "+ data.list[result].snow);
            // var x = (data.list[result].main.temp- 273.15)-(100-data.list[result].main.humidity)/5;
            // console.log("이슬점 : "+ x);
            //
            // console.log("=====================");

            var temp =(data.list[result].main.temp)- 273.15;
            var humidity =data.list[result].main.humidity;
            var rain = data.list[result].rain;
            var speed =data.list[result].wind.speed;
            var snow =data.list[result].snow;
            var dew =(data.list[result].main.temp- 273.15)-(100-data.list[result].main.humidity)/5;
            weather = {temp, humidity, rain, speed, snow, dew};

            $.post("/weather", {
                names: weather,
            }, function (data) {
                console.log(data);
            });

        }
    });
}

var markers=[];
function showsido(first) {
    var valname = first.options[first.selectedIndex].text;
    ps.keywordSearch(valname + ' 산', placesSearchCB,{
        category_group_code: "AT4",
        category_name: "여행 > 관광,명소 > 산"
    // size : '500'
});
}

function showsigungu(sigun) {
    var first = document.getElementById('selOne');
    var valname = first.options[first.selectedIndex].text;
    var sigun = sigun.options[sigun.selectedIndex].text;
    if (sigun == '---시,군,구---'){
        sigun = '';
    }
    ps.keywordSearch(valname + sigun + ' 산', placesSearchCB,{
        category_group_code: "AT4",
        category_name: "여행 > 관광,명소 > 산"
    // size : '500'
});

}

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

// 지도를 생성합니다
var map = new  kakao.maps.Map(mapContainer,mapOption);


//중심점으로 이동
function setCenter() {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = new kakao.maps.LatLng(33.452613, 126.570888);

    // 지도 중심을 이동 시킵니다
    map.setCenter(moveLatLon);
}

//부드럽게 이동
function panTo(position_x,position_y) {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = new kakao.maps.LatLng(position_x, position_y);

    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);
}

// var customOverlay = new kakao.maps.CustomOverlay({
//     map : map,
//     position : position,
//     content : content,
//     yAnchor : 1
// });

// 장소 검색 객체를 생성합니다

var ps = new kakao.maps.services.Places();

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({zIndex: 1});


// 키워드로 장소를 검색합니다
ps.keywordSearch('서울시 강남구 산', placesSearchCB,{
        category_group_code: "AT4",
        category_name: "여행 > 관광,명소 > 산"
    // size : '500'
});

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
var globaldata = [];
function placesSearchCB(data, status,pagination) {

    if (status === kakao.maps.services.Status.OK) {
        displayPlaces(data);

        // 페이지 번호를 표출합니다
        displayPagination(pagination);

    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

        alert('검색 결과가 존재하지 않습니다.');
        return;

    } else if (status === kakao.maps.services.Status.ERROR) {

        alert('검색 결과 중 오류가 발생했습니다.');
        return;

    }
}


function displayPlaces(places) {
    var listEl = document.getElementById('name_ul'),
    menuEl = document.getElementById('menu_wrap'),
    fragment = document.createDocumentFragment(),
    bounds = new kakao.maps.LatLngBounds(),
    listStr = '';
    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();

    for ( var i=0; i<places.length; i++ ) {
            lat = places[i].y;
            lon = places[i].x

            weather_func(lat, lon);

            globaldata.push(places[i]);
            var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
            marker = addMarker(placePosition, i),
            itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

            // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
            // LatLngBounds 객체에 좌표를 추가합니다
            bounds.extend(placePosition);


        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        // console.log(places[0]);
        //익명 즉시실행함수
        //https://beomy.tistory.com/9 참고
        (function(marker, title,places) {


            //리스트에서 선택한 지점의 위도경도
            //itemEl에서 x,y가 정의되어 있지않다해서 다른 변수사용.
            var point_x = 0.0;
            var point_y = 0.0;
            point_x = places[i].x;
            point_y = places[i].y;


            kakao.maps.event.addListener(marker, 'onclick', function() {
                map.setLevel(3);
                panTo(point_y,point_x);

                // console.log(places[i].y,places[i].x);
                // console.log(marker[i].position);
                // focusmap(marker,title);
            });
            kakao.maps.event.addListener(marker, 'mouseover', function() {
                // displayInfowindow(marker, title);
            });

            kakao.maps.event.addListener(marker, 'mouseout', function() {
                infowindow.close();
            });


            itemEl.onclick = function(){
                // 지도 중심을 부드럽게 이동시킵니다
                // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
                // console.log(point_y,point_x);

                lat = point_y;
                lon = point_x;

                weather_func(lat, lon);
                map.setLevel(3);
                panTo(point_y,point_x);

             }
            itemEl.onmouseover =  function () {
                // displayInfowindow(marker, title);
            };
            itemEl.onmouseout =  function () {
                infowindow.close();
            };
        })(marker,  places[i].place_name,places);
        // console.log(places[i].x, places[i].y);
        fragment.appendChild(itemEl);

    }


    // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
}

function focusmap(marker,title){
    // console.log(marker);
    alert(marker.length);
}
function removeMarker() {
    for ( var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }
    markers = [];
}

// 검색결과 항목을 Element로 반환하는 함수입니다.
function getListItem(index, places) {

    var el = document.createElement('li'),
    itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
                '<div class="info">' +
                '   <h5>' + places.place_name + '</h5>';

    if (places.road_address_name) {
        itemStr += '    <span>' + places.road_address_name + '</span>' +
                    '   <span class="jibun gray">' +  places.address_name  + '</span>';
    } else {
        itemStr += '    <span>' +  places.address_name  + '</span>';
    }

      itemStr += '  <span class="tel">' + places.phone  + '</span>' +
                '</div>';

    el.innerHTML = itemStr;
    el.className = 'item';
    return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx, title) {
    var imageSrc = 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
        imgOptions =  {
            spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
            spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
            marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage
        });
    // console.log(marker.position);
    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markers.push(marker);  // 배열에 생성된 마커를 추가합니다

    return marker;
}


// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {
    var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

    infowindow.setContent(content);
    infowindow.open(map, marker);
}


var nameList = "";

function displayPagination(pagination) {
    var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i;

    // 기존에 추가된 페이지번호를 삭제합니다
    while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild (paginationEl.lastChild);
    }
    for (i=1; i<=pagination.last; i++) {
        var el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i===pagination.current) {
            el.className = 'on';
        } else {
            el.onclick = (function(i) {
                return function() {
                    
                    //placesSearchCB 재호출
                    pagination.gotoPage(i);
                }
            })(i);
        }

        fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
}


function removeAllChildNods(el) {

    while (el.hasChildNodes()) {
        el.removeChild (el.lastChild);
    }
}

