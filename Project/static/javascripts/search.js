var gangwon = ["고성군", "동해시", "삼척시", "속초시", "양구군", "양양군",
        "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시",
        "평창군", "홍천군", "화천군", "횡성군"];
var gyunggi = ['가평군',
        '고양시 덕양구',
        '고양시 일산동구',
        '고양시 일산서구',
        '과천시',
        '광명시',
        '광주시',
        '구리시',
        '군포시',
        '김포시',
        '남양주시',
        '동두천시',
        '부천시',
        '성남시 분당구',
        '성남시 수정구',
        '성남시 중원구',
        '수원시 권선구',
        '수원시 영통구',
        '수원시 장안구',
        '수원시 팔달구',
        '시흥시',
        '안산시 단원구',
        '안산시 상록구',
        '안성시',
        '안양시 동안구',
        '안양시 만안구',
        '양주시',
        '양평군',
        '여주시',
        '연천군',
        '오산시',
        '용인시 기흥구',
        '용인시 수지구',
        '용인시 처인구',
        '의왕시',
        '의정부시',
        '이천시',
        '파주시',
        '평택시',
        '포천시',
        '하남시',
        '화성시']

var alert_select_value = function (select_obj){
    // 우선 selectbox에서 선택된 index를 찾고
    var selected_index = select_obj.selectedIndex;
    // 선택된 index의 value를 찾고
    var selected_value = select_obj.options[selected_index].value;
    // 원하는 동작을 수행한다.
    console.log(selected_value);

    if(selected_value == 42){
        console.log("영서짱");
        // for(index in gangwon) {
        //     select.options[select.options.length] = new Option(myobject[index], index);
        // }
        // for (var i = 0; i<)
        // $('#sigungu').append('<option value="귤">귤</option>');
    }


};



