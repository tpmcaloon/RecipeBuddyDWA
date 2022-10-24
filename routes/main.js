module.exports = function(app, shopData) {

    // Handle our routes

    //Index Page -----------------------------------------------------------------------
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });

    //About Page -----------------------------------------------------------------------
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });

    //Search + Search Results Page -----------------------------------------------------------------------
    app.get('/search',function(req,res){
        res.render("search.ejs", shopData);
    });
    app.get('/search-result', function (req, res) {
        //searching in the database
        //res.send("You searched for: " + req.query.keyword);
        let sqlquery = "SELECT * FROM books WHERE name LIKE '%" + req.query.keyword + "%'"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData)
            res.render("list.ejs", newData)
        });        
    });

    //Register + Registered Page -----------------------------------------------------------------------
    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);                                                                     
    });                                                                                                 
    app.post('/registered', function (req,res) {
        // Password Hashing
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const plainPassword = req.body.password;

        // saving data in database
        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
            let sqlquery = "INSERT INTO users (username, firstname, lastname, email, hashedpassword) VALUES (?, ?, ?, ?, ?)";
            let newrecord = [req.body.username, req.body.firstname, req.body.lastname, req.body.email, hashedPassword];
            
            db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            else
            var result = 'Hello '+ req.body.firstname + ' '+ req.body.lastname +' you are now registered! We will send an email to you at ' + req.body.email;
            result += ' Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
            res.send(result);
            })
        })
    });

    //List Books Page -----------------------------------------------------------------------
    app.get('/list', function(req, res) {
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData)
            res.render("list.ejs", newData)
        });
    });

    //List Users Page -----------------------------------------------------------------------
    app.get('/listusers', function(req, res) {
        let sqlquery = "SELECT * FROM users"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {registeredUsers:result});
            console.log(newData)
            res.render("listusers.ejs", newData)
        });
    });

    //Add Book + Book Added Page -----------------------------------------------------------------------
    app.get('/addbook', function (req, res) {
        res.render('addbook.ejs', shopData);
    });
    app.post('/bookadded', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
        // execute sql query
        let newrecord = [req.body.name, req.body.price];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            else
            res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price);
        });
    });

    //Bargain Books Page -----------------------------------------------------------------------
    app.get('/bargainbooks', function(req, res) {
        let sqlquery = "SELECT * FROM books WHERE price < 20";
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData)
            res.render("bargains.ejs", newData)
        });
    });

    //Login + Logged In Page -----------------------------------------------------------------------
    app.get('/login', function (req,res) {
        res.render('login.ejs', shopData);                                                                     
    });
    app.post('/loggedin', function (req,res) {
            // Password Hashing
            const bcrypt = require('bcrypt');

            let hashedPassword = "SELECT HashedPassword FROM users WHERE Username = ?";
            db.query(hashedPassword, (err, result) => {
                if(err){
                    res.redirect('./')
                }else{
                    result = hashedPassword;
                }
            })
            console.log(hashedPassword);
            
            // Compare the password supplied with the password in the database
            bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
                if (err) {
                    // TODO: Handle error
                    console.log('SQL Error')
                }
                else if (result == true) {
                    // TODO: Send message
                    console.log('Logged In');
                }
                else {
                    // TODO: Send message
                    console.log('Wrong Password or Username');
                }
            });
        });

    //Delete Users Page -----------------------------------------------------------------------
    app.get('/deleteuser', function(req, res) {
        let sqlquery = "SELECT * FROM users"; // query database to get all the users
        let sqldeletequery = "DELETE FROM users WHERE Username = ?"
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {registeredUsers:result});
            console.log(newData)
            res.render("deleteuser.ejs", newData)
        });
    });
}