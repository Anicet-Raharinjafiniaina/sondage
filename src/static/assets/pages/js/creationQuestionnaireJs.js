var i = 1
var req = 'data-parsley-required="true"'
$('#titre').val('')
$('#question1').val('')
$('#question2').val('')

$('.questionnaire_list').attr('data-parsley-required="true"')
$('#add_question').click(function () {
  i++
  $('#dynamic_field').append('<tr id="row' + i + '"><td class="input-group-text"><input type="text" id="question' + i + '" name="question' + i + '"  class="form-control questionnaire_list" data-parsley-required="true" placeholder="question ' + i + ' *" ' + req + '/></td><td>  <div class="theme-toggle d-flex gap-2 align-items-center mt-2" style="margin-left:20px;"id="obligatoire"> <fieldset class="form-group"><div class="form-check form-switch"><input class="form-check-input" type="checkbox" name="obligatoire'+ i +'" id="obligatoire'+ i +'" value="0"/> <span> obligatoire </span> </div> </fieldset></div></td><td><button type="button" name="remove" id="' + i + '" class="btn btn-danger btn_remove">x</button></td></tr>')
})

$(document).on('click', '.btn_remove', function () {
  var button_id = $(this).attr('id')
  $('#row' + button_id + '').remove()
})

function reloadPage () {
  location.reload(true)
}

function checkValue(id) {
  for (let index = 1; index < 100; index++) {
    let element = document.getElementById(id + index);
    if (element && element.value == "") {
      return false;
    }
  }
  return true;
}


$('#save_questionnaire').click(function () {
  $('#save_questionnaire').attr('disabled', true)
  if ($('#titre').val() != '' && checkValue('question')) {
    var formData = $('#form').serializeArray()
    $.ajax({
      url: '/questionnaire/save_sondage/',
      method: 'POST',
      data: formData,
      success: function (id) {
        $('#form').hide()
        $('#titre_page').text("Création questionnaire faite.") 
        $('#lien_questionnaire').html("<a href='/questionnaire/show_sondage/" + encodeURIComponent(id) + "' > Afficher le formulaire que vous venez de créer </a> ")
        $('#refresh').html('<button type="button " class="btn btn-sucess btn-sm" onclick="reloadPage()">Créer un autre formulaire</button>')
        $('#titre_creation').text('')
        $('#save_questionnaire').attr('disabled', false)
      },
      error: function (xhr, status, error) {        
        swal({
          title: 'Erreur',
          text: 'Erreur dans la base de données. Merci de réessayer plus tard.',
          type: 'error',
          timer: 3000,
          showConfirmButton: false
        })
        $('#save_questionnaire').attr('disabled', false)
      }
    })
  } else {
    swal({
      title: 'Erreur',
      text: 'Veuillez remplir les champs obligatoires',
      type: 'error',
      timer: 3000,
      showConfirmButton: false
    })
    $('#save_questionnaire').attr('disabled', false)
  }
})
