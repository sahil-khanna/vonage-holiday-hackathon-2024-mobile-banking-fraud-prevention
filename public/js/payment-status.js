$('#home').on('click', () => {
  window.location.href = 'index.html';
});

$(window).load(function () {
  const paymentStatus = getQueryParameter('status');
  if (paymentStatus == 'error') {
    $('#status-image').attr('src', 'images/error.png');
    $('#order-info-text').text('The payment failed. Please retry after some time.');
  }
});

function getQueryParameter(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}