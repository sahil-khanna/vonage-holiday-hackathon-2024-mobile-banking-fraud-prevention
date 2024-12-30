let userId = sessionStorage.getItem('userId');

$('#pay-now').on('click', () => {
  $('#payment-body').waitMe();
  const settings = {
    url: 'http://localhost:3000/transaction',
    method: 'POST',
    timeout: 0,
    headers: {
      accept: '*/*',
      userId: userId,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      amount: 104.85,
      targetAccountNumber: '006601543625',
      ifsc: '00666204948',
    }),
  };

  $.ajax(settings).done(function (response) {
    $('#payment-body').waitMe('hide');
    if (response.code == 0) {
      window.location.href = 'payment-status.html';
    } else if (response.code == 1) {
      Swal.fire({
        text: 'Enter OTP',
        input: 'number',
        inputAttributes: {
          min: 0,
          max: 999999,
          autocomplete: 'off',
        },
        confirmButtonText: 'Submit',
        allowOutsideClick: false,
        preConfirm: async (otp) => {
          const response = await validateOtp(otp);
          if (response.code == 0) {
            window.location.href = 'payment-status.html';
          } else {
            window.location.href = 'payment-status.html?status=error';
          }
        },
      });
    } else {
      window.location.href = 'payment-status.html?status=error';
    }
  });

  function validateOtp(otp) {
    return new Promise((resolve, _reject) => {
      const settings = {
        url: 'http://localhost:3000/transaction/otp',
        method: 'POST',
        timeout: 0,
        headers: {
          accept: '*/*',
          userId: userId,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          otp: parseInt(otp),
        }),
      };

      $.ajax(settings).done(function (response) {
        resolve(response);
      });
    });
  }
});