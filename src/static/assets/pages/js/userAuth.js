function send_user_infos() {
    $('#content-error').text("")
    $("#btn-login").attr("disabled", true);
    if($('#username').val() =="" || $('#password').val() ==""){
        $('#content-error').text("Le login et le mot de passe sont requises")
        $("#btn-login").attr("disabled", false);
    }else{
        $.ajax({
            url: '/check_account/',
            method: 'POST',
            data: {
              'username': $('#username').val(),
              'password': $('#password').val()
            },
            success: function (datamsg) {
                console.log(datamsg.message);
                if(datamsg.message == 'success'){
                    $("#btn-login").attr("disabled", false);
                    $('#content-error').text("")
                    window.location.href = "/accueil/";
                }else{
                    $("#btn-login").attr("disabled", false);
                    $('#content-error').text("Login  ou mot de passe incorrect")
                }
            }
          })
    }

}