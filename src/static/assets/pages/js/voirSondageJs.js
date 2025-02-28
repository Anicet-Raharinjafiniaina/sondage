$(document).ready(function () {
  /* const pageKey = 'hasVisited'
  if (localStorage.getItem(pageKey)) { // Vérifiez si l'utilisateur a déjà visité la page
    window.location.href = 'http://127.0.0.1:8000/'
    localStorage.removeItem('hasVisited')
  } else {
    localStorage.setItem(pageKey, 'true') // Sinon, marquez la page comme visitée
*/
  $('#lien_sondage').html('Lien du sondage : <a href= ' + window.location.href + '>' + window.location.href + '<a>')
  // var url_params = new URLSearchParams(window.location.search)

  $('#save_vote').click(function () {
    $('#save_vote').attr('disabled', true)
    if (($('.radio_button').is(':checked')) || ($('#name').val() != '')) {
    var name = $('#name').val()
    var id = $.trim($('input[type=radio]:checked').val())
      chekNameVote(name, id).then(is_exist_name => {
        console.log('is_exist_name => ' + is_exist_name);
        if (is_exist_name == 1) {
          swal({
            title: 'Information',
            text: 'Pour ce sondage, le nom ' + name + ' est déjà utilisé.',
            type: 'warning',
            timer: 3000,
            showConfirmButton: false
          });
          return;
        } else {          
      $.ajax({
        url: '/vote/save_choice/',
        method: 'POST',
        data: {
          'choice': id,
          'name': name
        },
        success: function (msg) {
          swal({
            title: 'Merci',
            text: 'Votre choix a été bien enregistré avec succés.',
            type: 'success',
            timer: 3000,
            showConfirmButton: false
          })
          $('#data').text('Votre choix a été bien enregistré avec succés.')
          $('.page-heading').hide()
          $('#save_vote').attr('disabled', false)
        },
        error: function (xhr, status, error) {
          swal({
            title: 'Erreur',
            text: 'Erreur dans la base de données. Merci de réessayer plus tard.',
            type: 'error',
            timer: 3000,
            showConfirmButton: false
          })
          $('#save_vote').attr('disabled', false)
        }
      })
        }
      }).catch(error => {
        swal({
          title: 'Erreur',
          text: 'Erreur dans la base de données. Merci de réessayer plus tard.',
          type: 'error',
          timer: 3000,
          showConfirmButton: false
        })
        $('#save_vote').attr('disabled', false)
      });
    } else {
      swal({
        title: 'Information',
        text: 'Veuillez remplir les champs obligatoires',
        type: 'warning',
        timer: 3000,
        showConfirmButton: false
      })
      $('#save_vote').attr('disabled', false)
    }
  })
})

function chekNameVote(name, id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/vote/checkName/',
      method: 'POST',
      data: {
        name: name,
        id: id
      },
      success: function (msg) {
        $('#save_vote').attr('disabled', false)
        resolve(msg.message);
      },
      error: function (xhr, status, error) {
        swal({
          title: 'Erreur',
          text: 'Erreur dans la base de données. Merci de réessayer plus tard.',
          type: 'error',
          timer: 3000,
          showConfirmButton: false
        });
        $('#save_vote').attr('disabled', false)
        reject(error);
      }
    });
  });
}