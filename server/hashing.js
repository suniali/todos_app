const bcrypto = require('bcryptjs');

var password = "Amin I Love You.";

bcrypto.genSalt(10, (err, salt) => {
    bcrypto.hash(password, salt, (err, hash) => {
        console.log('Password is : ', password);
        console.log('Password Secured is : ', hash);
    });
});

var hasedPassword = "$2a$10$sq5PDLcaRfnJEyEfWFlgR.GRrhWlW0.2l3CRY/sL7JobtPO49DmmG";

bcrypto.compare(password, hasedPassword, (err, success) => {
    console.log(success);

});