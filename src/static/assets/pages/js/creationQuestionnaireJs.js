var i = 1
var req = 'data-parsley-required="true"'
$('#titre').val('')
$('#question1').val('')
$('#question2').val('')

$('.questionnaire_list').attr('data-parsley-required="true"')
$('#add').click(function () {
  i++
  $('#dynamic_field').append('<tr id="row' + i + '"><td class="input-group-text"><input type="text" name="question' + i + '"  class="form-control questionnaire_list" placeholder="question ' + i + ' *" ' + req + '/></td><td><button type="button" name="remove" id="' + i + '" class="btn btn-danger btn_remove">x</button></td></tr>')
})

$(document).on('click', '.btn_remove', function () {
  var button_id = $(this).attr('id')
  $('#row' + button_id + '').remove()
})

function reloadPage () {
  location.reload(true)
}

$('#save').click(function () {
  // event.preventDefault()
  if ($('#titre').val() != '' && $("input[name='question1']").val() != '') {
    var dataInForm = $('#form').serializeArray()
    var anonyme = $('#anonyme').is(':checked')
    var dataAnonyme = [{
      name: 'anonyme',
      value: anonyme
    }]
    formData = dataInForm.concat(dataAnonyme)
    $.ajax({
      url: '../Home/saveQuestionnaire',
      method: 'POST',
      data: formData,
      success: function (id) {
        $('#form').hide()
        $('#lien').html("<a href='../Home/showQuestionnaireLink?id=" + encodeURIComponent(id) + "' > Afficher le formulaire que vous venez de créer </a> ")
        $('#refresh').html('<button type="button " class="btn btn-sucess btn-sm" onclick="reloadPage()">Créer un autre formulaire</button>')
        $('#titre_creation').text('')
      },
      error: function (xhr, status, error) {
        swal({
          title: 'Erreur',
          text: 'Erreur dans la base de données. Merci de réessayer plus tard.',
          type: 'error',
          timer: 3000,
          showConfirmButton: false
        })
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
  }
})
