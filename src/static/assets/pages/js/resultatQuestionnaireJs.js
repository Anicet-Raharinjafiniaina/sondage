$(document).ready(function() {
    $('#status').hide();
    $('#listQuestionnaire').on('change', function() {
        $('#nb_vote').text('0');
        $('#status').show();
        $('#resultat').html("");
        $.ajax({
            url: "../Home/detailResultatQuestionnaire",
            method: "POST",
            data: {
                'id': $('#listQuestionnaire').val(),
            },
            success: function(data) {
                var arr = JSON.parse(data);
                var compteur = 0;
                $('#lien').html(arr['lien'][0]);

                $.each(arr['result'][0], function(index, obj) {
                    compteur++;
                    $.each(obj.dataForm, function(i, field) {
                        $('#resultat').append("<i>" + field.name + "</i> <br> <b> - " + field.value + "<b><br>");
                    });
                    $('#resultat').append("-----------------------------------------------------------<br>");
                    $('#nb_vote').text(compteur);
                });

                if (arr['status'][0] == 0 || arr['status'][0] == null) {
                    $('#actif').prop('checked', true);
                } else if (arr['status'][0] == 1) {
                    $('#actif').prop('checked', false);
                }

                $('#status').on('change', function() {
                    if ($('#actif').is(':checked')) {
                        var txtActif = "Désactivation";
                        var valActif = 0;
                    } else {
                        var txtActif = "Activation";
                        var valActif = 1;
                    }
                    $.ajax({
                        url: "../Home/majActifQuestionnaire",
                        method: "POST",
                        data: {
                            'id': $('#listQuestionnaire').val(),
                            'actif': valActif,
                        },
                        success: function(datamsg) {
                            swal({
                                title: txtActif,
                                text: txtActif + " du lien du formulaire faite avec succès.",
                                type: "success",
                                timer: 3000,
                                showConfirmButton: false,
                            });
                        }
                    });
                });
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
    });
});