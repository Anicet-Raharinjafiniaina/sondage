$(document).ready(function () {
  $('#stop_voting').hide()
})
$('#listSondage').on('change', function () {
  $('#stop_voting').show()
  var sondage = $('#listSondage').val()
  $.ajax({
    url: '/vote/get_info_detail/',
    method: 'POST',
    data: {
      'id': sondage
    },
    success: function (sondageData) {
      titreForTable(sondageData.colonne_titre)
      dataForTable(sondageData.titre_id, sondageData.data_result)
      $('#nb_vote').text(sondageData.nb_participant)
      $('#nb_total').text(sondageData.nb_total_sondage)
      $('#titre_sondage').text('Résultat du sondage : ' + sondageData.titre)

      if (sondageData.actif == true) {
        $('#actif').prop('checked', true)
      } else if (sondageData.actif == false) {
        $('#actif').prop('checked', false)
      }

      $('#actif').on('change', function () {
        if ($('#actif').is(':checked')) {
          var txtActif = 'Activation'
          var valActif = 1
        } else {
          var txtActif = 'Désactivation'
          var valActif = 0
        }
        $.ajax({
          url: '/vote/update_status/',
          method: 'POST',
          data: {
            'id': sondage,
            'actif': valActif
          },
          success: function (datamsg) {
            swal({
              title: txtActif,
              text: txtActif + " du sondage d'opinon faite avec succès.",
              type: 'success',
              timer: 3000,
              showConfirmButton: false
            })
          }
        })
      })

      var xValues = sondageData.colonne_titre
      var yValues = sondageData.resultat_sondage
      var barColors = ['gold', 'green', 'blue', 'orange', 'violet', 'silver', 'yellow', 'indigo', 'red', 'purple', 'pink', 'brown', 'black']

      var data = [{
        x: xValues,
        y: yValues,
        type: 'bar',
        marker: {
          color: barColors
        }
      }]

      var layout = {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: {
          color: '#7c8db5'
        },
        xaxis: {
          showgrid: false,
          zeroline: true
        },
        yaxis: {
          showline: true
        },
        displaylogo: false
      }

      var config = {
        displayModeBar: false
      }
      Plotly.newPlot('chartBar', data, layout, config)

      var data1 = [{
        labels: xValues,
        values: yValues,
        type: 'pie',
        marker: {
          colors: barColors
        }
      }]
      var layout1 = {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: {
          color: '#7c8db5'
        },
        xaxis: {
          showgrid: false,
          zeroline: true
        },
        yaxis: {
          showline: true
        },
        displaylogo: false
      }

      var config1 = {
        displayModeBar: false
      }

      Plotly.newPlot('chartPie', data1, layout1, config1)
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
})

function titreForTable (arrTitre) {
  $('#tbl_result thead').html('')
  var $thead = $('#tbl_result thead')
  var $row = $('<tr></tr>')
  $row.append('<th class="text-center">Nom</th>')
  for (let index = 0; index < arrTitre.length; index++) {
    $row.append('<th class="text-center">' + arrTitre[index] + '</th>')
  }
  $thead.append($row)
}

function dataForTable (arrTitreId, arrDetailVote) {
  $('#tbl_result tbody').html('')
  var newRow = ''
  $.each(arrDetailVote, function (i, objet) {
    newRow += ('<tr><td class="text-center bg-transparent">' + objet.nom + '</td>')
    for (let index = 0; index < arrTitreId.length; index++) {
      if (objet.vote_detail_id == arrTitreId[index]) {
        newRow += '<td class="text-center text-green fontawesome-ok"><span class="fa-fw select-all fas"></span></td>'
      } else {
        newRow += ('<td class="text-center"></td>')
      }
    }
    newRow += ('</tr>')
  })
  $('#tbl_result tbody').append(newRow)
}
