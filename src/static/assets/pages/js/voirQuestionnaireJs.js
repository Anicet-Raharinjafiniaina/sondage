$(document).ready(function() {
    $("#lien").html("Lien du sondage : <a href= " + window.location.href + ">" + window.location.href + "<a>");
    var url_params = new URLSearchParams(window.location.search);

    $("#save").click(function() {
        if (($('#name').val() != "")) {
            var dataInForm = $('#form').serializeArray();
            $.ajax({
                url: "../Home/saveReponse",
                method: "POST",
                data: {
                    'dataForm': dataInForm,
                    'id': url_params.get('id')
                },
                success: function(msg) {
                    swal({
                        title: "Merci",
                        text: "Vos réponses ont été enregistrées avec succés.",
                        type: "success",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                    $('#data').text("Vos réponses ont été bien enregistrées avec succés.");
                    $('.page-heading').hide();
                },
                error: function(xhr, status, error) {
                    swal({
                        title: "Erreur",
                        text: "Erreur dans la base de donn\351es. Merci de r\351essayer plus tard.",
                        type: "error",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                }
            });
        } else {
            swal({
                title: "Erreur",
                text: "Veuillez remplir les champs obligatoires",
                type: "error",
                timer: 3000,
                showConfirmButton: false,
            });
        }
    });
});