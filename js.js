jQuery(document).ready(function ($) {

    var response;   //Last response with list of available time and free places
    var currentReserveStart; //What time-list element is current for start
    var currentReserveEnd; //What time-list element is current for end
    var currentMaxPlaces; //How much places are available is current time range
    var currentPlaces; //How much places are choose now
    var reserveDate; //Date which choose now to reserve in unix format
    var globalCurrentDate; //Date for switch month on calendar

    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    function generateCalendar (currentDate = new Date()) {

        globalCurrentDate = currentDate;
        let out = '';
        let monthName = '';

        switch (currentDate.getMonth()) {
            case 0:
                monthName='<div class="calendar__head">Январь</div>';
                break;
            case 1:
                monthName='<div class="calendar__head">Февраль</div>';
                break;
            case 2:
                monthName='<div class="calendar__head">Март</div>';
                break;
            case 3:
                monthName='<div class="calendar__head">Апрель</div>';
                break;
            case 4:
                monthName='<div class="calendar__head">Май</div>';
                break;
            case 5:
                monthName='<div class="calendar__head">Июнь</div>';
                break;
            case 6:
                monthName='<div class="calendar__head">Июль</div>';
                break;
            case 7:
                monthName='<div class="calendar__head">Август</div>';
                break;
            case 8:
                monthName='<div class="calendar__head">Сентябрь</div>';
                break;
            case 9:
                monthName='<div class="calendar__head">Октябрь</div>';
                break;
            case 10:
                monthName='<div class="calendar__head">Ноябрь</div>';
                break;
            case 11:
                monthName='<div class="calendar__head">Декабрь</div>';
                break;
        }

       $('#month-name').html(monthName);

        let requestData = {
            'month':currentDate.getMonth(),
            'year':currentDate.getFullYear()
        };
        //TODO send request with requestData here. Now hardcode response
        let response = JSON.parse('["20","10","18","36","20","10","18","36","20","10","18","36","20","10","18","36","1","10","18","36","20","10","18","36","20","10","18","36","20","10","18"]');

        //Make head of calendar
        out+='<div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>';

        //Make days
        let daysCount = daysInMonth(currentDate.getMonth()+1, currentDate.getFullYear());

        let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

        if(firstDay === 0) {
            firstDay=7; //fix for Sunday
        }
        //Create empty items before first day of month
        while(firstDay > 1) {
            firstDay--;
            out+='<div class="empty-cell"></div>';
        }

        //Create days
        let day=1;
        while (daysCount >= day) {
            out+='<div class="cell"><span class="calendar__day">' + day + '</span><span class="calendar__places">';

            firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day, 23, 59, 59);
            if( firstDay < new Date() ) {
                out+='- мест';
            } else {
                out+='<a class="calendar__reserve"  data-toggle="modal" data-target="#reserveModal">мест: ' + response[ (day-1) ] + '</a>';
            }
            out+='</span></div>';

            day++;
        }

        $('#calendar').html(out);
    }



    function showReserveModal(day) {

        reserveDate = day.getTime()/1000;;
        let requestData = reserveDate;
       //TODO send request here with requestData. Now hardcode response

        response=JSON.parse('{\n' +
            '  "time-list": [\n' +
            '    {\n' +
            '      "time-start":"14:00",\n' +
            '      "time-end":"15:00",\n' +
            '      "free-places":4\n' +
            '    },\n' +
            '    {\n' +
            '     "time-start":"15:00",\n' +
            '      "time-end":"16:00",\n' +
            '      "free-places":2\n' +
            '    },\n' +
            '    {\n' +
            '      "time-start":"16:00",\n' +
            '      "time-end":"17:00",\n' +
            '      "free-places":0\n' +
            '    },\n' +
            '    {\n' +
            '      "time-start":"17:00",\n' +
            '      "time-end":"18:00",\n' +
            '      "free-places":4\n' +
            '    },\n' +
            '    {\n' +
            '      "time-start":"18:00",\n' +
            '      "time-end":"19:00",\n' +
            '      "free-places":3\n' +
            '    }\n' +
            '  ]\n' +
            '}');

        let out='';

        if(response['time-list'].length > 0){

            $('#begin-time').html(response['time-list'][0]['time-start']);
            $('#end-time').html(response['time-list'][0]['time-end']);
            $('#men-quantity').html(response['time-list'][0]['free-places']);
            currentReserveStart = currentReserveEnd = 0;
            currentMaxPlaces = currentPlaces = parseInt(response['time-list'][0]['free-places']);

            for(let i = 0; i < response['time-list'].length; i++) {
                out+='<div id="reserve-id-' + i + '" class="col-6 reserve__list-item';
                if(response['time-list'][i]['free-places'] < 1){
                    out+=' busy ';
                }
                out+='"><span class="reserve__time">' + response['time-list'][i]['time-start'] +
                    '</span><span class="reserve__places"> - свободных мест: ' + response['time-list'][i]['free-places'] + '</span></div>';
            }
        } else {
          out+='Извините, на этот день все места заняты';
        }

        $('#time-list').html(out);
    }

    // Click to arrow left
    $(document).on('click', '#calendar-left', function (e) {
        e.preventDefault();
        globalCurrentDate.setMonth(globalCurrentDate.getMonth() - 1);
        generateCalendar(globalCurrentDate);
    });

    // Click to arrow right
    $(document).on('click', '#calendar-right', function (e) {
        e.preventDefault();
        globalCurrentDate.setMonth(globalCurrentDate.getMonth() + 1);
        generateCalendar(globalCurrentDate);
    });

    // Click to reserve
    $(document).on('click', '.calendar__reserve', function (e) {
        e.preventDefault();
        let day = new Date(globalCurrentDate.getFullYear(), globalCurrentDate.getMonth(), $(this).parents('.cell').find('.calendar__day').text());

        showReserveModal(day);
    });

    function updateReserveFrom(element = false, action = 'plus') {
        if (element) {

            switch( element ) {
                case "begin-time":

                    if(action === 'plus') {
                        if( currentReserveStart < response['time-list'].length - 1 ) {
                            currentReserveStart++;

                            //Set begin time
                            $('#begin-time').html(response['time-list'][currentReserveStart]['time-start']);

                            //Set end time
                            if(currentReserveStart > currentReserveEnd) {
                                currentReserveEnd++;
                                $('#end-time').html(response['time-list'][currentReserveEnd]['time-end']);
                            }

                            //Set max places
                            if(currentReserveStart === currentReserveEnd) {
                                $('#men-quantity').html(response['time-list'][currentReserveStart]['free-places']);
                                currentMaxPlaces = parseInt(response['time-list'][currentReserveStart]['free-places']);
                            } else {
                                let minPlaces = parseInt(response['time-list'][currentReserveStart]['free-places']);
                                for(let i = currentReserveStart; i <= currentReserveEnd; i++) {
                                    if(minPlaces > parseInt(response['time-list'][i]['free-places'])) {
                                        minPlaces = parseInt(response['time-list'][i]['free-places']);
                                    }
                                }
                                $('#men-quantity').html(minPlaces);
                                currentMaxPlaces = minPlaces;
                            }
                        }
                    }
                    else { //for minus
                        if( currentReserveStart > 0 ) {
                            currentReserveStart--;

                            //Set begin time
                            $('#begin-time').html(response['time-list'][currentReserveStart]['time-start']);

                            //Set max places
                            if(currentReserveStart === currentReserveEnd) {
                                $('#men-quantity').html(response['time-list'][currentReserveStart]['free-places']);
                                currentMaxPlaces = parseInt(response['time-list'][currentReserveStart]['free-places']);
                            } else {
                                let minPlaces = parseInt(response['time-list'][currentReserveStart]['free-places']);
                                for(let i = currentReserveStart; i <= currentReserveEnd; i++) {
                                    if(minPlaces > parseInt(response['time-list'][i]['free-places'])) {
                                        minPlaces = parseInt(response['time-list'][i]['free-places']);
                                    }
                                }
                                $('#men-quantity').html(minPlaces);
                                currentMaxPlaces = minPlaces;
                            }

                        }
                    }
                    currentPlaces = currentMaxPlaces;
                    
                    break;
                case "end-time":

                    if(action === 'plus') {
                        if( currentReserveEnd < response['time-list'].length - 1 ) {
                            currentReserveEnd++;

                            //Set end time
                            $('#end-time').html(response['time-list'][currentReserveEnd]['time-end']);

                            //Set max places
                            if(currentReserveStart === currentReserveEnd) {
                                $('#men-quantity').html(response['time-list'][currentReserveStart]['free-places']);
                                currentMaxPlaces = parseInt(response['time-list'][currentReserveStart]['free-places']);
                            } else {
                                let minPlaces = parseInt(response['time-list'][currentReserveStart]['free-places']);
                                for(let i = currentReserveStart; i <= currentReserveEnd; i++) {
                                    if(minPlaces > parseInt(response['time-list'][i]['free-places'])) {
                                        minPlaces = parseInt(response['time-list'][i]['free-places']);
                                    }
                                }
                                $('#men-quantity').html(minPlaces);
                                currentMaxPlaces = minPlaces;
                            }
                        }
                    }
                    else { //for minus
                        if( currentReserveEnd > 0 ) {
                            currentReserveEnd--;

                            //Set end time
                            $('#end-time').html(response['time-list'][currentReserveEnd]['time-end']);

                            //Set begin time
                            if(currentReserveEnd < currentReserveStart ) {
                                currentReserveStart--;
                                $('#begin-time').html(response['time-list'][currentReserveStart]['time-start']);
                            }

                            //Set max places
                            if(currentReserveStart === currentReserveEnd) {
                                $('#men-quantity').html(response['time-list'][currentReserveStart]['free-places']);
                                currentMaxPlaces = parseInt(response['time-list'][currentReserveStart]['free-places']);
                            } else {
                                let minPlaces = parseInt(response['time-list'][currentReserveStart]['free-places']);
                                for(let i = currentReserveStart; i <= currentReserveEnd; i++) {
                                    if(minPlaces > parseInt(response['time-list'][i]['free-places'])) {
                                        minPlaces = parseInt(response['time-list'][i]['free-places']);
                                    }
                                }
                                $('#men-quantity').html(minPlaces);
                                currentMaxPlaces = minPlaces;
                            }

                        }
                    }
                    currentPlaces = currentMaxPlaces;
                    
                    break;
                case "men-quantity":

                    if(action === 'plus') {
                        if( currentMaxPlaces > currentPlaces ) {
                            currentPlaces++;
                            $('#men-quantity').html(currentPlaces);
                        }
                    }
                    else { //for minus
                        if( currentPlaces > 1 ) {
                            currentPlaces--;
                            $('#men-quantity').html(currentPlaces);
                        }
                    }
                    
                    break;
            }
        }
    }

    function setReserveFrom (index) {

        currentReserveStart = parseInt(index);
        currentReserveEnd = parseInt(index);

            //Set end time
            $('#end-time').html(response['time-list'][currentReserveEnd]['time-end']);
            //Set start time
            $('#begin-time').html(response['time-list'][currentReserveStart]['time-start']);

            //Set max places
            $('#men-quantity').html(response['time-list'][currentReserveStart]['free-places']);
            currentMaxPlaces = parseInt(response['time-list'][currentReserveStart]['free-places']);
            currentPlaces = currentMaxPlaces;
    }

    function buildRequest(name, tel) {
        return {
            'time-start': response['time-list'][currentReserveStart]['time-start'],
            'time-end': response['time-list'][currentReserveEnd]['time-end'],
            'places': currentPlaces,
            'name': name,
            'phone': tel,
            'date': reserveDate //unix format
        };
    }

    // Click to plus button
    $(document).on('click', '.btn-group .btn-plus', function (e) {
        e.preventDefault();
        let val = $(this).parents('.btn-group').find('span');

        updateReserveFrom(val.attr('id'), 'plus');

    });

    // Click to minus button
    $(document).on('click', '.btn-group .btn-minus', function (e) {
        e.preventDefault();
        let val = $(this).parents('.btn-group').find('span');

        updateReserveFrom(val.attr('id'), 'minus');

    });

    // Click to minus button
    $(document).on('click', '.reserve__list-item', function (e) {
        e.preventDefault();

        let index = $(this).attr('id').replace('reserve-id-', '');
        setReserveFrom(parseInt(index));

    });

    // Submit reserve
    $(document).on('click', '#reserve-button', function (e) {
        e.preventDefault();

        if(currentPlaces < 1) {
            $('.reserve__message').html('<span class="alert-danger">Количество мест должно быть больше 0</span>');
            return false;
        }
        if($('#name').val().length < 3) {
            $('.reserve__message').html('<span class="alert-danger">Заполните поле имя</span>');
            return false;
        }
        if($('#tel').val().length !== 17) {
            $('.reserve__message').html('<span class="alert-danger">Заполните поле телефон</span>');
            return false;
        }

        let data = buildRequest($('#name').val(), $('#tel').val());

        //TODO send request with data here. Hardcode response now
        console.log(data);

        let response = true;
        if(response) {
            $(this).css('display', 'none');
            $('.reserve__message').html('<span class="alert-success">Забронировано</span>');

        } else {
            $('.reserve__message').html('<span class="alert-danger">Ошибка связи. Попробуйте еще раз</span>');
        }

    });

    //init calendar
    generateCalendar();

    //set mask for phone number
    $("#tel").mask("+38(050)000-00-00");
});