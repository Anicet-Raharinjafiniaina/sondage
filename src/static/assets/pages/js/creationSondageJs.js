var theType = ''
var inputType = ''
var isDate
$('.plus').hide()
$('#check').click(function () {
  if ($(this).prop('checked') == true) {
    // console.log("Checkbox est coché.")
    $('.colonne_list').val('')
    $('.colonne_list').attr('type', 'date')
    $('.plus').show()
    inputType = 'date'
    isDate = 1
  } else if ($(this).prop('checked') == false) {
    // console.log("Checkbox n'est pas coché.")
    $('.colonne_list').val('')
    $('.colonne_list').attr('type', 'text')
    $('.plus').hide()
    inputType = 'text'
    isDate = 0
  }
})

var i = 3
var nbCol = 3
var req = 'data-parsley-required="true"'
$('.colonne_list').attr('data-parsley-required="true"')
$('#add').click(function () {
  var maxId = getMaxId();
  console.log("Le chiffre maximum est : " + maxId);
  i = maxId + 1; // Mettre à jour i pour le prochain ajout
  nbCol = maxId + 1; 

  if ($('#check').is(':checked')) {
    var plus = '<input type="text" name="plus' + i + '" placeholder="plus de précision" id="other" class="form-control plus">'
  } else {
    var plus = ''
  }
  $('#nbColonne').text('(nombre de choix ' + nbCol + ')')
  $('#dynamic_field').append('<tr id="row' + i + '"><td class="input-group-text"><input type="' + inputType + '" name="colonne' + i + '"  class="form-control colonne_list" placeholder="choix ' + i + ' *" ' + req + '/> ' + plus + '</td><td><button type="button" name="remove" id="' + i + '" class="btn btn-danger btn_remove">x</button></td></tr>')
})

  function getMaxId() {
    var maxId = 0;
    $('#dynamic_field tbody tr td input[name^="colonne"]').each(function() {
      var id = $(this).attr('name');
      var num = parseInt(id.replace('colonne', ''), 10);
      if (num > maxId) {
        maxId = num;
      }
    });
    return maxId;
  }

$(document).on('click', '.btn_remove', function () {
  var button_id = $(this).attr('id')
  $('#row' + button_id + '').remove()
  setTimeout(function() {
    renumberFields();
  }, 500);
})

function renumberFields() {
  var i = 1;
  $('#dynamic_field tr').each(function() {
    $(this).attr('id', 'row' + i);
    $(this).find('input[name^="colonne"]').attr('name', 'colonne' + i).attr('id', 'colonne' + i).attr('placeholder', 'choix ' + i + ' *');
    $(this).find('.btn_remove').attr('id', i);
    i++;
  });
  nbCol = i - 1;
  $('#nbColonne').text('(nombre de choix ' + nbCol + ')');
}

function reloadPage () {
  location.reload(true)
}

$('#save').click(function () {
  $('#save').attr('disabled', true)
  event.preventDefault()
  if ($('#titre').val() != '' && $("input[name='colonne1']").val() != '' && $("input[name='colonne2']").val() != '') {
    var dataInForm = $('#form').serializeArray()
    var anonyme = $('#anonyme').is(':checked')
    var dataAnonyme = [{
      name: 'anonyme',
      value: anonyme
    }]
    formData = dataInForm.concat(dataAnonyme)
    $.ajax({
      url: '/vote/save_sondage/',
      method: 'POST',
      data: formData,
      success: function (id) {
        $('#form').hide()
        $('#lien').html("<a href='/vote/show_sondage/" + encodeURIComponent(id) + "' > Afficher le sondage que vous venez de créer </a> ")
        $('#refresh').html('<button type="button " class="btn btn-sucess btn-sm" onclick="reloadPage()">Créer un autre sondage</button>')
        $('#titre_creation').text('')
        $('#save').attr('disabled', true)
      }, error: function (xhr, status, error) {
        swal({
          title: 'Erreur',
          text: 'Erreur dans la base de données. Merci de réessayer plus tard.',
          type: 'error',
          timer: 3000,
          showConfirmButton: false
        })
        $('#save').attr('disabled', false)
      }
    })
  } else {
    swal({
      title: 'Information',
      text: 'Veuillez remplir les champs obligatoires',
      type: 'warning',
      timer: 3000,
      showConfirmButton: false
    })
    $('#save').attr('disabled', false)
  }
})