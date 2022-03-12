var MAP_SIZE = {
    height: 10,
    length: 10
};

var score = 0;

var game_on = 0;
var timer = null;
var double_timer = null;
var time = 15;
var double_time = 3;
var bomb = false;
var score_init = 0;
var double = false;
var double_index = 3;
var pos = {
    row: 0,
    col: 0
}


var initBonus = (size, count) => {
    score_init = Math.floor(Math.random() * 3 + 8);
    // 默认10分，改变输入可以改变难度
    var record = [];
    var time = Math.floor(Math.random() * 3);
    var boom = Math.floor(Math.random() * 3);
    // console.log("time:", time)
    // console.log("boom:", boom)
    while (record.length < count) {
        var row = Math.floor(Math.random() * size.height);
        var col = Math.floor(Math.random() * size.length);
        if ((row == 0 && col == 0) || (inRecord([row, col], record) != 0)) {
            continue;
        }
        if (record.length > 12 && record.length <= 12 + time) {
            // record.push([row, col, -5]);
            record.push([row, col, 'time']);
            continue;
        }
        if (record.length > 12 + time && record.length <= 12 + time + boom) {
            record.push([row, col, 'boom']);
            continue;
        }
        if (record.length == 13 + time + boom) {
            record.push([row, col, 'double']);
            continue;

        }
        if (record.length > 13 + time + boom) {
            record.push([row, col, -5]);
            continue;

        }

        record.push([row, col, score_init]);
    }
    // console.log("record", record)
    return record;
}

var inRecord = (position, record) => {
    for (let i = 0; i < record.length; i++) {
        if ((position[0] == record[i][0]) && (position[1] == record[i][1]))
            return record[i][2];
    }
    return 0;
}

var initMap = (size, count) => {
    var map = [];
    var bonusRecord = initBonus(size, count);
    for (let row = 0; row < size.height; row++) {
        var rowItem = [];
        for (let col = 0; col < size.length; col++) {
            var block_score = inRecord([row, col], bonusRecord);
            if (block_score == 0) {
                rowItem.push(null);
                //restart后保证为null
                continue;
            }
            rowItem.push({
                bonus: block_score
            })
        }
        map.push(rowItem)
    }
    // console.log(map)
    return map;
}

var drawMap = (map) => { //绘制地图
    var map_info = document.getElementsByClassName('map')[0];
    // console.log("map.length", map.length);
    // console.log("map.length", map[0].length);
    for (let i = 0; i < map.length; i++) {
        var Row = document.createElement('div');
        Row.className = 'row';
        for (let j = 0; j < map[0].length; j++) {
            var Cell = document.createElement('div');
            Cell.className = 'cell';
            if (map[i][j] != null) {
                var image = document.createElement('img');

                var bonus = map[i][j].bonus;
                // console.log(bonus)
                if (bonus == -5) {
                    image.src = './image/shit.svg'
                } else if (bonus == 'boom') {
                    image.src = './image/炸弹.svg'
                } else if (bonus == 'time') {
                    image.src = './image/time.svg';
                }
                else if (bonus == 'double') {
                    image.src = "image/doube.svg";
                } else {
                    image.src = "image/dot.svg";
                }
                Cell.appendChild(image);
            }
            Row.appendChild(Cell);
        }
        map_info.appendChild(Row);
    }
}

var initPerson = () => {
    addPerson([0, 0], 1);
}

var deleteImg = ([i, j]) => {
    var Row = document.getElementsByClassName('row')[i];
    var Rowj = Row.children[j];
    if (Rowj.lastElementChild != null) {
        Rowj.removeChild(Rowj.lastElementChild);
    }
}

