var remove = (i) => {
    // let id = $('#id'+i).val();
    // $.post('/q/removeBundle', {id: id}, (result) => {
    //     // alert("result:"+JSON.stringify(result));
    //     $('#content').html(result);
    // });
};

var edit = (i) => {
    $('#edit'+i).hide();
    $('#remove'+i).hide();
    $('#save'+i).show();
    $('#cancel'+i).show();
    $('#bundle_name'+i).removeClass('input-disabled').prop('disabled', false).focus();
    $('#user_name'+i).removeClass('input-disabled').removeClass('link').prop('disabled', false);
    $('#emailAnchor'+i).removeAttr("href");
    $('#takenDate'+i).removeClass('input-disabled').prop('disabled', false);
    $('#takenDateIcon'+i).show();
};

var cancel = (i) => {
    // cancel adding a new bundle
    if (i == null) {
        $('#bundle_name').hide().val('');
        $('#user_name').hide().val('');
        $('#newDateGroup').hide()
        $('#newDate').val('');
        $('#addSubmit').hide();
        $('#cancel').hide();
        $('#add').show();
    // cancel editting bundle
    } else {
        $('#edit'+i).show();
        $('#remove'+i).show();
        $('#save'+i).hide();
        $('#cancel'+i).hide();
        $('#bundle_name'+i).addClass('input-disabled').prop('disabled', true).val(rentalRows[i].bundle_name);
        $('#user_name'+i).addClass('input-disabled').addClass('link').prop('disabled', true).val(rentalRows[i].user_name);
        $('#emailAnchor'+i).attr('href', 'mailto:' + rentalRows[i].user_email);
        $('#takenDate'+i).addClass('input-disabled').prop('disabled', true).val(rentalRows[i].takenDate);
        $('#takenDateIcon'+i).hide();
    }
};

var save = (i) => {
    // let id = $('#id'+i).val();
    // let name = $('#name'+i).val();
    // let description = $('#description'+i).val();
    // let price = $('#price'+i).val();
    // let img_url = $('#img_url'+i).val();
    // $.post(
    //     '/q/updateBundle',
    //     {
    //         id: id,
    //         name: name,
    //         description: description,
    //         price: price,
    //         img_url: img_url
    //     },
    //     (res) => {
    //         cancel(i);
    //         // alert(res);
    //         $('#id'+i).val(res.id);
    //         $('#name'+i).val(res.name);
    //         $('#description'+i).val(res.description);
    //         $('#price'+i).val((Math.round(res.price * 100)/100).toFixed(2));
    //         let textarea = "";
    //         let a = "";
    //         if(res.img_url != null && res.img_url != "") {
    //             textarea = "<textarea name=\"img_url\" id=\"img_url"+i+"\" cols=\"20\" rows=\"1\" onClick=\"this.select();\">"+res.img_url+"</textarea>";
    //             a = "<a id=\"imageAnchor"+i+"\" href=\""+res.img_url+"\" target=\"_blank\" rel=\"noopener noreferrer\">image&nbsp;<sup><i class=\"fas fa-external-link-alt fa-xs\"></i></sup></a>";
    //         } else {
    //             textarea = "<textarea name=\"img_url\" id=\"img_url"+i+"\" cols=\"20\" rows=\"1\" onClick=\"this.select();\"></textarea>";
    //             a = "<span id=\"imageAnchor"+i+"\">no url provided</span>";
    //         }
    //         $('#img'+i).html(textarea + a);
    //         $('#img_url'+i).hide();
    //         rentalRows[i].id = res.id;
    //         rentalRows[i].name = res.name;
    //         rentalRows[i].description = res.description;
    //         rentalRows[i].price = res.price;
    //         rentalRows[i].img_url = res.img_url;
    //     }
    // );
};

$(document).ready(() => {
    const nextChar = (c) => {
        return String.fromCharCode(c.charCodeAt(0) + 1);
    };
    const searchDB = () => {
        let data = {
            query:  $('#query').val(),
            date:  $('#date').val()
        }
        $.get('/searchRentals', data, (result) => {
            result = JSON.parse(result);
            rentalRows = [];
            $('.rowsNum').html(result.rowsNum);
            $('#rows').html(result.rows);
        });
        // $('#rows').html("searching for \"" + ((data.query) ? data.query : data.date) + "\"...");
    };

    // Calendar date/time picker
    // For search
    $(() => {
        $('#datePicker').datetimepicker({
            format:'DD/MM/YYYY',
            collapse: false
        });
    });
    // For new rental
    $(() => {
        $('#dateTimePicker').datetimepicker({
            format: 'DD/MM/YYYY HH:mm',
            icons: {
                time: "far fa-clock",
                date: "fas fa-calendar-alt",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            }
        });
    });

// build letter search bar and set the page up
    let letterSearchHTML = "";
    for(let c = 'A'; c != nextChar('Z'); c = nextChar(c)) {
        letterSearchHTML += "<button class=\"btn btn-default link\" onclick=\"searchByLetter('"+ c +"')\"><b>"+ c +"</b></button>";
        if(c == 'L') {
            $('#letterSearchBar1').html(letterSearchHTML);
            letterSearchHTML = "";
        }
        if (c == 'W') {
            $('#letterSearchBar2').html(letterSearchHTML);
            letterSearchHTML = "";
        }
    }
    $('#letterSearchBar3').html(letterSearchHTML);
    $('#addSubmit').hide();
    $('#cancel').hide();
    $('#bundle').hide();
    $('#user').hide();
    $('#newDateGroup').hide();
    $('#bundle_name').hide();
    $('#user_name').hide();


    // onclick listeners
    $('#search').click(searchDB);
    $('#searchIcon').click(searchDB);
    $('#query').on('input', searchDB);
    $('#date').on('input', searchDB);
    $('#showDate').click(() => {
        $('#query').val(null);
        $('#queryGroup').hide();
        $('#dateGroup').show()
        $('#date').focus();
    });
    $('#showQuery').click(() => {
        $('#date').val(null);
        $('#dateGroup').hide();
        $('#queryGroup').show()
        $('#query').focus();
    });
    $('#add').click(() => {
        $('#addSubmit').show();
        $('#cancel').show();
        $('#bundle').show();
        $('#user').show();
        $('#newDateGroup').show();
        $('#bundle_name').show().focus();
        $('#user_name').show();
        $('#add').hide();
    });
    $('#addSubmit').click(() => {
//    TODO: build a way to add a new rental
    });
    $('#cancel').click(() => { cancel(); });
});