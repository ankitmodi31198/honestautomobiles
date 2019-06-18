var Notifs = function () {

    return {
        //main function to initiate the module
        init: function () {

            toastr.options = {
                "closeButton": true,
                "debug": false,
                "positionClass": "toast-top-right",
                "onclick": null,
                "showDuration": "1000",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };

            var data = $('.fury-notify.fury-success'),
                message = data.find('.message').text();
            if(!message == ''){
                toastr['success'](message, "Success");
            }

            var errdata = $('.fury-notify.fury-danger'),
                errmsg = errdata.find('.message').text();
            if(!errmsg == ''){
                toastr['error'](errmsg, "Error");
            }


        }

    };

}();

jQuery(document).ready(function() {
    Notifs.init();
});