var addPerson = ([i, j], direction) => {
    var Row = document.getElementsByClassName('row')[i];
    var cell = Row.children[j];
    var img = document.createElement('img');
    img.class = 'person';
    img.src = './image/chidouren.svg';
    var rotation = ['rotate(-90deg)', 'rotate(0deg)', 'rotate(90deg)', 'rotate(180deg)']
    img.style.transform = rotation[direction];
    cell.appendChild(img);
    //     console.log("move了")
}
// setTimeout(JavaScript 函数, 等待的毫秒数)
// 碰到边缘提示
var show_crash = function (pos, index) {
    var newItem = document.createElement('span');
    newItem.class = 'crash';
    img = document.createElement('img');
    img.src = './image/撞击1.svg';
    var rotation = ['rotate(-90deg)', 'rotate(0deg)', 'rotate(90deg)', 'rotate(180deg)']
    img.style.transform = rotation[0];
    newItem.appendChild(img);
    newItem.style.position = 'absolute';
    if (pos.col == 0 && index == 3) {

        var row = 50 * pos.row + 200;
        row += 'px';
        var col = 50 * pos.col + 570;
        col += 'px';
        // console.log(typeof ('100px'))

    }
    else if (pos.col == MAP_SIZE.length - 1 && index == 1) {

        var row = 50 * pos.row + 200;
        row += 'px';
        var col = 50 * pos.col + 680;
        col += 'px';
        // console.log(typeof ('100px'))

    }
    else if (pos.row == 0 && index == 0) {

        var row = 50 * pos.row + 150;
        row += 'px';
        var col = 50 * pos.col + 620;
        col += 'px';
        // console.log(typeof ('100px'))
    }

    else {

        var row = 50 * pos.row + 260;
        row += 'px';
        var col = 50 * pos.col + 625;
        col += 'px';
        // console.log(typeof ('100px'))

    }// 3 0   1 2   2 3   0 1 

    var rotation = ['rotate(0deg)', 'rotate(90deg)', 'rotate(180deg)', 'rotate(-90deg)'];
    img.style.transform = rotation[index];
    newItem.appendChild(img);
    newItem.style.position = 'absolute';
    newItem.style.top = row;
    newItem.style.left = col;
    var map = document.getElementsByClassName('map')[0];
    map.appendChild(newItem);
    setTimeout(function (map, newItem) { map.removeChild(newItem) }, 1000, map, newItem);
}

var double_score = function () {
    double = true;
    double_paint();
    var double_elm = document.getElementsByClassName('double')[0];
    double_elm.style.visibility = 'visible';
    setTimeout(
        function () {
            double = false;
            // double_timer = null;
            clearInterval(double_timer);
            double_index = 3;
            double_elm.style.visibility = 'hidden';
            document.getElementsByClassName('double_time')[0].innerHTML = double_index + '';
        },
        3000);
}
var double_paint = function () {
    var double_time = document.getElementsByClassName('double_time')[0];
    double_timer = setInterval(function () {
        console.log("double_time.value", double_time.value);
        double_index--;
        double_time.innerHTML = double_index + '';
    }, 1000);
}
var handler = function (e) {
    deleteImg([pos.row, pos.col]);
    let keyResult = e.keyCode;
    let direction;
    switch (keyResult) {
        // 移动到边缘提示
        case (37): //左
            if (pos.col == 0) show_crash(pos, 3);
            if (pos.col > 0) {
                pos.col--;
                direction = 3;
            }
            break;
        case (38): //上
            if (pos.row == 0)
                show_crash(pos, 0);

            if (pos.row > 0) {
                pos.row--;
                direction = 0;
            }
            break;
        case (39): //右
            if (pos.col == MAP_SIZE.length - 1) show_crash(pos, 1);
            if (pos.col < MAP_SIZE.length - 1) {
                pos.col++;
                direction = 1;
            }
            break;
        case (40): //下
            if (pos.row == MAP_SIZE.height - 1) show_crash(pos, 2);
            if (pos.row < MAP_SIZE.height - 1) {
                pos.row++;
                direction = 2;
            }
            break;
    }
    var i = pos.row;
    var j = pos.col;
    // console.log("越界检查", i, j)
    if (map[i][j] != null) {
        switch (map[i][j].bonus) {
            case 'time':
                time += 5;
                break;
            case 'boom':
                bomb = true;
                break;
            case 'double':
                double_score();
                break;
            default:
                console.log("double", double);
                if (double)
                    score += 2 * map[i][j].bonus;
                else score += map[i][j].bonus;
        }
        check();
        var Score = document.getElementsByClassName('score')[0];
        Score.innerHTML = score;
        deleteImg([i, j]);

    }
    addPerson([i, j], direction);
    // console.log("现在的位置是：", i, j)
};
var movePerson = () => {
    window.addEventListener("keydown", handler
        , false)
}


