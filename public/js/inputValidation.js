// NOTE: input validation
$(document).ready(function(){
    $('#form').submit(function(event){
        let maxValue = 0;
        let minValue = 0.01;
        let weight = $('#weight').val();
        switch ($('#mailType').val()) {
            case 'Letters (Stamped)':
                maxValue = 3.5;
                break;
            case 'Letters (Metered)':
                maxValue = 3.5;
                break;
            case'Large Envelopes (Flats)':
                maxValue = 13;
                break;
            case 'First-Class Package Service—Retail':
                maxValue = 13;
                break;
            default:
                maxValue = 0;
                break;
        }
        if(!weight.match(/^\d+\.\d{0,3}$/)) {
            alert("Please enter a decimal point number");
            event.preventDefault();
        } else if (weight < minValue || weight > maxValue) {
            alert("Ounces must be between " + minValue + " and " + maxValue);
            event.preventDefault();
        } else {
            return;
        }
    });
});