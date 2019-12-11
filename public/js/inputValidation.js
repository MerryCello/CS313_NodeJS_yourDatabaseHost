var isValidEmail = false;
var isValidUsername = false;
$(document).ready(() => {
    /**
     * This will login the user
     * */
    $("#loginSubmit").click(() => {
        let username=$("#username").val();
        let password=$("#password").val();
        
        // validate for empty parameters
        if(!username || !password) {
            $('#invalidLogin').fadeOut(150).fadeIn(300).html('Invalid username or password').show();
        } else {
            login(username, password);
        }

    });
    
    /**
     * This will validate before submitting new user request
     * */
    $('#addNewUser').click( async () => {
        let username   = $("#newUsername").val();
        let password1  = $("#newPassword1").val();
        let password2  = $("#newPassword2").val();
        let email      = $("#newEmail").val();
        let schemaCode = $("#schemaCode").val();
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        
        /**
         * START validation
         * */

        // for username already used
        await validateUsernameAgainstDB();

        // for email already used
        await validateEmailAgainstDB(email);

        // for empty username
        if(!username) {
            $('#invalidUsername').html('Please choose a username.').show();

        // for username already used
        } else if (!isValidUsername) {
            $('#invalidUsername').html('Username already in use.').show();

        // for invalid email
        } else if (!email.match(emailRegex)) {
            $('#invalidEmail').html('Please choose a valid email.').show();

        // for email already used
        } else if (!isValidEmail) {
            $('#invalidEmail').html('Email already in use.').show();

        // for empty password
        } else if (!password1) {
            $('#invalidPassword1').html('Please choose a password').show();

        // for not matching passwords
        } else if(!password1.match(password2) || !password2) {
            $('#invalidPassword1').hide();
            $('#invalidPassword2').html("Passwords don't match.").show();

        // for empty DB code
        } else if(!schemaCode) {
            $('#invalidSchemaCode').html('Please the enter requested schema code.').show();
        /**
         * END validation
         * */
        // if it got to here then it has past all the validation
        // SEND the new user to the DB
        } else {
            $('#invalidUsername').hide();
            $('#invalidEmail').hide();
            $('#invalidPassword').hide();
            $('#invalidSchemaCode').hide();
            $.post("/addNewUser", { username: username, email: email, password: password2, schemaCode: schemaCode }, (data) => {
                if (data === "success") {
                    $('body').html("<p>logging in...</p>");
                    login(username, password2);
                }
            });
        } 
    });
    
    $('#newUsername').change( async () => {
        await validateUsernameAgainstDB();
        if(isValidUsername) {
            $('#invalidUsername').hide();
        } else {
            $('#invalidUsername').html('Username already in use.').show();
        }
    });

    $('#newPassword1').change(() => {
        // TODO: regex validate password here
    });

    $('#signup').hide();
});

const validateEmailAgainstDB = async (email) => {
    if(email) {
        await $.post("/addNewUser", { email: email }, (response) => {
            if (!response.isUnique) {
                isValidEmail = false;
            } else {
                isValidEmail = true;
                $('#invalidEmail').hide();
            }
        });
    }
}

const validateUsernameAgainstDB = async () => {
    let username = $('#newUsername').val();
    // TODO: validate for empty string here
    await $.post("/addNewUser", { username: username }, (response) => {
        if (!response.isUnique) {
            isValidUsername = false;
        } else {
            isValidUsername = true;
            $('#invalidUsername').hide();
        }
    });
};

const showSignup = () => {
    $('#login').hide();
    $('#signup').show();
    $('#newUsername').focus();
};
const showLogin = () => {
    $('#signup').hide();
    $('#login').show();
    $('#username').focus();
};

const login = (username, password) => {
    $.post("/login", { username: username, password: password }, (data) => {
        if(data === 'valid') {
            $('#invalidLogin').hide();
            $('body').html("<p>logging in...</p>");
            window.location.href="/dashboard";
        } else {
            $('#invalidLogin').html('Invalid username or password').fadeOut(150).fadeIn(300);
        }
    });
};