// var GetScore = () => {
//     var buffer = document.getElementById("score").value;
//     // console.log(typeof (buffer));
//     buffer = parseInt(buffer);
//     if (buffer < 5 || buffer > 10)
//         alert("输入范围不合适，5-10，请重新输入")
//     else {
//         SCORE = buffer;
//         HiddenScore();

//         // console.log(666);
//         drawMap(map);
//         initPerson();

//     }
//     // console.log(typeof (buffer));
// }




var HiddenScore = () => {
    var text = document.getElementsByClassName('input_score')[0];
    text.style.visibility = 'hidden';
}


var pop = (result) => { //result=0通关；result=1失败；result=2踩到炸弹

    info = ["通关！", "时间到！", "被炸飞！"]
    var Result = document.getElementsByClassName('result')[0];
    var Popup = document.createElement('div');
    var text = document.createTextNode(info[result]);
    var Restart = document.createElement('input');
    Restart.type = 'button';
    Restart.value = 'Restart';
    Restart.id = 'btnRestart';
    Popup.appendChild(text);
    Popup.appendChild(Restart);
    Result.appendChild(Popup);
    Result.style = {
        position: 'absolute', top: '100px', left: '500px'
    }
    window.removeEventListener("keydown", handler);
    StartGame.removeEventListener("click", start);
    StartGame.removeEventListener("click", movePerson);
    timer = null;
    Restart.addEventListener("click", restart, false);
}




var start = () => {
    StartGame.removeEventListener("click", start);
    game_on = 1;
    score = 0;
    time = 15;
    var Time = document.getElementsByClassName('time')[0];

    timer = setInterval(function () {
        if (time > 0) {
            time--;
            check();
        }
        Time.innerHTML = time + ' s';
    }, 1000);
}


var restart = () => {
    time = 15;
    score = 0;
    timer = null;
    bomb = false;
    pos.row = 0;
    pos.col = 0;
    var Result = document.getElementsByClassName('result')[0];
    Result.removeChild(Result.lastElementChild);
    //先把结果提示取消
    var Time = document.getElementsByClassName('time')[0];
    Time.innerHTML = '15 s';
    var Score = document.getElementsByClassName('score')[0];
    Score.innerHTML = '0';
    var map1 = document.getElementsByClassName('map')[0];

    var childs = map1.childNodes;
    for (var i = childs.length - 1; i >= 0; i--) {
        map1.removeChild(childs[i]);
    }

    map = initMap(MAP_SIZE, 20);
    main();

    start();
    movePerson();
}

var check = () => {
    // 提示到边缘
    if (time == 0 || score >= 100 || bomb == true) {

        clearInterval(timer);
        timer = null;

        game_on = 0;
        if (score >= 100) pop(0);
        if (time == 0) pop(1);
        if (bomb == true) pop(2);
    }
}

var main = async () => {

    // console.log(map);

    await drawMap(map);//异步画图
    initPerson();
}

var map = initMap(MAP_SIZE, 20);
main();

var StartGame = document.getElementsByClassName('btn_start')[0];
StartGame.addEventListener("click", start);
StartGame.addEventListener("click", movePerson);
// var score_button = document.getElementsByClassName('score_button')[0];
// score_button.addEventListener("click", GetScore);
