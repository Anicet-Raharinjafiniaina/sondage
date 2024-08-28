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

  $('#save_sondage').click(function () {
    if (($('.radio_button').is(':checked')) || ($('#name').val() != '')) {
      // var currentUrl = window.location.href
      // var match = currentUrl.match(/\/(\d+)\/$/)
      $.ajax({
        url: '/opinon/save_choice/',
        method: 'POST',
        data: {
          'choice': $.trim($('input[type=radio]:checked').val()),
          'name': $('#name').val(),
        // 'id': match[1] // id se trouve dans le lien
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
        title: 'Information',
        text: 'Veuillez remplir les champs obligatoires',
        type: 'warning',
        timer: 3000,
        showConfirmButton: false
      })
    }
  })
// }
})
