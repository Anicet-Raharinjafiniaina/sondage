$(document).ready(function () {
    /* const pageKey = 'hasVisited'
    if (localStorage.getItem(pageKey)) { // Vérifiez si l'utilisateur a déjà visité la page
      window.location.href = 'http://127.0.0.1:8000/'
      localStorage.removeItem('hasVisited')
    } else {
      localStorage.setItem(pageKey, 'true') // Sinon, marquez la page comme visitée
  */
    $('#lien').html('Lien du vote : <a href= ' + window.location.href + '>' + window.location.href + '<a>')
    // var url_params = new URLSearchParams(window.location.search)
  
    $('#save_reponse').click(function () {
      var empty_val = getEmptyRequiredInputs()
        if(empty_val == ""){
          data_infos = getData('.data_infos', 'input')
          questions = getData('.questions', 'input, textarea');
         
          chekName(data_infos, questions).then(is_exist_name => {
            console.log('is_exist_name => ' + is_exist_name);
            if (is_exist_name == 1) {
              swal({
                title: 'Information',
                text: 'Pour ce questionnaire, le nom ' + $('#name').val() + ' est déjà utilisé.',
                type: 'warning',
                timer: 3000,
                showConfirmButton: false
              });
              return;
            } else {
            $.ajax({
              url: '/questionnaire/save_response/',
              method: 'POST',
              data: {
                data_infos : data_infos,
                questions : questions
              },
              success: function (msg) {
                swal({
                  title: 'Merci',
                  text: 'Enregistré avec succés.',
                  type: 'success',
                  timer: 3000,
                  showConfirmButton: false
                })
                $('#data').text('Vos opinons ont été bien enregistrés avec succés.')
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
            }
          }).catch(error => {
            swal({
              title: 'Erreur',
              text: 'Erreur dans la base de données. Merci de réessayer plus tard.',
              type: 'error',
              timer: 3000,
              showConfirmButton: false
            })
          });
      }else {
        swal({
          title: 'Information',
          text: 'Veuillez remplir les champs obligatoires',
          type: 'warning',
          timer: 3000,
          showConfirmButton: false
        })
      }
    })
  })
  
  function getEmptyRequiredInputs() {
    const requiredInputs = document.querySelectorAll('textarea.obligatoire');
    const emptyIds = [];
    requiredInputs.forEach(textarea => {
        if (textarea.value.trim() === "") {
            emptyIds.push(textarea.id);
            $('#' + textarea.id + '-error').text(" Ce Champ est obligatoire.");
        }else {
          $('#' + textarea.id + '-error').text("");
      }
    });
    return emptyIds.length === 0 ? "" : emptyIds;
  }
  
  function getData(containerClass, inputTypes) {
    const data = {};
    const inputs = document.querySelectorAll(`${containerClass} ${inputTypes}`);
    inputs.forEach(input => {
        const name = input.name || input.id; // Utilise le name si disponible, sinon l'id
        if (name) {
            if (input.type === 'checkbox') {
                data[name] = input.checked; // Pour les checkboxes, retourne true/false
            } else {
                data[name] = input.value; // Pour les autres types, retourne la valeur
            }
        }
    });
    return JSON.stringify(data);
  }
  
  function chekName(data_infos, questions) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/questionnaire/checkName/',
        method: 'POST',
        data: {
          data_infos: data_infos,
          questions: questions
        },
        success: function (msg) {
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
          reject(error);
        }
      });
    });
  }
  