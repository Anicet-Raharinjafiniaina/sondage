$(document).ready(function() {
    $('#status').hide();
    $('#listQuestionnaire').on('change', function() {
        $('#nb_pers').text('0');
        $('#status').show();
        $('#resultat').html("");
        if ($('#listQuestionnaire').val() != 0){
            $.ajax({
                url:  '/questionnaire/get_detail/',
                method: "POST",
                data: {
                    id : $('#listQuestionnaire').val(),
                },
                success: function(data) {            
                    var questionnaire = data.result.questionnaire;
                    var actif = questionnaire.actif                
                    var compteur = 0;
                    $('#lien_quest').html(data.result.lien_questionnaire)
    
                    for (const nom in data.result.reponse) {
                        if (data.result.reponse.hasOwnProperty(nom)) {
                            $('#resultat').append("<b> - " + nom + "</b><br>");
                            for (const question in data.result.reponse[nom]) {
                                $('#resultat').append("<i>" + question + "</i><br>");
                                $('#resultat').append(" -> "+data.result.reponse[nom][question] + "<br>");
                           }
                           $('#resultat').append("-----------------------------------------------------------<br>");
                        }
                        compteur++
                    }
                    $('#nb_pers').text(compteur);
                    
                    if (actif == true) {
                        $('#actif').prop('checked', true);
                    } else {
                        $('#actif').prop('checked', false);
                    }
    
                    $('#actif').on('change', function() {
                        $('#actif').attr('disabled', true)
                        if ($('#actif').is(':checked')) {
                            var txtActif = "Activation";
                            var valActif = 1;
                        } else {
                            var txtActif = "Désactivation";
                            var valActif = 0;
                        }
                        $.ajax({
                            url: '/questionnaire/update_status/',
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
                                $('#actif').attr('disabled', false)
                            }
                        });
                    });
                },
                error: function(xhr, status, error) {
                    swal({
                        title: "Erreur",
                        text: "Erreur dans la base de données. Merci de réessayer plus tard.",
                        type: "error",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                    $('#actif').attr('disabled', false)
                }
            });
        }else{
            $('#nb_pers').text('0');
            $('#status').hide();
            $('#resultat').html("");
            $('#actif').attr('disabled', false)
        }
    });
});